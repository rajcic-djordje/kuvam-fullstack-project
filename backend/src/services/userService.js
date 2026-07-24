import bcrypt from "bcrypt"
import User from "../models/user.js"
import Seller from "../models/seller.js"
import AppError from "../errors/appError.js"
import { USER_ROLES, USER_STATUS } from "../constants/user.js"


const getCurrentUserProfile = async (userId) => {
    const user = await User.findById(userId)

    if (!user)
        throw new AppError("User not found.",404,"USER_NOT_FOUND")

    const result = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        reportsCount: user.reportsCount,
        offences: user.offences,
        createdAt: user.createdAt
    }

    if (user.role === USER_ROLES.SELLER) {
        const seller = await Seller.findOne({ user: user._id })

        result.sellerProfile = seller
            ? {
                id: seller._id,
                businessName: seller.businessName,
                description: seller.description,
                approvalStatus: seller.approvalStatus
            }
            : null
    }

    return result
}


const updateCurrentUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId)

    if (!user)
        throw new AppError("User not found.",404,"USER_NOT_FOUND")

    if (updateData.firstName !== undefined)
        user.firstName = updateData.firstName

    if (updateData.lastName !== undefined)
        user.lastName = updateData.lastName

    const containsSellerFields =
        updateData.businessName !== undefined ||
        updateData.description !== undefined

    if (containsSellerFields && user.role !== USER_ROLES.SELLER)
        throw new AppError(
            "Seller profile fields can only be updated by sellers.",403,"SELLER_PROFILE_UPDATE_NOT_ALLOWED")

    await user.save()

    if (user.role === USER_ROLES.SELLER && containsSellerFields) {
        const seller = await Seller.findOne({ user: user._id })

        if (!seller)
            throw new AppError("Seller profile not found.",404,"SELLER_PROFILE_NOT_FOUND")

        if (updateData.businessName !== undefined)
            seller.businessName = updateData.businessName

        if (updateData.description !== undefined)
            seller.description = updateData.description

        await seller.save()
    }

    return getCurrentUserProfile(user._id)
}

const changeCurrentUserPassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findById(userId).select("+passwordHash")

    if (!user)
        throw new AppError("User not found.",404,"USER_NOT_FOUND")

    const passwordMatch = await bcrypt.compare(currentPassword,user.passwordHash)

    if (!passwordMatch)
        throw new AppError("Current password is incorrect.",401,"INVALID_CURRENT_PASSWORD")

    user.passwordHash = await bcrypt.hash(newPassword, 12)

    await user.save()

    return true
}


const deactivateCurrentUser = async (userId) => {
    const user = await User.findById(userId)

    if (!user)
        throw new AppError("User not found.",404,"USER_NOT_FOUND")

    if (user.status === USER_STATUS.DEACTIVATED)
        throw new AppError("Account is already deactivated.",409,"ACCOUNT_ALREADY_DEACTIVATED")

    if (user.status === USER_STATUS.BANNED)
        throw new AppError("Banned accounts cannot be deactivated through this endpoint.",409,"BANNED_ACCOUNT_CANNOT_BE_DEACTIVATED")

    user.status = USER_STATUS.DEACTIVATED
    user.suspensionReason = null

    await user.save()

    return {
        id: user._id,
        status: user.status
    }
}

export {getCurrentUserProfile,updateCurrentUserProfile,changeCurrentUserPassword,deactivateCurrentUser}