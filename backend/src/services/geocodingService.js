import env from "../config/env.js"
import AppError from "../errors/appError.js"

const NOMINATIM_SEARCH_URL =
    "https://nominatim.openstreetmap.org/search"

const geocodeAddress = async (
    cityName,
    street,
    streetNumber
) => {
    const searchParams = new URLSearchParams({
        format: "jsonv2",
        limit: "1",
        countrycodes: "rs",
        street: `${streetNumber} ${street}`,
        city: cityName,
        country: "Serbia",
        addressdetails: "1"
    })

    let response

    try {
        response = await fetch(
            `${NOMINATIM_SEARCH_URL}?${searchParams.toString()}`,
            {
                headers: {
                    "User-Agent":
                        `Kuvam/1.0 (${env.adminEmail})`,
                    "Accept-Language": "sr,en;q=0.8"
                },
                signal: AbortSignal.timeout(10000)
            }
        )
    } catch {
        throw new AppError(
            "Address service is currently unavailable.",
            503,
            "GEOCODING_SERVICE_UNAVAILABLE"
        )
    }

    if (!response.ok)
        throw new AppError(
            "Address service is currently unavailable.",
            503,
            "GEOCODING_SERVICE_UNAVAILABLE"
        )

    const results = await response.json()
    const result = results[0]

    if (!result)
        throw new AppError(
            "Address could not be found.",
            422,
            "ADDRESS_NOT_FOUND"
        )

    const latitude = Number(result.lat)
    const longitude = Number(result.lon)

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    )
        throw new AppError(
            "Address service returned invalid coordinates.",
            502,
            "INVALID_GEOCODING_RESPONSE"
        )

    return {
        latitude,
        longitude
    }
}

export {
    geocodeAddress
}