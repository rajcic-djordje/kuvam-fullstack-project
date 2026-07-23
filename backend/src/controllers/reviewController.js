import { createReview, getSellerReviews } from "../services/reviewService.js"

const createReviewListing = async (req, res) => {
    const buyerId = req.auth.userId

    const review = await createReview( buyerId, req.body)

    return res.status(201).json({
        message: "Review created successfully.",
        review
    })
}


const getReviewsBySeller = async (req, res) => {
    const sellerId = req.params.sellerId

    const result = await getSellerReviews(sellerId)

    return res.status(200).json({
        message: "Seller reviews retrieved successfully.",
        reviewsCount: result.reviewsCount,
        averageRating: result.averageRating,
        reviews: result.reviews
    })
}

export { createReviewListing, getReviewsBySeller }