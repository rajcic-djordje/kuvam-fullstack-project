import mongoose from "mongoose"
import {OFFER_CATEGORIES} from "../constants/offer.js"

const offerSchema = new mongoose.Schema({
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
        description: { type: String, trim: true, maxlength: 1000, default: "" },
        category: { type: String, required: true, enum: Object.values(OFFER_CATEGORIES) },
        price: { type: Number, required: true, min: 0.01 },
        availableQuantity: {type: Number, required: true, min: 0, validate:{validator: Number.isInteger, message: "Available quantity must be an integer."}},
        unit: { type: String, required: true, trim: true, maxlength: 30 },
        imageUrl: { type: String, trim: true, default: null },
        isActive: { type: Boolean, default: true }
    },
    {timestamps: true}
)


const offerModel = mongoose.model("Offer", offerSchema)

export default offerModel