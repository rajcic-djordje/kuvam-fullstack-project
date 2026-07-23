import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5, validate: { validator: Number.isInteger, message: "Rating must be an integer." } },
    comment: { type: String, trim: true, maxlength: 1000, default: "" }
}, { timestamps: true })

const reviewModel = mongoose.model("Review", reviewSchema)

export default reviewModel