import z from "zod"
import { OFFER_CATEGORIES } from "../constants/offer.js"

const createOfferSchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(1000).optional(),
    category: z.enum(Object.values(OFFER_CATEGORIES)),
    price: z.number().positive(),
    availableQuantity: z.number().int().min(0),
    unit: z.string().trim().min(1).max(30),
    imageUrl: z.url().nullable().optional()
})

const updateOfferSchema = createOfferSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided."
        }
    )

export {createOfferSchema, updateOfferSchema}