import AppError from "../errors/appError.js"
import Review from "../models/review.js"
import Order from "../models/order.js"
import Seller from "../models/seller.js"
import { ORDER_STATUS } from "../constants/order.js"

const createReview = async (
    buyerId,
    reviewData
) => {
    const order = await Order.findOne({
        _id: reviewData.orderId,
        buyer: buyerId
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
        ORDER_STATUS.COMPLETED
    ) {
        throw new AppError(
            "Only completed orders can be reviewed.",
            409,
            "ORDER_CANNOT_BE_REVIEWED"
        )
    }

    const existingReview = await Review.findOne({
        order: order._id
    })

    if (existingReview) {
        throw new AppError(
            "Order has already been reviewed.",
            409,
            "ORDER_ALREADY_REVIEWED"
        )
    }

    const primaryItem = order.items[0]

    if (!primaryItem) {
        throw new AppError(
            "Order does not contain any items.",
            409,
            "ORDER_ITEMS_MISSING"
        )
    }

    return Review.create({
        buyer: buyerId,
        seller: order.seller,
        offer: primaryItem.offer,
        order: order._id,
        rating: reviewData.rating,
        comment: reviewData.comment
    })
}

const getSellerReviews = async sellerId => {
    const seller = await Seller.findById(sellerId)

    if (!seller) {
        throw new AppError(
            "Seller not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    const reviews = await Review.find({
        seller: seller._id
    })
        .sort({
            createdAt: -1
        })
        .populate({
            path: "buyer",
            select: "firstName lastName"
        })
        .populate({
            path: "offer",
            select: "name category imageUrl"
        })

    const ratingSum = reviews.reduce(
        (sum, review) =>
            sum + review.rating,
        0
    )

    const averageRating =
        reviews.length > 0
            ? ratingSum / reviews.length
            : 0

    return {
        reviewsCount: reviews.length,
        averageRating,
        reviews
    }
}

export {
    createReview,
    getSellerReviews
}