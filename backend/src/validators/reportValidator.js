import z from "zod"
import { REPORT_REASONS } from "../constants/report.js"

const createReportSchema = z.object({
    orderId: z.string().trim().min(1),
    reason: z.enum(Object.values(REPORT_REASONS)),
    description: z.string().trim().min(10).max(1000)
})

const approveReportSchema = z.object({
    adminNote: z.string().trim().max(1000).optional()
})

const rejectReportSchema = z.object({
    adminNote: z.string().trim().min(2).max(1000)
})

export { createReportSchema, approveReportSchema, rejectReportSchema }