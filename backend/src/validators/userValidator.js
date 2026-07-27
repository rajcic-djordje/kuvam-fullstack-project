import z from "zod"

const NAME_PATTERN = /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u

const BUSINESS_NAME_PATTERN =
    /^(?=.*\p{L})[\p{L}\p{N} .,'&()\-]+$/u

const updateProfileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(
            NAME_PATTERN,
            "First name can contain letters, spaces, apostrophes and hyphens only."
        )
        .optional(),

    lastName: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .regex(
            NAME_PATTERN,
            "Last name can contain letters, spaces, apostrophes and hyphens only."
        )
        .optional(),

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
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided."
    }
)

const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1),

    newPassword: z
        .string()
        .min(8)
        .max(100)
}).refine(
    (data) => data.currentPassword !== data.newPassword,
    {
        message: "New password must be different from the current password.",
        path: ["newPassword"]
    }
)

export {
    updateProfileSchema,
    changePasswordSchema
}