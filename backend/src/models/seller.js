import mongoose from "mongoose"
import { SELLER_APPROVAL_STATUS } from "../constants/seller.js"

const sellerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    approvalStatus: { type: String, required: true, enum: Object.values(SELLER_APPROVAL_STATUS), default: SELLER_APPROVAL_STATUS.PENDING },
    rejectionReason: { type: String, trim: true, maxlength: 500, default: null }
}, { timestamps: true })

const sellerModel = mongoose.model("Seller", sellerSchema)

export default sellerModel