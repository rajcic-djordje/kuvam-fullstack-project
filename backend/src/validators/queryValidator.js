import { z } from "zod"
import { OFFER_CATEGORIES } from "../constants/offer.js"
import { ORDER_STATUS } from "../constants/order.js"
import { REPORT_STATUS } from "../constants/report.js"
import { USER_ROLES, USER_STATUS } from "../constants/user.js"

const offerQuerySchema = z.object({
    search: z.string().trim().min(1).max(100).optional(),

    category: z.string().refine(
        (value) => Object.values(OFFER_CATEGORIES).includes(value),
        { message: "Invalid offer category." }
    ).optional()
})

const orderQuerySchema = z.object({
    status: z.string().refine(
        (value) => Object.values(ORDER_STATUS).includes(value),
        { message: "Invalid order status." }
    ).optional()
})

const reportQuerySchema = z.object({
    search: z.string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    status: z.string().refine(
        (value) => Object.values(REPORT_STATUS).includes(value),
        { message: "Invalid report status." }
    ).optional(),

    sort: z.enum([
        "newest",
        "oldest"
    ]).optional()
})

const pendingSellerQuerySchema = z.object({
    search: z.string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    sort: z.enum([
        "newest",
        "oldest"
    ]).optional()
})

const suspendedUsersQuerySchema = z.object({
    search: z.string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    sort: z.enum([
        "newest",
        "oldest"
    ]).optional()
})

const adminUsersQuerySchema = z.object({
    search: z.string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    role: z.enum([
        USER_ROLES.BUYER,
        USER_ROLES.SELLER
    ]).optional(),

    status: z.enum([
        USER_STATUS.ACTIVE,
        USER_STATUS.SUSPENDED,
        USER_STATUS.BANNED,
        USER_STATUS.DEACTIVATED
    ]).optional(),

    sort: z.enum([
        "newest",
        "oldest"
    ]).optional()
})


export {
    offerQuerySchema,
    orderQuerySchema,
    reportQuerySchema,
    pendingSellerQuerySchema,
    suspendedUsersQuerySchema,
    adminUsersQuerySchema
}