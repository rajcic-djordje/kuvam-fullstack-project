import mongoose from "mongoose"
import { REPORT_REASONS, REPORT_STATUS } from "../constants/report.js"

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    reason: { type: String, enum: Object.values(REPORT_REASONS), required: true },
    description: { type: String, trim: true, minlength: 10, maxlength: 1000, required: true },
    status: { type: String, enum: Object.values(REPORT_STATUS), default: REPORT_STATUS.PENDING, required: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    adminNote: { type: String, trim: true, maxlength: 1000, default: null },
    reviewedAt: { type: Date, default: null }
}, { timestamps: true })

const reportModel = mongoose.model("Report", reportSchema)

export default reportModel