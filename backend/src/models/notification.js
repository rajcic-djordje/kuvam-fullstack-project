import mongoose from "mongoose"
import {NOTIFICATION_TYPE} from "../constants/notification.js"

const notificationSchema = new mongoose.Schema({
    recipient: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true},
    type: {type: String, enum: Object.values(NOTIFICATION_TYPE), required: true},
    title: {type: String, required: true, trim: true, maxlength: 120},
    message: {type: String, required: true, trim: true, maxlength: 300},
    order: {type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null},
    isRead: {type: Boolean, required: true, default: false}
}, {timestamps: true})

notificationSchema.index({
    recipient: 1,
    createdAt: -1
})

const notificationModel = mongoose.model(
    "Notification",
    notificationSchema
)

export default notificationModel