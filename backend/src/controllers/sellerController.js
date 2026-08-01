import {
    getCurrentSellerProfile,
    updateCurrentSellerProfile,
    getPublicSellers,
    getPublicSellerBySlug
} from "../services/sellerService.js"

const getMySellerProfile = async (req, res) => {
    const seller = await getCurrentSellerProfile(req.auth.userId)

    return res.status(200).json({
        message: "Seller profile retrieved successfully.",
        seller
    })
}

const updateMySellerProfile = async (req, res) => {
    const seller = await updateCurrentSellerProfile(req.auth.userId, req.body)

    return res.status(200).json({
        message: "Seller profile updated successfully.",
        seller
    })
}

const getSellers = async (req, res) => {
    const sellers = await getPublicSellers({
        search: req.query.search,
        category: req.query.category,
        cityId: req.auth?.cityId
    })

    return res.status(200).json({
        message: "Sellers retrieved successfully.",
        sellers
    })
}
const getSellerBySlug = async (req, res) => {
    const seller = await getPublicSellerBySlug(req.params.slug)

    return res.status(200).json({
        message: "Seller retrieved successfully.",
        seller
    })
}

export {
    getMySellerProfile,
    updateMySellerProfile,
    getSellers,
    getSellerBySlug
}