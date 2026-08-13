import {
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
} from "../services/orderService.js"

const createOrderListing = async (req, res) => {
    const order = await createOrder(
        req.auth.userId,
        req.body
    )

    return res.status(201).json({
        message: "Order created successfully.",
        order
    })
}

const getMyOrders = async (req, res) => {
    const orders = await getBuyerOrders(
        req.auth.userId,
        req.queryData
    )

    return res.status(200).json({
        message: "Buyer orders retrieved successfully.",
        orders
    })
}

const getMyOrderById = async (req, res) => {
    const order = await getBuyerOrderById(
        req.auth.userId,
        req.params.orderId
    )

    return res.status(200).json({
        message: "Order retrieved successfully.",
        order
    })
}

const cancelMyOrder = async (req, res) => {
    const order = await cancelBuyerOrder(
        req.auth.userId,
        req.params.orderId
    )

    return res.status(200).json({
        message: "Order cancelled successfully.",
        order
    })
}

const markMyOrderAsOnTheWay = async (req, res) => {
    const order = await markBuyerAsOnTheWay(
        req.auth.userId,
        req.params.orderId
    )

    return res.status(200).json({
        message: "Seller notified that buyer is on the way.",
        order
    })
}

const getReceivedOrders = async (req, res) => {
    const orders = await getSellerOrders(
        req.auth.userId,
        req.queryData
    )

    return res.status(200).json({
        message: "Seller orders retrieved successfully.",
        orders
    })
}

const getReceivedOrderById = async (req, res) => {
    const order = await getSellerOrderById(
        req.auth.userId,
        req.params.orderId
    )

    return res.status(200).json({
        message: "Order retrieved successfully.",
        order
    })
}

const acceptReceivedOrder = async (req, res) => {
    const order = await acceptSellerOrder(
        req.auth.userId,
        req.params.orderId,
        req.body.estimatedPickupAt
    )

    return res.status(200).json({
        message: "Order accepted successfully.",
        order
    })
}

const rejectReceivedOrder = async (req, res) => {
    const order = await rejectSellerOrder(
        req.auth.userId,
        req.params.orderId,
        req.body.rejectionReason
    )

    return res.status(200).json({
        message: "Order rejected successfully.",
        order
    })
}

const markReceivedOrderAsReady = async (
    req,
    res
) => {
    const order = await markSellerOrderAsReady(
        req.auth.userId,
        req.params.orderId
    )

    return res.status(200).json({
        message: "Order marked as ready successfully.",
        order
    })
}

const completeReceivedOrder = async (req, res) => {
    const order = await completeSellerOrder(
        req.auth.userId,
        req.params.orderId,
        req.body.pickupCode
    )

    return res.status(200).json({
        message: "Order completed successfully.",
        order
    })
}

export {
    createOrderListing,
    getMyOrders,
    getMyOrderById,
    cancelMyOrder,
    markMyOrderAsOnTheWay,
    getReceivedOrders,
    getReceivedOrderById,
    acceptReceivedOrder,
    rejectReceivedOrder,
    markReceivedOrderAsReady,
    completeReceivedOrder
}