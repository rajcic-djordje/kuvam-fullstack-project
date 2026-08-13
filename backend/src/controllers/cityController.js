import {getActiveCities} from "../services/cityService.js"

const getCities = async (req, res) => {
    const cities = await getActiveCities()

    return res.status(200).json({
        message: "Cities retrieved successfully.",
        cities
    })
}

export {getCities}