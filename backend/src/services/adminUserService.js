import User from '../models/user.js'
import {
    USER_ROLES,
    USER_STATUS
} from '../constants/user.js'
import AppError from '../errors/appError.js'
import {revokeAllUserSessions} from "./refreshSessionService.js"

const suspendUser = async(userId, reason) => {


    const user = await User.findById(userId)

    if(!user)
        throw new AppError("User not found.", 404, "USER_NOT_FOUND")
    
    if(user.status===USER_STATUS.SUSPENDED)
        throw new AppError("User is already suspended.", 409, "USER_ALREADY_SUSPENDED")
    else if(user.status === USER_STATUS.BANNED)
        throw new AppError("Banned user cant be suspended.", 409, "USER_ALREADY_BANNED")
    else if(user.status === USER_STATUS.DEACTIVATED)
    throw new AppError(
        "Deactivated user cant be suspended.",409,"USER_DEACTIVATED")

    user.status = USER_STATUS.SUSPENDED
    user.suspensionReason = reason
    user.suspendedAt = new Date()

    await user.save()

    await revokeAllUserSessions(user._id)

    return user

}


const unsuspendUser = async(userId) => {
    const user = await User.findById(userId)

    if(!user)
        throw new AppError("User not found.", 404, "USER_NOT_FOUND")
    
    if(user.status!==USER_STATUS.SUSPENDED)
        throw new AppError("User is not suspended.", 409, "USER_NOT_SUSPENDED")


    user.status = USER_STATUS.ACTIVE
    user.suspensionReason = null
    user.suspendedAt = null
    
    await user.save()

    return user

}

const getUsers = async(search, role, status, sort) => {
    const filter = {
        role: { $ne: USER_ROLES.ADMIN }
    }

    if(role)
        filter.role = role

    if(status)
        filter.status = status

    if(search) {
        const searchRegex = new RegExp(search, "i")

        filter.$or = [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { email: searchRegex }
        ]
    }

    const sortOption =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 }

    return User.find(filter)
        .select(
            "firstName lastName email role status reportsCount offences offencesSinceLastBan suspensionReason suspendedAt banReason createdAt"
        )
        .sort(sortOption)
        .lean()
}

const getSuspendedUsers = async(search, sort) => {
    const filter = {
        role: { $ne: USER_ROLES.ADMIN },
        status: USER_STATUS.SUSPENDED
    }

    if(search) {
        const searchRegex = new RegExp(search, "i")

        filter.$or = [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { email: searchRegex }
        ]
    }

    const sortOption =
        sort === "oldest"
            ? { suspendedAt: 1 }
            : { suspendedAt: -1 }

    return User.find(filter)
        .select(
            [
                "firstName",
                "lastName",
                "email",
                "role",
                "status",
                "suspensionReason",
                "suspendedAt",
                "reportsCount",
                "offences",
                "createdAt"
            ].join(" ")
        )
        .sort(sortOption)
        .lean()
}

const banUser = async(userId, reason) => {
    const user = await User.findById(userId)

    if(!user)
        throw new AppError("User not found.",404,"USER_NOT_FOUND")

    if(user.role === USER_ROLES.ADMIN)
        throw new AppError("Admin account cant be banned.",403,"ADMIN_ACCOUNT_CANNOT_BE_BANNED")

    if(user.status === USER_STATUS.BANNED)
        throw new AppError("User is already banned.",409,"USER_ALREADY_BANNED")

    if(user.status === USER_STATUS.DEACTIVATED)
        throw new AppError("Deactivated user cant be banned.",409,"USER_DEACTIVATED")

    user.status = USER_STATUS.BANNED
    user.banReason = reason
    user.suspensionReason = null
    user.suspendedAt = null

    await user.save()
    await revokeAllUserSessions(user._id)

    return user
}

const unbanUser = async(userId) => {
    const user = await User.findById(userId)

    if(!user)
        throw new AppError("User not found.",404,"USER_NOT_FOUND")

    if(user.status !== USER_STATUS.BANNED)
        throw new AppError("User is not banned.",409,"USER_NOT_BANNED")

    user.status = USER_STATUS.ACTIVE
    user.banReason = null
    user.offencesSinceLastBan = 0


    await user.save()

    return user
}


export {suspendUser, unsuspendUser, getUsers, getSuspendedUsers, banUser, unbanUser}