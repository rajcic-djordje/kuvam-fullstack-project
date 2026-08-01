import City from "../models/city.js"

const getActiveCities = async () => {
    const cities = await City.find({isActive: true}).sort({name: 1})

    return cities.map((city) => ({
        id: city._id,
        name: city.name,
        slug: city.slug
    }))
}

export {getActiveCities}