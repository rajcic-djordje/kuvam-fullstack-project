import z from "zod"

const NAME_PATTERN = /^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u

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

const updateLocationSchema = z.object({
    cityId: z
        .string()
        .trim()
        .min(1),

    street: z
        .string()
        .trim()
        .min(2)
        .max(150),

    streetNumber: z
        .string()
        .trim()
        .min(1)
        .max(20),

    additionalInfo: z
        .string()
        .trim()
        .max(300)
        .optional()
})

export {
    updateProfileSchema,
    changePasswordSchema,
    updateLocationSchema
}