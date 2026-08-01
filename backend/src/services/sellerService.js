import Seller from "../models/seller.js"
import City from "../models/city.js"
import AppError from "../errors/appError.js"
import Offer from "../models/offer.js"
import {SELLER_APPROVAL_STATUS} from "../constants/seller.js"
import {OFFER_CATEGORIES} from "../constants/offer.js"

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

const formatSellerProfile = (seller) => {
    return {
        id: seller._id,
        businessName: seller.businessName,
        slug: seller.slug,
        description: seller.description,
        profileImageUrl: seller.profileImageUrl,
        coverImageUrl: seller.coverImageUrl,
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
            additionalInfo: seller.pickupAddress?.additionalInfo ?? null
        },
        approvalStatus: seller.approvalStatus,
        rejectionReason: seller.rejectionReason,
        isProfileComplete: Boolean(
            seller.businessName &&
            seller.description &&
            seller.city &&
            seller.pickupAddress?.street &&
            seller.pickupAddress?.streetNumber
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
    const seller = await Seller.findOne({user: userId}).populate("city", "name slug")

    if (!seller)
        throw new AppError("Seller profile not found.",404,"SELLER_PROFILE_NOT_FOUND")

    return formatSellerProfile(seller)
}

const updateCurrentSellerProfile = async (userId, updateData) => {
    const seller = await Seller.findOne({user: userId})

    if (!seller)
        throw new AppError("Seller profile not found.",404,"SELLER_PROFILE_NOT_FOUND")

    if (updateData.businessName !== undefined) {
        seller.businessName = updateData.businessName
        seller.slug = await generateUniqueSellerSlug(updateData.businessName, seller._id)
    }
    else if (!seller.slug) {
        seller.slug = await generateUniqueSellerSlug(seller.businessName, seller._id)
    }

    if (updateData.description !== undefined)
        seller.description = updateData.description

    const containsLocationData =
        updateData.cityId !== undefined ||
        updateData.street !== undefined ||
        updateData.streetNumber !== undefined ||
        updateData.additionalInfo !== undefined

    if (containsLocationData) {
        const city = await City.findOne({
            _id: updateData.cityId,
            isActive: true
        })

        if (!city)
            throw new AppError("City not found or inactive.",404,"CITY_NOT_FOUND")

        seller.city = city._id
        seller.pickupAddress = {
            street: updateData.street,
            streetNumber: updateData.streetNumber,
            additionalInfo: updateData.additionalInfo || null
        }
    }

    await seller.save()

    return getCurrentSellerProfile(userId)
}

const getPublicSellers = async ({search, category, cityId}) => {
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

    const sellerFilter = {
        approvalStatus: SELLER_APPROVAL_STATUS.APPROVED,
        city: {$ne: null},
        "pickupAddress.street": {$nin: [null, ""]},
        "pickupAddress.streetNumber": {$nin: [null, ""]}
    }

    if (cityId)
        sellerFilter.city = cityId

    const sellers = await Seller.find(sellerFilter)
        .populate("city", "name slug")
        .sort({createdAt: -1})

    const sellerIds = sellers.map((seller) => seller._id)

    const offerFilter = {
        seller: {$in: sellerIds},
        isActive: true,
        availableQuantity: {$gt: 0}
    }

    if (category)
        offerFilter.category = category

    const offers = await Offer.find(offerFilter).sort({createdAt: -1})

    const normalizedSearch = search?.trim().toLowerCase() ?? ""

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
            seller.businessName.toLowerCase().includes(normalizedSearch)

        const offerMatches =
            !normalizedSearch ||
            offer.name.toLowerCase().includes(normalizedSearch) ||
            offer.description.toLowerCase().includes(normalizedSearch)

        if (!sellerMatches && !offerMatches)
            continue

        if (!offersBySeller.has(sellerId))
            offersBySeller.set(sellerId, [])

        const sellerOffers = offersBySeller.get(sellerId)

        if (sellerOffers.length < 3)
            sellerOffers.push(formatPublicOffer(offer))
    }

    return sellers
        .filter((seller) => offersBySeller.has(seller._id.toString()))
        .map((seller) => ({
            ...formatPublicSellerProfile(seller),
            offers: offersBySeller.get(seller._id.toString())
        }))
}

const getPublicSellerBySlug = async (slug) => {
    const seller = await Seller.findOne({
        slug,
        approvalStatus: SELLER_APPROVAL_STATUS.APPROVED,
        city: {$ne: null},
        "pickupAddress.street": {$nin: [null, ""]},
        "pickupAddress.streetNumber": {$nin: [null, ""]}
    }).populate("city", "name slug")

    if (!seller)
        throw new AppError("Seller not found.",404,"SELLER_NOT_FOUND")

    const offers = await Offer.find({
        seller: seller._id,
        isActive: true,
        availableQuantity: {$gt: 0}
    }).sort({createdAt: -1})

    return {
        ...formatPublicSellerProfile(seller),
        offers: offers.map(formatPublicOffer)
    }
}


export {
    getCurrentSellerProfile,
    updateCurrentSellerProfile,
    getPublicSellers,
    getPublicSellerBySlug
}