import {
    deleteSellerOffer,
    createOffer,
    getPublicOffers,
    getPublicOfferById,
    getSellerOffers,
    setOfferActiveStatus,
    updateSellerOffer,
    updateSellerOfferImage
} from "../services/offerService.js"

const createOfferListing = async (req, res) => {
    const offer = await createOffer(
        req.auth.userId,
        req.body
    )

    return res.status(201).json({
        message: "Offer created successfully.",
        offer
    })
}

const getMyOffers = async (req, res) => {
    const offers = await getSellerOffers(
        req.auth.userId
    )

    return res.status(200).json({
        message: "Seller offers retrieved successfully.",
        offers
    })
}

const activateOfferListing = async (req, res) => {
    const offer = await setOfferActiveStatus(
        req.auth.userId,
        req.params.offerId,
        true
    )

    return res.status(200).json({
        message: "Offer activated successfully.",
        offer
    })
}

const deactivateOfferListing = async (req, res) => {
    const offer = await setOfferActiveStatus(
        req.auth.userId,
        req.params.offerId,
        false
    )

    return res.status(200).json({
        message: "Offer deactivated successfully.",
        offer
    })
}

const updateOfferListing = async (req, res) => {
    const offer = await updateSellerOffer(
        req.auth.userId,
        req.params.offerId,
        req.body
    )

    return res.status(200).json({
        message: "Offer updated successfully.",
        offer
    })
}

const uploadOfferImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: {
                code: "IMAGE_REQUIRED",
                message: "Image file is required."
            }
        })
    }

    const imageUrl =
        `${req.protocol}://${req.get("host")}/uploads/offers/${req.file.filename}`

    const offer = await updateSellerOfferImage(
        req.auth.userId,
        req.params.offerId,
        imageUrl
    )

    return res.status(200).json({
        message: "Offer image uploaded successfully.",
        offer
    })
}

const getAvailableOffers = async (req, res) => {
    const offers = await getPublicOffers(
        req.queryData,
        req.auth?.cityId
    )

    return res.status(200).json({
        message: "Available offers retrieved successfully.",
        offers
    })
}

const getAvailableOfferById = async (req, res) => {
    const offer = await getPublicOfferById(
        req.params.offerId
    )

    return res.status(200).json({
        message: "Offer retrieved successfully.",
        offer
    })
}

const deleteOfferListing = async (req, res) => {
    await deleteSellerOffer(
        req.auth.userId,
        req.params.offerId
    )

    return res.status(200).json({
        message: "Offer deleted successfully."
    })
}

export {
    deleteOfferListing,
    createOfferListing,
    getAvailableOfferById,
    getMyOffers,
    activateOfferListing,
    deactivateOfferListing,
    updateOfferListing,
    uploadOfferImage,
    getAvailableOffers
}