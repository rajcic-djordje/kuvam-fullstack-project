import mongoose from "mongoose"
import { ORDER_STATUS } from "../constants/order.js"

const orderItemSchema = new mongoose.Schema({
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: null },
    quantity: { type: Number, required: true, min: 1, validate: { validator: Number.isInteger, message: "Quantity must be an integer." } },
    unit: { type: String, required: true, trim: true, maxlength: 30 },
    unitPrice: { type: Number, required: true, min: 0.01 },
    totalPrice: { type: Number, required: true, min: 0.01 }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    items: { type: [orderItemSchema], required: true, validate: { validator: items => Array.isArray(items) && items.length > 0, message: "Order must contain at least one item." } },
    totalPrice: { type: Number, required: true, min: 0.01 },
    status: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING, required: true },
    buyerNote: { type: String, trim: true, maxlength: 500, default: "" },
    rejectionReason: { type: String, trim: true, maxlength: 500, default: null },
    estimatedPickupAt: { type: Date, default: null },
    buyerOnTheWayAt: { type: Date, default: null },
    pickupCodeGeneratedAt: { type: Date, default: null },
    pickupCodeAttempts: { type: Number, min: 0, default: 0 },
    pickupCodeBlockedUntil: { type: Date, default: null }
}, { timestamps: true })

const orderModel = mongoose.model("Order", orderSchema)

export default orderModel