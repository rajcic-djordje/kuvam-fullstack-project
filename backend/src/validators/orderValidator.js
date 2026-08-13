import z from "zod"

const orderItemSchema = z.object({
    offerId: z.string().trim().min(1),
    quantity: z.number().int().min(1)
})

const createOrderSchema = z.object({
    items: z
        .array(orderItemSchema)
        .min(1)
        .max(30)
        .refine(
            items => new Set(items.map(item => item.offerId)).size === items.length,
            {
                message: "Each offer can appear only once in the order."
            }
        ),
    buyerNote: z.string().trim().max(500).optional()
})

const acceptOrderSchema = z.object({
    estimatedPickupAt: z
        .string()
        .datetime()
        .refine(
            value => new Date(value) > new Date(),
            {
                message: "Estimated pickup time must be in the future."
            }
        )
})

const rejectOrderSchema = z.object({
    rejectionReason: z.string().trim().min(2).max(500)
})

const verifyPickupCodeSchema = z.object({
    pickupCode: z.string().regex(/^\d{6}$/)
})

export {
    createOrderSchema,
    acceptOrderSchema,
    rejectOrderSchema,
    verifyPickupCodeSchema
}