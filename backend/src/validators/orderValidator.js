import z from "zod"

const createOrderSchema = z.object({
    offerId: z.string().trim().min(1),
    quantity: z.number().int().min(1),
    buyerNote: z.string().trim().max(500).optional()
})

const rejectOrderSchema = z.object({
    rejectionReason: z.string().trim().min(2).max(500)
})

export { createOrderSchema, rejectOrderSchema}