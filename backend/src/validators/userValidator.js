import z from "zod"

const updateProfileSchema = z.object({
    firstName: z.string().trim().min(2).max(50).optional(),
    lastName: z.string().trim().min(2).max(50).optional(),
    businessName: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(1000).optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided." }
)

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).max(100)
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