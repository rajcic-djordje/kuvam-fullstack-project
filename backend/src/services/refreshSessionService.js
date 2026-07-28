import RefreshSession from "../models/refreshSession.js"
import User from "../models/user.js"
import AppError from "../errors/appError.js"
import env from "../config/env.js"
import {USER_STATUS} from "../constants/user.js"
import {generateRefreshToken, hashRefreshToken} from "../utils/refreshToken.js"

const getExpirationDate = () => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + env.refreshSessionExpiresInDays)

    return expiresAt
}

const createRefreshSession = async(userId) => {
    const refreshToken = generateRefreshToken()
    const tokenHash = hashRefreshToken(refreshToken)

    await RefreshSession.create({
        user: userId,
        tokenHash,
        expiresAt: getExpirationDate()
    })

    return refreshToken
}

const rotateRefreshSession = async(refreshToken) => {
    const tokenHash = hashRefreshToken(refreshToken)
    const session = await RefreshSession.findOne({tokenHash})

    if(!session)
        throw new AppError("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN")

    if(session.revokedAt) {
        await RefreshSession.updateMany(
            {user: session.user, revokedAt: null},
            {$set: {revokedAt: new Date()}}
        )

        throw new AppError("Refresh token reuse detected.", 401, "REFRESH_TOKEN_REUSE")
    }

    if(session.expiresAt <= new Date()) {
        session.revokedAt = new Date()
        await session.save()

        throw new AppError("Refresh token expired.", 401, "REFRESH_TOKEN_EXPIRED")
    }

    const user = await User.findById(session.user)

    if(!user)
        throw new AppError("User not found.", 401, "INVALID_REFRESH_TOKEN")

    if(user.status === USER_STATUS.SUSPENDED)
        throw new AppError("Account suspended.", 403, "ACCOUNT_SUSPENDED")

    if(user.status === USER_STATUS.BANNED)
        throw new AppError("Account banned.", 403, "ACCOUNT_BANNED")

    if(user.status === USER_STATUS.DEACTIVATED)
        throw new AppError("Account deactivated.", 403, "ACCOUNT_DEACTIVATED")

    const newRefreshToken = generateRefreshToken()
    const newTokenHash = hashRefreshToken(newRefreshToken)

    const revokedSession = await RefreshSession.findOneAndUpdate(
        {
            _id: session._id,
            revokedAt: null,
            expiresAt: {$gt: new Date()}
        },
        {
            $set: {
                revokedAt: new Date(),
                replacedByTokenHash: newTokenHash
            }
        },
        {new: true}
    )

    if(!revokedSession) {
        await RefreshSession.updateMany(
            {user: session.user, revokedAt: null},
            {$set: {revokedAt: new Date()}}
        )

        throw new AppError("Refresh token reuse detected.", 401, "REFRESH_TOKEN_REUSE")
    }

    await RefreshSession.create({
        user: user._id,
        tokenHash: newTokenHash,
        expiresAt: getExpirationDate()
    })

    return {
        user,
        refreshToken: newRefreshToken
    }
}

const revokeRefreshSession = async(refreshToken) => {
    if(!refreshToken)
        return

    const tokenHash = hashRefreshToken(refreshToken)

    await RefreshSession.findOneAndUpdate(
        {tokenHash, revokedAt: null},
        {$set: {revokedAt: new Date()}}
    )
}

const revokeAllUserSessions = async(userId) => {
    await RefreshSession.updateMany(
        {user: userId, revokedAt: null},
        {$set: {revokedAt: new Date()}}
    )
}

export {createRefreshSession, rotateRefreshSession, revokeRefreshSession, revokeAllUserSessions}