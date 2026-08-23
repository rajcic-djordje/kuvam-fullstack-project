import mongoose from "mongoose"
import AppError from "../errors/appError.js"
import Offer from "../models/offer.js"
import Seller from "../models/seller.js"
import Order from "../models/order.js"
import {SELLER_APPROVAL_STATUS} from "../constants/seller.js"
import {ORDER_STATUS} from "../constants/order.js"
import {NOTIFICATION_TYPE} from "../constants/notification.js"
import {createNotification} from "./notificationService.js"
import {
    generatePickupCode,
    isPickupCodeValid
} from "../utils/pickupCode.js"

const MAX_PICKUP_CODE_ATTEMPTS = 5
const PICKUP_CODE_BLOCK_DURATION_MS = 15 * 60 * 1000

const getOrderNotificationLabel = order => {
    const firstItem = order.items[0]

    if (!firstItem) {
        return "porudžbinu"
    }

    if (order.items.length === 1) {
        return `„${firstItem.name}“`
    }

    return `„${firstItem.name}“ + još ${order.items.length - 1}`
}

const populateBuyerOrder = query => {
    return query
        .populate({
            path: "items.offer",
            select: "name description category imageUrl unit isActive"
        })
        .populate({
            path: "seller",
            select: "businessName description city pickupAddress",
            populate: {
                path: "city",
                select: "name slug"
            }
        })
}

const populateSellerOrder = query => {
    return query
        .populate({
            path: "items.offer",
            select: "name description category imageUrl unit isActive"
        })
        .populate({
            path: "buyer",
            select: "firstName lastName email"
        })
}

const restoreOrderQuantities = async order => {
    const operations = order.items.map(item => ({
        updateOne: {
            filter: {_id: item.offer},
            update: {
                $inc: {
                    availableQuantity: item.quantity
                }
            }
        }
    }))

    if (operations.length === 0) {
        return
    }

    await Offer.bulkWrite(operations)
}

const createOrder = async (buyerId, orderData) => {
    const offerIds = orderData.items.map(item => item.offerId)

    const offers = await Offer.find({
        _id: {$in: offerIds}
    })

    if (offers.length !== offerIds.length) {
        throw new AppError(
            "One or more offers were not found.",
            404,
            "OFFER_NOT_FOUND"
        )
    }

    const offersById = new Map(
        offers.map(offer => [offer._id.toString(), offer])
    )

    const firstOffer = offersById.get(orderData.items[0].offerId)

    if (!firstOffer) {
        throw new AppError(
            "Offer not found.",
            404,
            "OFFER_NOT_FOUND"
        )
    }

    const sellerId = firstOffer.seller.toString()

    const hasMultipleSellers = offers.some(
        offer => offer.seller.toString() !== sellerId
    )

    if (hasMultipleSellers) {
        throw new AppError(
            "All items in an order must belong to the same seller.",
            409,
            "MULTIPLE_SELLERS_NOT_ALLOWED"
        )
    }

    const seller = await Seller.findById(firstOffer.seller)

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    if (seller.approvalStatus !== SELLER_APPROVAL_STATUS.APPROVED) {
        throw new AppError(
            "Offer is currently not available.",
            409,
            "OFFER_NOT_AVAILABLE"
        )
    }

    if (!seller.isOpen) {
        throw new AppError(
            "Seller is currently closed and is not accepting new orders.",
            409,
            "SELLER_CLOSED"
        )
    }

    if (seller.user.equals(buyerId)) {
        throw new AppError(
            "You cannot order your own offer.",
            403,
            "OWN_OFFER_ORDER_NOT_ALLOWED"
        )
    }

    const items = []
    const reducedItems = []

    try {
        for (const requestedItem of orderData.items) {
            const offer = offersById.get(requestedItem.offerId)

            if (!offer || !offer.isActive || offer.availableQuantity <= 0) {
                throw new AppError(
                    "One or more offers are currently not available.",
                    409,
                    "OFFER_NOT_AVAILABLE"
                )
            }

            const updatedOffer = await Offer.findOneAndUpdate(
                {
                    _id: offer._id,
                    isActive: true,
                    availableQuantity: {
                        $gte: requestedItem.quantity
                    }
                },
                {
                    $inc: {
                        availableQuantity: -requestedItem.quantity
                    }
                },
                {
                    new: true
                }
            )

            if (!updatedOffer) {
                throw new AppError(
                    `Requested quantity is not available for offer "${offer.name}".`,
                    409,
                    "INSUFFICIENT_OFFER_QUANTITY"
                )
            }

            reducedItems.push({
                offerId: offer._id,
                quantity: requestedItem.quantity
            })

            const itemTotalPrice = offer.price * requestedItem.quantity

            items.push({
                offer: offer._id,
                name: offer.name,
                category: offer.category,
                imageUrl: offer.imageUrl,
                quantity: requestedItem.quantity,
                unit: offer.unit,
                unitPrice: offer.price,
                totalPrice: itemTotalPrice
            })
        }

        const totalPrice = items.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        )

        const createdOrder = await Order.create({
            buyer: buyerId,
            seller: seller._id,
            items,
            totalPrice,
            buyerNote: orderData.buyerNote || ""
        })

        const orderLabel = getOrderNotificationLabel(createdOrder)

        await createNotification({
            recipient: seller.user,
            type: NOTIFICATION_TYPE.NEW_ORDER,
            title: "Nova porudžbina",
            message: `Primili ste novu porudžbinu: ${orderLabel}.`,
            order: createdOrder._id
        })

        return createdOrder
    }
    catch (error) {
        if (reducedItems.length > 0) {
            const rollbackOperations = reducedItems.map(item => ({
                updateOne: {
                    filter: {_id: item.offerId},
                    update: {
                        $inc: {
                            availableQuantity: item.quantity
                        }
                    }
                }
            }))

            try {
                await Offer.bulkWrite(rollbackOperations)
            }
            catch (rollbackError) {
                console.error("Order quantity rollback failed.")
                console.error(rollbackError)
            }
        }

        throw error
    }
}

const getBuyerOrders = async (buyerId, query) => {
    const filter = {
        buyer: buyerId
    }

    if (query.status) {
        filter.status = query.status
    }

    return Order.find(filter)
        .sort({
            createdAt: -1
        })
        .populate({
            path: "items.offer",
            select: "name category imageUrl unit"
        })
        .populate({
            path: "seller",
            select: "businessName"
        })
}

const getBuyerOrderById = async (
    buyerId,
    orderId
) => {
    const order = await populateBuyerOrder(
        Order.findOne({
            _id: orderId,
            buyer: buyerId
        })
    )

    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        )
    }

    const orderObject = order.toObject()

    const canSeePickupAddress = [
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.READY,
        ORDER_STATUS.COMPLETED
    ].includes(order.status)

    if (
        !canSeePickupAddress &&
        orderObject.seller
    ) {
        orderObject.seller.pickupAddress = null
    }

    if (
        order.status === ORDER_STATUS.READY &&
        order.pickupCodeGeneratedAt
    ) {
        orderObject.pickupCode = generatePickupCode(
            order._id,
            order.pickupCodeGeneratedAt
        )
    }

    delete orderObject.pickupCodeAttempts
    delete orderObject.pickupCodeBlockedUntil

    return orderObject
}

const cancelBuyerOrder = async (buyerId, orderId) => {
    const order = await Order.findOneAndUpdate(
        {
            _id: orderId,
            buyer: buyerId,
            status: ORDER_STATUS.PENDING
        },
        {
            $set: {
                status: ORDER_STATUS.CANCELLED
            }
        },
        {
            new: true
        }
    )

    if (!order) {
        const existingOrder = await Order.exists({
            _id: orderId,
            buyer: buyerId
        })

        if (!existingOrder) {
            throw new AppError(
                "Order not found.",
                404,
                "ORDER_NOT_FOUND"
            )
        }

        throw new AppError(
            "Only pending orders can be cancelled.",
            409,
            "ORDER_CANNOT_BE_CANCELLED"
        )
    }

    try {
        await restoreOrderQuantities(order)
    }
    catch (error) {
        await Order.findOneAndUpdate(
            {
                _id: order._id,
                status: ORDER_STATUS.CANCELLED
            },
            {
                $set: {
                    status: ORDER_STATUS.PENDING
                }
            }
        )

        throw error
    }

    return order
}

const markBuyerAsOnTheWay = async (
    buyerId,
    orderId
) => {
    const order = await Order.findOne({
        _id: orderId,
        buyer: buyerId
    }).populate({
        path: "seller",
        select: "user businessName"
    })

    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        )
    }

    if (order.status !== ORDER_STATUS.READY) {
        throw new AppError(
            "You can only announce departure for a ready order.",
            409,
            "BUYER_CANNOT_BE_MARKED_ON_THE_WAY"
        )
    }

    if (order.buyerOnTheWayAt) {
        throw new AppError(
            "Seller has already been notified that you are on the way.",
            409,
            "BUYER_ALREADY_ON_THE_WAY"
        )
    }

    order.buyerOnTheWayAt = new Date()

    await order.save()

    const orderLabel = getOrderNotificationLabel(order)

    await createNotification({
        recipient: order.seller.user,
        type: NOTIFICATION_TYPE.BUYER_ON_THE_WAY,
        title: "Kupac je krenuo",
        message: `Kupac je krenuo po porudžbinu: ${orderLabel}.`,
        order: order._id
    })

    return order
}

const getSellerOrders = async (
    userId,
    query
) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    const filter = {
        seller: seller._id
    }

    if (query.status) {
        filter.status = query.status
    }

    return Order.find(filter)
        .sort({
            createdAt: -1
        })
        .populate({
            path: "items.offer",
            select: "name category imageUrl unit"
        })
        .populate({
            path: "buyer",
            select: "firstName lastName"
        })
}

const getSellerOrderById = async (
    userId,
    orderId
) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    const order = await populateSellerOrder(
        Order.findOne({
            _id: orderId,
            seller: seller._id
        })
    )

    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        )
    }

    const orderObject = order.toObject()

    delete orderObject.pickupCodeGeneratedAt
    delete orderObject.pickupCodeAttempts
    delete orderObject.pickupCodeBlockedUntil

    return orderObject
}

const acceptSellerOrder = async (
    userId,
    orderId,
    estimatedPickupAt
) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    const order = await Order.findOne({
        _id: orderId,
        seller: seller._id
    })

    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        )
    }

    if (order.status !== ORDER_STATUS.PENDING) {
        throw new AppError(
            "Only pending orders can be accepted.",
            409,
            "ORDER_CANNOT_BE_ACCEPTED"
        )
    }

    order.status = ORDER_STATUS.ACCEPTED
    order.estimatedPickupAt = new Date(estimatedPickupAt)

    await order.save()

    const orderLabel = getOrderNotificationLabel(order)

    await createNotification({
        recipient: order.buyer,
        type: NOTIFICATION_TYPE.ORDER_ACCEPTED,
        title: "Porudžbina je prihvaćena",
        message: `Prodavac je prihvatio tvoju porudžbinu: ${orderLabel}.`,
        order: order._id
    })

    return getSellerOrderById(userId, orderId)
}

const rejectSellerOrder = async (sellerId, orderId) => {
    const seller = await getSellerByUserId(sellerId)

    const order = await Order.findOneAndUpdate(
        {
            _id: orderId,
            seller: seller._id,
            status: ORDER_STATUS.PENDING
        },
        {
            $set: {
                status: ORDER_STATUS.REJECTED
            }
        },
        {
            new: true
        }
    )

    if (!order) {
        const existingOrder = await Order.exists({
            _id: orderId,
            seller: seller._id
        })

        if (!existingOrder) {
            throw new AppError(
                "Order not found.",
                404,
                "ORDER_NOT_FOUND"
            )
        }

        throw new AppError(
            "Only pending orders can be rejected.",
            409,
            "ORDER_CANNOT_BE_REJECTED"
        )
    }

    try {
        await restoreOrderQuantities(order)
    }
    catch (error) {
        await Order.findOneAndUpdate(
            {
                _id: order._id,
                status: ORDER_STATUS.REJECTED
            },
            {
                $set: {
                    status: ORDER_STATUS.PENDING
                }
            }
        )

        throw error
    }

    await createOrderNotification({
        userId: order.buyer,
        orderId: order._id,
        type: NOTIFICATION_TYPE.ORDER_REJECTED,
        title: "Porudžbina je odbijena",
        message: "Domaćin je odbio tvoju porudžbinu."
    })

    return order
}

const markSellerOrderAsReady = async (
    userId,
    orderId
) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    const order = await Order.findOne({
        _id: orderId,
        seller: seller._id
    })

    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        )
    }

    if (
        order.status !==
        ORDER_STATUS.ACCEPTED
    ) {
        throw new AppError(
            "Only accepted orders can be marked as ready.",
            409,
            "ORDER_CANNOT_BE_MARKED_READY"
        )
    }

    order.status = ORDER_STATUS.READY
    order.pickupCodeGeneratedAt = new Date()
    order.pickupCodeAttempts = 0
    order.pickupCodeBlockedUntil = null

    await order.save()

    const orderLabel = getOrderNotificationLabel(order)

    await createNotification({
        recipient: order.buyer,
        type: NOTIFICATION_TYPE.ORDER_READY,
        title: "Porudžbina je spremna",
        message: `Tvoja porudžbina ${orderLabel} je spremna za preuzimanje.`,
        order: order._id
    })

    return getSellerOrderById(userId, orderId)
}

const completeSellerOrder = async (
    userId,
    orderId,
    pickupCode
) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    const order = await Order.findOne({
        _id: orderId,
        seller: seller._id
    })

    if (!order) {
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        )
    }

    if (order.status !== ORDER_STATUS.READY) {
        throw new AppError(
            "Only ready orders can be completed.",
            409,
            "ORDER_CANNOT_BE_COMPLETED"
        )
    }

    const now = new Date()

    if (
        order.pickupCodeBlockedUntil &&
        order.pickupCodeBlockedUntil > now
    ) {
        throw new AppError(
            "Pickup code verification is temporarily blocked.",
            429,
            "PICKUP_CODE_TEMPORARILY_BLOCKED"
        )
    }

    if (
        order.pickupCodeBlockedUntil &&
        order.pickupCodeBlockedUntil <= now
    ) {
        order.pickupCodeAttempts = 0
        order.pickupCodeBlockedUntil = null
    }

    if (!isPickupCodeValid(order, pickupCode)) {
        order.pickupCodeAttempts += 1

        const remainingAttempts =
            MAX_PICKUP_CODE_ATTEMPTS -
            order.pickupCodeAttempts

        if (remainingAttempts <= 0) {
            order.pickupCodeBlockedUntil =
                new Date(
                    Date.now() +
                    PICKUP_CODE_BLOCK_DURATION_MS
                )

            await order.save()

            throw new AppError(
                "Too many incorrect pickup code attempts.",
                429,
                "PICKUP_CODE_TEMPORARILY_BLOCKED"
            )
        }

        await order.save()

        throw new AppError(
            `Pickup code is not correct. Remaining attempts: ${remainingAttempts}.`,
            422,
            "INVALID_PICKUP_CODE"
        )
    }

    order.status = ORDER_STATUS.COMPLETED
    order.pickupCodeAttempts = 0
    order.pickupCodeBlockedUntil = null

    await order.save()

    const orderLabel = getOrderNotificationLabel(order)

    await createNotification({
        recipient: order.buyer,
        type: NOTIFICATION_TYPE.ORDER_COMPLETED,
        title: "Porudžbina je završena",
        message: `Preuzimanje porudžbine ${orderLabel} je uspešno potvrđeno.`,
        order: order._id
    })

    return getSellerOrderById(userId, orderId)
}

export {
    createOrder,
    getBuyerOrders,
    getBuyerOrderById,
    cancelBuyerOrder,
    markBuyerAsOnTheWay,
    getSellerOrders,
    getSellerOrderById,
    acceptSellerOrder,
    rejectSellerOrder,
    markSellerOrderAsReady,
    completeSellerOrder
}