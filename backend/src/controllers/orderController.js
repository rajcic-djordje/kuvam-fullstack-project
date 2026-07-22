import { createOrder, getBuyerOrders, markSellerOrderAsReady, completeBuyerOrder, acceptSellerOrder, rejectSellerOrder, getSellerOrders, getSellerOrderById, getBuyerOrderById, cancelBuyerOrder } from "../services/orderService.js"

const createOrderListing = async (req, res) => {
    const buyerId = req.auth.userId
    const order = await createOrder(buyerId, req.body)

    return res.status(201).json({
        message: "Order created successfully.",
        order
    })
}

const getMyOrders = async (req, res) => {
    const buyerId = req.auth.userId

    const orders = await getBuyerOrders(buyerId)

    return res.status(200).json({
        message: "Buyer orders retrieved successfully.",
        orders
    })
}

const getMyOrderById = async (req, res) => {
    const buyerId = req.auth.userId
    const orderId = req.params.orderId

    const order = await getBuyerOrderById(
        buyerId,
        orderId
    )

    return res.status(200).json({
        message: "Order retrieved successfully.",
        order
    })
}

const cancelMyOrder = async (req, res) => {
    const buyerId = req.auth.userId
    const orderId = req.params.orderId

    const order = await cancelBuyerOrder(
        buyerId,
        orderId
    )

    return res.status(200).json({
        message: "Order cancelled successfully.",
        order
    })
}

const getReceivedOrders = async (req, res) => {
    const userId = req.auth.userId

    const orders = await getSellerOrders(userId)

    return res.status(200).json({
        message: "Seller orders retrieved successfully.",
        orders
    })
}

const getReceivedOrderById = async (req, res) => {
    const userId = req.auth.userId
    const orderId = req.params.orderId

    const order = await getSellerOrderById(
        userId,
        orderId
    )

    return res.status(200).json({
        message: "Order retrieved successfully.",
        order
    })
}


const acceptReceivedOrder = async (req, res) => {
    const userId = req.auth.userId
    const orderId = req.params.orderId

    const order = await acceptSellerOrder(userId, orderId)

    return res.status(200).json({
        message: "Order accepted successfully.",
        order
    })
}

const rejectReceivedOrder = async (req, res) => {
    const userId = req.auth.userId
    const orderId = req.params.orderId
    const rejectionReason = req.body.rejectionReason

    const order = await rejectSellerOrder(
        userId,
        orderId,
        rejectionReason
    )

    return res.status(200).json({
        message: "Order rejected successfully.",
        order
    })

    
}

const markReceivedOrderAsReady = async (req, res) => {
    const userId = req.auth.userId
    const orderId = req.params.orderId

    const order = await markSellerOrderAsReady(
        userId,
        orderId
    )

    return res.status(200).json({
        message: "Order marked as ready successfully.",
        order
    })
}

const completeMyOrder = async (req, res) => {
    const buyerId = req.auth.userId
    const orderId = req.params.orderId

    const order = await completeBuyerOrder(
        buyerId,
        orderId
    )

    return res.status(200).json({
        message: "Order completed successfully.",
        order
    })
}

export { createOrderListing,markReceivedOrderAsReady, completeMyOrder, acceptReceivedOrder, rejectReceivedOrder,  getMyOrders, getReceivedOrderById, getMyOrderById, cancelMyOrder, getReceivedOrders}