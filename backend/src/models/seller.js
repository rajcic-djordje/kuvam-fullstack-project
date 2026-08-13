import mongoose from "mongoose"
import { SELLER_APPROVAL_STATUS } from "../constants/seller.js"

const sellerSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true},
    businessName: {type: String, required: true, trim: true, minlength: 2, maxlength: 100},
    slug: {type: String, trim: true, lowercase: true, unique: true, sparse: true, default: null},
    description: {type: String, trim: true, maxlength: 500, default: ""},
    profileImageUrl: {type: String, trim: true, default: null},
    coverImageUrl: {type: String, trim: true, default: null},
    city: {type: mongoose.Schema.Types.ObjectId, ref: "City", default: null},
    pickupAddress: {
        street: {type: String, trim: true, maxlength: 150, default: null},
        streetNumber: {type: String, trim: true, maxlength: 20, default: null},
        additionalInfo: {type: String, trim: true, maxlength: 300, default: null},
        latitude: {type: Number, min: -90, max: 90, default: null},
        longitude: {type: Number, min: -180, max: 180, default: null}
    },
    isOpen: {type: Boolean, required: true, default: true},
    approvalStatus: {type: String, required: true, enum: Object.values(SELLER_APPROVAL_STATUS), default: SELLER_APPROVAL_STATUS.PENDING},
    rejectionReason: {type: String, trim: true, maxlength: 500, default: null}
}, {timestamps: true})

const sellerModel = mongoose.model("Seller", sellerSchema)

export default sellerModel