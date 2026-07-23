import z from "zod"

const createReviewSchema = z.object({
    orderId: z.string().trim().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).optional()
})

export { createReviewSchema }