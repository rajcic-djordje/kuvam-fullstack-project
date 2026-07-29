import { SELLER_APPROVAL_STATUS } from '../constants/seller.js'
import Seller from '../models/seller.js'
import AppError from '../errors/appError.js'

const getPendingSellers = async(search, sort) => {
    const filter = {
        approvalStatus: SELLER_APPROVAL_STATUS.PENDING
    }

    if(search) {
        const searchRegex = new RegExp(search, "i")

        const matchingUsers = await User.find({
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex }
            ]
        }).select("_id").lean()

        const matchingUserIds = matchingUsers.map(user => user._id)

        filter.$or = [
            { businessName: searchRegex },
            { user: { $in: matchingUserIds } }
        ]
    }

    const sortOption =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 }

    return Seller.find(filter)
        .populate(
            "user",
            "firstName lastName email status"
        )
        .sort(sortOption)
        .lean()
}

const approveSeller = async (sellerId) => {

    const seller = await Seller.findById(sellerId)

    if(!seller)
        throw new AppError("Seller application not found.", 404, "SELLER_NOT_FOUND")

    if(seller.approvalStatus!==SELLER_APPROVAL_STATUS.PENDING)
        throw new AppError("Seller application already processed.", 409, "SELLER_APPLICATION_ALREADY_PROCESSED")
    
    seller.approvalStatus=SELLER_APPROVAL_STATUS.APPROVED
    seller.rejectionReason=null

    await seller.save()

    return seller
}

const rejectSeller = async (sellerId, reason) => {

    const seller = await Seller.findById(sellerId)


    if(!seller)
        throw new AppError("Seller application not found.", 404, "SELLER_NOT_FOUND")

    if(seller.approvalStatus!==SELLER_APPROVAL_STATUS.PENDING)
        throw new AppError("Seller application already processed.", 409, "SELLER_APPLICATION_ALREADY_PROCESSED")
 
    seller.approvalStatus=SELLER_APPROVAL_STATUS.REJECTED
    seller.rejectionReason=reason

    await seller.save()

    return seller
}


export {getPendingSellers, approveSeller, rejectSeller}