import { SELLER_APPROVAL_STATUS } from '../constants/seller.js'
import AppError from '../errors/appError.js'
import Seller from '../models/seller.js'
import Offer from '../models/offer.js'

const createOffer = async (userId, offerData) => {

    const seller = await Seller.findOne({user: userId})

    if(!seller)
        throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")

    if(seller.approvalStatus!== SELLER_APPROVAL_STATUS.APPROVED)
        throw new AppError("Seller account is not approved.", 403, "SELLER_NOT_APPROVED")

    const name = offerData.name
    const description = offerData.description
    const category = offerData.category
    const price = offerData.price
    const availableQuantity = offerData.availableQuantity
    const unit = offerData.unit
    const imageUrl = offerData.imageUrl


    const offer = await Offer.create({
        seller: seller._id,
        name: name,
        description: description,
        category: category,
        price: price,
        availableQuantity: availableQuantity,
        unit: unit,
        imageUrl: imageUrl
        
    })

    return offer

}


const getSellerOffers =  async (userId) => {

    const seller = await Seller.findOne({ user: userId })

    if(!seller)
        throw new AppError("User not found.", 404, "SELLER_PROFILE_NOT_FOUND")

    const offers = await Offer.find({seller: seller._id}).sort({createdAt: -1})


    return offers
}

const setOfferActiveStatus = async (userId, offerId, isActive) => {

    const seller = await Seller.findOne({ user: userId })

    if(!seller)
        throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")


    const offer = await Offer.findById(offerId)

    if(!offer)
        throw new AppError("Offer not found.", 404, "OFFER_NOT_FOUND")

    if(!offer.seller.equals(seller._id))
        throw new AppError("You cant modify another seller's offer.", 403, "OFFER_ACCESS_DENIED")

    offer.isActive = isActive

    await offer.save()

    return offer
}

const updateSellerOffer = async (userId, offerId, updateData) => {

    const seller = await Seller.findOne({user: userId})

    if(!seller)
        throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")

    const offer = await Offer.findById(offerId)

    if(!offer)
        throw new AppError("Offer not found.", 404, "OFFER_NOT_FOUND")

    if(!offer.seller.equals(seller._id))
        throw new AppError("You cant modify another seller's offer.", 403, "OFFER_ACCESS_DENIED")

    Object.assign(offer, updateData)

    await offer.save()

    return offer
}

const getPublicOffers = async (query, cityId) => {
    const search = query.search
    const category = query.category

    const sellerFilter = {
        approvalStatus: SELLER_APPROVAL_STATUS.APPROVED,
        city: {$ne: null},
        "pickupAddress.street": {$nin: [null, ""]},
        "pickupAddress.streetNumber": {$nin: [null, ""]}
    }

    if (cityId)
        sellerFilter.city = cityId

    const approvedSellers = await Seller.find(sellerFilter)

    const approvedSellerIds = approvedSellers.map((seller) => seller._id)

    const filter = {
        isActive: true,
        availableQuantity: {$gt: 0},
        seller: {$in: approvedSellerIds}
    }

    if (search) {
        filter.$or = [
            {name: {$regex: search, $options: "i"}},
            {description: {$regex: search, $options: "i"}}
        ]
    }

    if (category)
        filter.category = category

    const offers = await Offer.find(filter)
        .sort({createdAt: -1})
        .limit(10)
        .populate({
    path: "seller",
    select: "businessName slug description profileImageUrl coverImageUrl city approvalStatus",
    populate: {
        path: "city",
        select: "name slug"
    }
})

    return offers
}

const getPublicOfferById = async (offerId) => {

    const offer = await Offer.findOne({
    _id: offerId,
    isActive: true,
    availableQuantity: {$gt: 0}
}).populate({
    path: "seller",
    select: "businessName slug description profileImageUrl coverImageUrl city approvalStatus",
    populate: {
        path: "city",
        select: "name slug"
    }
})
    if(!offer)
        throw new AppError("Offer not found.", 404, "OFFER_NOT_FOUND")

    if(!offer.seller || offer.seller.approvalStatus !== SELLER_APPROVAL_STATUS.APPROVED)
        throw new AppError("Offer not found.", 404, "OFFER_NOT_FOUND")


    return offer
    
}


export {createOffer, getPublicOfferById, getSellerOffers, setOfferActiveStatus, getPublicOffers, updateSellerOffer}