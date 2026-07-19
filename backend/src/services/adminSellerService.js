import { SELLER_APPROVAL_STATUS } from '../constants/seller.js'
import Seller from '../models/seller.js'
import AppError from '../errors/appError.js'

const getPendingSellers = async () =>
{
    return await Seller.find({approvalStatus: SELLER_APPROVAL_STATUS.PENDING}).populate("user", "firstName lastName email status").sort({createdAt: 1})

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