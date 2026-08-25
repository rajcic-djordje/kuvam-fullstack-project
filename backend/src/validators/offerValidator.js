import z from "zod"
import {
    OFFER_CATEGORIES,
    OFFER_UNITS
} from "../constants/offer.js"

const createOfferSchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(1000),
    category: z.enum(Object.values(OFFER_CATEGORIES)),
    price: z.number().min(1),
    availableQuantity: z.number().int().min(1),
    unit: z.enum(Object.values(OFFER_UNITS))
})

const updateOfferSchema = createOfferSchema
    .partial()
    .refine(
        data => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided."
        }
    )

export {
    createOfferSchema,
    updateOfferSchema
}