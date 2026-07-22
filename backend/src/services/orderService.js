import AppError from "../errors/appError.js"
import Offer from "../models/offer.js"
import Seller from "../models/seller.js"
import Order from "../models/order.js"
import { SELLER_APPROVAL_STATUS } from "../constants/seller.js"
import { ORDER_STATUS } from "../constants/order.js"

const createOrder = async (buyerId, orderData) => {


    const offerId = orderData.offerId
    const quantity = orderData.quantity
    const buyerNote = orderData.buyerNote


    const offer = await Offer.findById(offerId)

    if(!offer)
        throw new AppError("Offer not found.", 404, "OFFER_NOT_FOUND")

    if(!offer.isActive === true || offer.availableQuantity<=0)
        throw new AppError("Offer is currently not available.", 409, "OFFER_NOT_AVAILABLE")

    const seller = await Seller.findById(offer.seller)

    if(!seller || seller.approvalStatus!==SELLER_APPROVAL_STATUS.APPROVED)
         throw new AppError("Offer is currently not available.", 409, "OFFER_NOT_AVAILABLE")

    if(seller.user.equals(buyerId))
        throw new AppError("You cant order your own offer.", 403, "OWN_OFFER_ORDER_NOT_ALLOWED")

    if(quantity> offer.availableQuantity)
        throw new AppError("Requested quantity not available.", 409, "INSUFFICIENT_OFFER_QUANTITY")

    const pricePerUnit = offer.price
    const totalCost = pricePerUnit * quantity

    const order = await Order.create({
    buyer: buyerId,
    seller: seller._id,
    offer: offer._id,
    quantity,
    unitPrice: pricePerUnit,
    totalPrice: totalCost,
    buyerNote
    })

    offer.availableQuantity -= quantity
    await offer.save()

    return order
}

const getBuyerOrders = async (buyerId) => {

    const orders = await Order.find({buyer: buyerId}).sort({createdAt: -1}).populate({path: "offer", select: "name category imageUrl unit"}).populate({path: "seller", select: "businessName"})

    return orders

}

const getBuyerOrderById = async (buyerId, orderId) => {
    const order = await Order.findOne({ _id: orderId, buyer: buyerId}).populate({path: "offer", select: "name description category imageUrl unit"}).populate({path: "seller", select: "businessName description"})

    if(!order)
        throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND")


    return order
}

const cancelBuyerOrder = async (buyerId, orderId) => {
    
    const order = await Order.findOne({ _id: orderId, buyer: buyerId})

    if(!order)
        throw new AppError("Order not found", 404, "ORDER_NOT_FOUND")

    if(order.status!== ORDER_STATUS.PENDING)
        throw new AppError("Only pending orders can be cancelled.", 409, "ORDER_CANNOT_BE_CANCELLED")

    const offer = await Offer.findById(order.offer)

    if (offer) {
    offer.availableQuantity += order.quantity
    await offer.save()


    }

    order.status = ORDER_STATUS.CANCELLED
    await order.save()

    return order
}

const getSellerOrders = async (userId) => {
    
    const seller = await Seller.findOne({ user: userId })

    if(!seller)
        throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")

    const orders = await Order.find({ seller: seller._id }).sort({ createdAt: -1 }).populate({path: "offer",select: "name category imageUrl unit"}).populate({path: "buyer",select: "firstName lastName"})


    return orders
}

const getSellerOrderById = async (userId, orderId) => {
    const seller = await Seller.findOne({ user: userId })

    if(!seller)
        throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")

    const order = await Order.findOne({_id: orderId,seller: seller._id}).populate({path: "offer",select: "name description category imageUrl unit"}).populate({path: "buyer",select: "firstName lastName email"})

    if(!order)
        throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND")


    return order
}

const acceptSellerOrder = async (userId, orderId) => {
    
    const seller = await Seller.findOne({ user: userId })

    if(!seller)
        throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")

    const order = await Order.findOne({_id: orderId, seller: seller._id})

    if(!order)
        throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND")

    if(order.status!== ORDER_STATUS.PENDING)
        throw new AppError("Only pending orders can be accepted.", 409, "ORDER_CANNOT_BE_ACCEPTED")

    order.status = ORDER_STATUS.ACCEPTED
    await order.save()

    return order
}

const rejectSellerOrder = async (userId, orderId, rejectionReason) => {
    const seller = await Seller.findOne({ user: userId })

    if(!seller)
        throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")

    const order = await Order.findOne({_id: orderId, seller: seller._id})

    if(!order)
        throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND")

    if(order.status!== ORDER_STATUS.PENDING)
        throw new AppError("Only pending orders can be rejected.", 409, "ORDER_CANNOT_BE_REJECTED")


    const offer = await Offer.findById(order.offer)

    if(offer) {
    offer.availableQuantity += order.quantity
    await offer.save()
    }

    order.status = ORDER_STATUS.REJECTED
    order.rejectionReason = rejectionReason

    await order.save()

    return order
}


const markSellerOrderAsReady = async (userId, orderId) => {
    const seller = await Seller.findOne({ user: userId })

    if (!seller)
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )

    const order = await Order.findOne({
        _id: orderId,
        seller: seller._id
    })

    if (!order)
        throw new AppError(
            "Order not found.",
            404,
            "ORDER_NOT_FOUND"
        )

    if (order.status !== ORDER_STATUS.ACCEPTED)
        throw new AppError(
            "Only accepted orders can be marked as ready.",
            409,
            "ORDER_CANNOT_BE_MARKED_READY"
        )

    order.status = ORDER_STATUS.READY

    await order.save()

    return order
}

const completeBuyerOrder = async (buyerId, orderId) => {
    const order = await Order.findOne({_id: orderId, buyer: buyerId})

    if (!order)
        throw new AppError("Order not found.",404,"ORDER_NOT_FOUND")

    if (order.status !== ORDER_STATUS.READY)
        throw new AppError("Only ready orders can be completed.",409,"ORDER_CANNOT_BE_COMPLETED")

    order.status = ORDER_STATUS.COMPLETED

    await order.save()

    return order
}

export {createOrder, acceptSellerOrder, completeBuyerOrder, markSellerOrderAsReady, rejectSellerOrder, getSellerOrderById, getBuyerOrders, getBuyerOrderById, cancelBuyerOrder, getSellerOrders}

