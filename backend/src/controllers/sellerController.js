import {
    getCurrentSellerProfile,
    updateCurrentSellerProfile,
    getPublicSellers,
    getPublicSellerBySlug,
    updateCurrentSellerProfileImage,
    updateCurrentSellerCoverImage
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

const uploadMySellerProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: {
                code: "IMAGE_REQUIRED",
                message: "Image file is required."
            }
        })
    }

    const imageUrl = `/uploads/sellers/${req.file.filename}`
    const seller = await updateCurrentSellerProfileImage(req.auth.userId, imageUrl)

    return res.status(200).json({
        message: "Seller profile image uploaded successfully.",
        seller
    })
}

const deleteMySellerProfileImage = async (req, res) => {
    const seller = await updateCurrentSellerProfileImage(
        req.auth.userId,
        null
    )

    return res.status(200).json({
        message: "Seller profile image removed successfully.",
        seller
    })
}

const uploadMySellerCoverImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: {
                code: "IMAGE_REQUIRED",
                message: "Image file is required."
            }
        })
    }

    const imageUrl = `/uploads/sellers/${req.file.filename}`
    const seller = await updateCurrentSellerCoverImage(req.auth.userId, imageUrl)

    return res.status(200).json({
        message: "Seller cover image uploaded successfully.",
        seller
    })
}

const deleteMySellerCoverImage = async (req, res) => {
    const seller = await updateCurrentSellerCoverImage(
        req.auth.userId,
        null
    )

    return res.status(200).json({
        message: "Seller cover image removed successfully.",
        seller
    })
}

const getSellers = async (req, res) => {
    const sellers = await getPublicSellers({
    search: req.queryData.search,
    category: req.queryData.category,
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
    uploadMySellerProfileImage,
    deleteMySellerProfileImage,
    uploadMySellerCoverImage,
    deleteMySellerCoverImage,
    getSellers,
    getSellerBySlug
}