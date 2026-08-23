import Seller from "../models/seller.js"
import City from "../models/city.js"
import AppError from "../errors/appError.js"
import Offer from "../models/offer.js"
import fs from "node:fs/promises"
import path from "node:path"
import {SELLER_APPROVAL_STATUS} from "../constants/seller.js"
import {OFFER_CATEGORIES} from "../constants/offer.js"
import {createPublicLocationZone} from "../utils/publicLocation.js"
import User from "../models/user.js"

const createSellerSlug = (businessName) => {
    return businessName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

const generateUniqueSellerSlug = async (businessName, sellerId) => {
    const baseSlug = createSellerSlug(businessName)

    let slug = baseSlug
    let suffix = 2

    while (await Seller.exists({
        slug,
        _id: {$ne: sellerId}
    })) {
        slug = `${baseSlug}-${suffix}`
        suffix += 1
    }

    return slug
}

const roundPublicCoordinate = (coordinate) => {
    if (coordinate === null || coordinate === undefined)
        return null

    return Math.round(coordinate * 100) / 100
}

const formatSellerProfile = (seller) => {
    return {
        id: seller._id,
        businessName: seller.businessName,
        slug: seller.slug,
        description: seller.description,
        profileImageUrl: seller.profileImageUrl,
        coverImageUrl: seller.coverImageUrl,
        isOpen: seller.isOpen,
        city: seller.city
            ? {
                id: seller.city._id,
                name: seller.city.name,
                slug: seller.city.slug
            }
            : null,
        pickupAddress: {
            street: seller.pickupAddress?.street ?? null,
            streetNumber: seller.pickupAddress?.streetNumber ?? null,
            additionalInfo: seller.pickupAddress?.additionalInfo ?? null,
            latitude: seller.pickupAddress?.latitude ?? null,
            longitude: seller.pickupAddress?.longitude ?? null
        },
        approvalStatus: seller.approvalStatus,
        rejectionReason: seller.rejectionReason,
        isProfileComplete: Boolean(
            seller.businessName &&
            seller.description &&
            seller.city &&
            seller.pickupAddress?.street &&
            seller.pickupAddress?.streetNumber &&
            seller.pickupAddress?.latitude !== null &&
            seller.pickupAddress?.latitude !== undefined &&
            seller.pickupAddress?.longitude !== null &&
            seller.pickupAddress?.longitude !== undefined
        ),
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt
    }
}

const formatPublicSellerProfile = (seller) => {
    return {
        id: seller._id,
        businessName: seller.businessName,
        slug: seller.slug,
        description: seller.description,
        profileImageUrl: seller.profileImageUrl,
        coverImageUrl: seller.coverImageUrl,
        isOpen: seller.isOpen,
        city: seller.city
            ? {
                id: seller.city._id,
                name: seller.city.name,
                slug: seller.city.slug
            }
            : null
    }
}

const formatPublicOffer = (offer) => {
    return {
        id: offer._id,
        name: offer.name,
        description: offer.description,
        category: offer.category,
        price: offer.price,
        availableQuantity: offer.availableQuantity,
        unit: offer.unit,
        imageUrl: offer.imageUrl
    }
}

const getCurrentSellerProfile = async (userId) => {
    const seller = await Seller.findOne({
        user: userId
    }).populate("city", "name slug")

    if (!seller)
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )

    return formatSellerProfile(seller)
}

const updateCurrentSellerProfile = async (userId, updateData) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller)
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )

    if (updateData.businessName !== undefined) {
        seller.businessName = updateData.businessName
        seller.slug = await generateUniqueSellerSlug(updateData.businessName, seller._id)
    }
    else if (!seller.slug) {
        seller.slug = await generateUniqueSellerSlug(seller.businessName, seller._id)
    }

    if (updateData.description !== undefined)
        seller.description = updateData.description

    if (updateData.isOpen !== undefined)
        seller.isOpen = updateData.isOpen

    const containsAddressData =
        updateData.cityId !== undefined ||
        updateData.street !== undefined ||
        updateData.streetNumber !== undefined ||
        updateData.additionalInfo !== undefined

    if (containsAddressData) {
        const city = await City.findOne({
            _id: updateData.cityId,
            isActive: true
        })

        if (!city)
            throw new AppError(
                "City not found or inactive.",
                404,
                "CITY_NOT_FOUND"
            )

        seller.city = city._id
        seller.pickupAddress.street = updateData.street
        seller.pickupAddress.streetNumber = updateData.streetNumber
        seller.pickupAddress.additionalInfo = updateData.additionalInfo || null
    }

    const containsCoordinates =
        updateData.latitude !== undefined ||
        updateData.longitude !== undefined

    if (containsCoordinates) {
        seller.pickupAddress.latitude = updateData.latitude
        seller.pickupAddress.longitude = updateData.longitude
    }

    await seller.save()

    return getCurrentSellerProfile(userId)
}

const getPublicSellers = async ({
    search,
    category,
    cityId
}) => {
    if (
        category &&
        !Object.values(OFFER_CATEGORIES).includes(category)
    ) {
        throw new AppError(
            "Invalid offer category.",
            400,
            "INVALID_OFFER_CATEGORY"
        )
    }

    const activeSellerUsers = await User.find({
    status: "active",
    role: "seller"
}).select("_id")

const activeSellerUserIds = activeSellerUsers.map((user) => user._id)

    const sellerFilter = {
        user: {$in: activeSellerUserIds},
    approvalStatus: SELLER_APPROVAL_STATUS.APPROVED,
    isOpen: true,
    city: {$ne: null},
    "pickupAddress.street": {$nin: [null, ""]},
    "pickupAddress.streetNumber": {$nin: [null, ""]}
}

    if (cityId)
        sellerFilter.city = cityId

    const sellers = await Seller.find(sellerFilter)
        .populate("city", "name slug")
        .sort({createdAt: -1})

    const sellerIds = sellers.map((seller) => {
        return seller._id
    })

    const offerFilter = {
        seller: {$in: sellerIds},
        isActive: true,
        availableQuantity: {$gt: 0}
    }

    if (category)
        offerFilter.category = category

    const offers = await Offer.find(offerFilter)
        .sort({createdAt: -1})

    const normalizedSearch =
        search?.trim().toLowerCase() ?? ""

    const sellersById = new Map(
        sellers.map((seller) => [
            seller._id.toString(),
            seller
        ])
    )

    const offersBySeller = new Map()

    for (const offer of offers) {
        const sellerId = offer.seller.toString()
        const seller = sellersById.get(sellerId)

        const sellerMatches =
            !normalizedSearch ||
            seller.businessName
                .toLowerCase()
                .includes(normalizedSearch)

        const offerMatches =
            !normalizedSearch ||
            offer.name
                .toLowerCase()
                .includes(normalizedSearch) ||
            offer.description
                .toLowerCase()
                .includes(normalizedSearch)

        if (!sellerMatches && !offerMatches)
            continue

        if (!offersBySeller.has(sellerId))
            offersBySeller.set(sellerId, [])

        const sellerOffers =
            offersBySeller.get(sellerId)

        if (sellerOffers.length < 3)
            sellerOffers.push(formatPublicOffer(offer))
    }

    return sellers
        .filter((seller) => {
            return offersBySeller.has(
                seller._id.toString()
            )
        })
        .map((seller) => ({
            ...formatPublicSellerProfile(seller),
            offers: offersBySeller.get(
                seller._id.toString()
            )
        }))
}

const getPublicSellerBySlug = async (slug) => {

    const activeSellerUsers = await User.find({
    status: "active",
    role: "seller"
}).select("_id")

const activeSellerUserIds = activeSellerUsers.map((user) => user._id)

    const seller = await Seller.findOne({
        user: {$in: activeSellerUserIds},
    slug,
    approvalStatus: SELLER_APPROVAL_STATUS.APPROVED,
    isOpen: true,
    city: {$ne: null},
    "pickupAddress.street": {$nin: [null, ""]},
    "pickupAddress.streetNumber": {$nin: [null, ""]}
}).populate("city", "name slug")

    if (!seller)
        throw new AppError(
            "Seller not found.",
            404,
            "SELLER_NOT_FOUND"
        )

    const publicLocationZone = createPublicLocationZone(
        seller._id,
        seller.pickupAddress?.latitude,
        seller.pickupAddress?.longitude
    )

    const offers = await Offer.find({
        seller: seller._id,
        isActive: true,
        availableQuantity: {$gt: 0}
    }).sort({createdAt: -1})

    return {
        ...formatPublicSellerProfile(seller),
        publicLocationZone,
        offers: offers.map(formatPublicOffer)
    }
}

const deleteSellerImage = async (imageUrl) => {
    if (!imageUrl)
        return

    let imagePath = imageUrl

    if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
    ) {
        imagePath = new URL(imageUrl).pathname
    }

    if (!imagePath.startsWith("/uploads/sellers/"))
        return

    const filePath = path.resolve(imagePath.slice(1))

    try {
        await fs.unlink(filePath)
    }
    catch (error) {
        if (error.code !== "ENOENT")
            throw error
    }
}

const updateCurrentSellerProfileImage = async (userId, imageUrl) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller)
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )

    const previousImageUrl = seller.profileImageUrl

    seller.profileImageUrl = imageUrl

    await seller.save()
    await deleteSellerImage(previousImageUrl)

    return getCurrentSellerProfile(userId)
}

const updateCurrentSellerCoverImage = async (userId, imageUrl) => {
    const seller = await Seller.findOne({
        user: userId
    })

    if (!seller)
        throw new AppError(
            "Seller profile not found.",
            404,
            "SELLER_PROFILE_NOT_FOUND"
        )

    const previousImageUrl = seller.coverImageUrl

    seller.coverImageUrl = imageUrl

    await seller.save()
    await deleteSellerImage(previousImageUrl)

    return getCurrentSellerProfile(userId)
}

export {
    getCurrentSellerProfile,
    updateCurrentSellerProfile,
    getPublicSellers,
    getPublicSellerBySlug,
    updateCurrentSellerProfileImage,
    updateCurrentSellerCoverImage
}