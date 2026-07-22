import z from "zod"

const rejectSellerSchema = z.object({
    reason: z.string().trim().min(3, "Rejection reason must contain at least 3 characters.").max(500, "Rejection reason must contain at most 500 characters.")
})

export { rejectSellerSchema }