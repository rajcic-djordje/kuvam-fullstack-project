import {
    SELLER_APPROVAL_STATUS
} from "../constants/seller.js"
import AppError from "../errors/appError.js"
import Seller from "../models/seller.js"
import Offer from "../models/offer.js"
import Order from "../models/order.js"
import fs from "node:fs/promises"
import path from "node:path"

const createOffer = async (
    userId,
    offerData
) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    if (
        seller.approvalStatus !==
        SELLER_APPROVAL_STATUS.APPROVED
    ) {
        throw new AppError(
            "Seller account is not approved.",
            403,
            "SELLER_NOT_APPROVED"
        )
    }

    return Offer.create({
        seller: seller._id,
        name: offerData.name,
        description: offerData.description,
        category: offerData.category,
        price: offerData.price,
        availableQuantity:
            offerData.availableQuantity,
        unit: offerData.unit,
        imageUrl: null
    })
}

const getSellerOffers = async userId => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    return Offer.find({
        seller: seller._id
    }).sort({
        createdAt: -1
    })
}

const getOwnedOffer = async (
    userId,
    offerId
) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller) {
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )
    }

    const offer = await Offer.findById(offerId)

    if (!offer) {
        throw new AppError(
            "Offer not found.",
            404,
            "OFFER_NOT_FOUND"
        )
    }

    if (!offer.seller.equals(seller._id)) {
        throw new AppError(
            "You cannot modify another seller's offer.",
            403,
            "OFFER_ACCESS_DENIED"
        )
    }

    return offer
}

const setOfferActiveStatus = async (
    userId,
    offerId,
    isActive
) => {
    const offer = await getOwnedOffer(
        userId,
        offerId
    )

    offer.isActive = isActive

    await offer.save()

    return offer
}

const updateSellerOffer = async (
    userId,
    offerId,
    updateData
) => {
    const offer = await getOwnedOffer(
        userId,
        offerId
    )

    Object.assign(
        offer,
        updateData
    )

    await offer.save()

    return offer
}

const deleteOfferImage = async imageUrl => {
    if (!imageUrl)
        return

    let imagePath = imageUrl

    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {
        imagePath = new URL(
            imageUrl
        ).pathname
    }

    if (!imagePath.startsWith("/uploads/offers/"))
        return

    const filePath =
        path.resolve(imagePath.slice(1))

    try {
        await fs.unlink(filePath)
    }
    catch (error) {
        if (error.code !== "ENOENT")
            throw error
    }
}

const updateSellerOfferImage = async (
    userId,
    offerId,
    imageUrl
) => {
    const offer = await getOwnedOffer(
        userId,
        offerId
    )

    const previousImageUrl = offer.imageUrl

    offer.imageUrl = imageUrl

    await offer.save()

    await deleteOfferImage(previousImageUrl)

    return offer
}

const getPublicOffers = async (
    query,
    cityId
) => {
    const sellerFilter = {
        approvalStatus:
            SELLER_APPROVAL_STATUS.APPROVED,
        isOpen: true,
        city: {
            $ne: null
        },
        "pickupAddress.street": {
            $nin: [null, ""]
        },
        "pickupAddress.streetNumber": {
            $nin: [null, ""]
        }
    }

    if (cityId) {
        sellerFilter.city = cityId
    }

    const approvedSellers = await Seller.find(
        sellerFilter
    ).select("_id")

    const approvedSellerIds =
        approvedSellers.map(
            seller => seller._id
        )

    const filter = {
        isActive: true,
        availableQuantity: {
            $gt: 0
        },
        seller: {
            $in: approvedSellerIds
        }
    }

    if (query.search) {
        filter.$or = [
            {
                name: {
                    $regex: query.search,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: query.search,
                    $options: "i"
                }
            }
        ]
    }

    if (query.category) {
        filter.category = query.category
    }

    return Offer.find(filter)
        .sort({
            createdAt: -1
        })
        .limit(10)
        .populate({
            path: "seller",
            select: "businessName slug description profileImageUrl coverImageUrl city approvalStatus isOpen",
            populate: {
                path: "city",
                select: "name slug"
            }
        })
}

const getPublicOfferById = async offerId => {
    const offer = await Offer.findOne({
        _id: offerId,
        isActive: true,
        availableQuantity: {
            $gt: 0
        }
    }).populate({
        path: "seller",
        select: "businessName slug description profileImageUrl coverImageUrl city approvalStatus isOpen",
        populate: {
            path: "city",
            select: "name slug"
        }
    })

    if (!offer) {
        throw new AppError(
            "Offer not found.",
            404,
            "OFFER_NOT_FOUND"
        )
    }

    if (
        !offer.seller ||
        offer.seller.approvalStatus !==
        SELLER_APPROVAL_STATUS.APPROVED ||
        !offer.seller.isOpen
    ) {
        throw new AppError(
            "Offer not found.",
            404,
            "OFFER_NOT_FOUND"
        )
    }

    return offer
}

const deleteSellerOffer = async (
    userId,
    offerId
) => {
    const offer = await getOwnedOffer(
        userId,
        offerId
    )

    const hasOrders = await Order.exists({
        offer: offer._id
    })

    if (hasOrders) {
        throw new AppError(
            "Offer with existing orders cannot be deleted.",
            409,
            "OFFER_HAS_ORDERS"
        )
    }

    await deleteOfferImage(offer.imageUrl)
    await offer.deleteOne()
}

export {
    deleteSellerOffer,
    createOffer,
    getPublicOfferById,
    getSellerOffers,
    setOfferActiveStatus,
    updateSellerOffer,
    updateSellerOfferImage,
    getPublicOffers
}