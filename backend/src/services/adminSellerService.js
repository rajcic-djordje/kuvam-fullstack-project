import { SELLER_APPROVAL_STATUS } from '../constants/seller.js'
import Seller from '../models/seller.js'
import AppError from '../errors/appError.js'
import User from "../models/user.js"
import { USER_ROLES, USER_STATUS } from '../constants/user.js'

const getPendingSellers = async(search, sort) => {
    const activeSellerUsers = await User.find({
        role: USER_ROLES.SELLER,
        status: USER_STATUS.ACTIVE
    })
        .select("_id")
        .lean()

    const activeSellerUserIds = activeSellerUsers.map(
        user => user._id
    )

    const filter = {
        approvalStatus: SELLER_APPROVAL_STATUS.PENDING,
        user: {
            $in: activeSellerUserIds
        }
    }

    if(search) {
        const searchRegex = new RegExp(search, "i")

        const matchingUsers = await User.find({
            role: USER_ROLES.SELLER,
            status: USER_STATUS.ACTIVE,
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex }
            ]
        })
            .select("_id")
            .lean()

        const matchingUserIds = matchingUsers.map(
            user => user._id
        )

        filter.$or = [
            { businessName: searchRegex },
            {
                user: {
                    $in: matchingUserIds
                }
            }
        ]
    }

    const sortOption =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 }

    return Seller.find(filter)
        .populate(
            "user",
            [
                "firstName",
                "lastName",
                "email",
                "role",
                "status",
                "reportsCount",
                "offences",
                "createdAt"
            ].join(" ")
        )
        .sort(sortOption)
        .lean()
}

const approveSeller = async(sellerId) => {
    const seller = await Seller.findById(sellerId)
        .populate("user")

    if(!seller)
        throw new AppError("Seller application not found.", 404, "SELLER_NOT_FOUND")

    if(seller.approvalStatus !== SELLER_APPROVAL_STATUS.PENDING)
        throw new AppError("Seller application already processed.", 409, "SELLER_APPLICATION_ALREADY_PROCESSED")

    if(!seller.user)
        throw new AppError("Seller account not found.", 404, "SELLER_USER_NOT_FOUND")

    if(seller.user.status !== USER_STATUS.ACTIVE)
        throw new AppError("Only an active user can be approved as a seller.", 409, "SELLER_USER_NOT_ACTIVE")

        const isProfileComplete = Boolean(
        seller.businessName &&
        seller.description &&
        seller.city &&
        seller.pickupAddress?.street &&
        seller.pickupAddress?.streetNumber &&
        seller.pickupAddress?.latitude !== null &&
        seller.pickupAddress?.latitude !== undefined &&
        seller.pickupAddress?.longitude !== null &&
        seller.pickupAddress?.longitude !== undefined
    )

    if(!isProfileComplete)
        throw new AppError(
            "Seller profile must be complete before approval.",
            409,
            "SELLER_PROFILE_INCOMPLETE"
        )


    seller.approvalStatus = SELLER_APPROVAL_STATUS.APPROVED
    seller.rejectionReason = null

    await seller.save()

    return seller
}

const rejectSeller = async(sellerId, reason) => {
    const seller = await Seller.findById(sellerId)

    if(!seller)
        throw new AppError("Seller application not found.", 404, "SELLER_NOT_FOUND")

    if(seller.approvalStatus !== SELLER_APPROVAL_STATUS.PENDING)
        throw new AppError("Seller application already processed.", 409, "SELLER_APPLICATION_ALREADY_PROCESSED")

    seller.approvalStatus = SELLER_APPROVAL_STATUS.REJECTED
    seller.rejectionReason = reason

    await seller.save()

    return seller
}

export {
    getPendingSellers,
    approveSeller,
    rejectSeller
}