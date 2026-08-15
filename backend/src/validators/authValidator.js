import z from "zod"
import { USER_ROLES } from "../constants/user.js"

const NAME_PATTERN = /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u

const BUSINESS_NAME_PATTERN =
    /^(?=.*\p{L})[\p{L}\p{N} .,'&()\-]+$/u

const registerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(
            NAME_PATTERN,
            "First name can contain letters, spaces, apostrophes and hyphens only."
        ),

    lastName: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(
            NAME_PATTERN,
            "Last name can contain letters, spaces, apostrophes and hyphens only."
        ),

    email: z
        .email()
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8)
        .max(100),

    role: z.enum([
        USER_ROLES.BUYER,
        USER_ROLES.SELLER
    ]),

    businessName: z
        .string()
        .trim()
        .min(2)
        .max(100)
        .regex(
            BUSINESS_NAME_PATTERN,
            "Business name must contain at least one letter and cannot contain unsupported characters."
        )
        .optional(),

    description: z
        .string()
        .trim()
        .max(500)
        .optional()
}).refine(
    (data) => {
        if(data.role === USER_ROLES.SELLER)
            return data.businessName !== undefined

        return true
    },
    {
        message: "Business name required for sellers.",
        path: ["businessName"]
    }
)

const loginSchema = z.object({
    email: z
        .email()
        .trim()
        .toLowerCase(),

    password: z.string().min(1)
})

const forgotPasswordSchema = z.object({
    email: z
        .email()
        .trim()
        .toLowerCase()
})

const resetPasswordSchema = z.object({
    email: z
        .email()
        .trim()
        .toLowerCase(),

    code: z
        .string()
        .regex(/^\d{6}$/),

    password: z
        .string()
        .min(8)
        .max(100)
})

export {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
}