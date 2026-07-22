import { createOffer, getPublicOffers,getPublicOfferById, getSellerOffers, setOfferActiveStatus, updateSellerOffer } from "../services/offerService.js"

const createOfferListing = async(req,res) => {

    const userId = req.auth.userId

    console.log("JWT userId:", req.auth.userId)

    const offer = await createOffer(userId,req.body)

    return res.status(201).json({
        message: "Offer created successfully.",
        offer
    })
}


const getMyOffers = async (req,res) => {

    const userId = req.auth.userId

    const offers = await getSellerOffers(userId)

    return res.status(201).json({
        message: "Seller offers retrieved successfully.",
        offers
    })
}


const activateOfferListing = async (req,res) => {

    const userId = req.auth.userId

    const offerId = req.params.offerId

    const offer = await setOfferActiveStatus(userId, offerId,true)

    return res.status(200).json({
        message: "Offer activated successfully.",
        offer
    })
}


const deactivateOfferListing = async (req,res) => {

    const userId = req.auth.userId

    const offerId = req.params.offerId

    const offer = await setOfferActiveStatus(userId,offerId,false)

    return res.status(200).json({
        message: "Offer deactivated successfully.",
        offer
    })
}


const updateOfferListing = async (req, res) => {
    const userId = req.auth.userId
    const offerId = req.params.offerId

    const offer = await updateSellerOffer(
        userId,
        offerId,
        req.body
    )

    return res.status(200).json({
        message: "Offer updated successfully.",
        offer
    })

}

const getAvailableOffers = async (req, res) => {
    const offers = await getPublicOffers()

    return res.status(200).json({
        message: "Available offers retrieved successfully.",
        offers
    })
}

const getAvailableOfferById = async (req, res) => {
    const offerId = req.params.offerId

    const offer = await getPublicOfferById(offerId)

    return res.status(200).json({
        message: "Offer retrieved successfully.",
        offer
    })
}

export {createOfferListing, getAvailableOfferById, getMyOffers, activateOfferListing, deactivateOfferListing, updateOfferListing, getAvailableOffers}