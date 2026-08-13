import z from "zod"

const updateSellerProfileSchema = z.object({
    businessName: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    cityId: z.string().trim().min(1).optional(),
    street: z.string().trim().min(2).max(150).optional(),
    streetNumber: z.string().trim().min(1).max(20).optional(),
    additionalInfo: z.string().trim().max(300).nullable().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    isOpen: z.boolean().optional()
})
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided."
        }
    )
    .refine(
        (data) => {
            const containsAddressField =
                data.cityId !== undefined ||
                data.street !== undefined ||
                data.streetNumber !== undefined ||
                data.additionalInfo !== undefined

            if (!containsAddressField)
                return true

            return (
                data.cityId !== undefined &&
                data.street !== undefined &&
                data.streetNumber !== undefined
            )
        },
        {
            message: "City, street and street number must be provided together."
        }
    )
    .refine(
        (data) => {
            const hasLatitude = data.latitude !== undefined
            const hasLongitude = data.longitude !== undefined

            return hasLatitude === hasLongitude
        },
        {
            message: "Latitude and longitude must be provided together."
        }
    )

export {updateSellerProfileSchema}