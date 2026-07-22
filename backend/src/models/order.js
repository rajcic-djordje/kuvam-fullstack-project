import mongoose from "mongoose"
import { ORDER_STATUS } from "../constants/order.js"

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    quantity: { type: Number, required: true, min: 1, validate: { validator: Number.isInteger, message: "Quantity must be an integer." } },
    unitPrice: { type: Number, required: true, min: 0.01 },
    totalPrice: { type: Number, required: true, min: 0.01 },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING, required: true },
    buyerNote: { type: String, trim: true, maxlength: 500, default: "" },
    rejectionReason: { type: String, trim: true, maxlength: 500, default: null }
}, { timestamps: true })

const orderModel = mongoose.model("Order", orderSchema)

export default orderModel