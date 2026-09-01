import bcrypt from 'bcrypt'
import {randomInt} from 'crypto'
import User from '../models/user.js'
import { USER_ROLES, USER_STATUS } from '../constants/user.js'
import AppError from '../errors/appError.js'
import Seller from '../models/seller.js'
import { generateAccessToken } from '../utils/jwt.js'
import {sendPasswordResetCode} from './emailService.js'
import {
    createRefreshSession,
    rotateRefreshSession,
    revokeAllUserSessions,
    revokeRefreshSession
} from './refreshSessionService.js'

const PASSWORD_RESET_EXPIRATION_MINUTES = 15
const PASSWORD_RESET_MAX_ATTEMPTS = 5
const PASSWORD_RESET_RESEND_COOLDOWN_MS = 60 * 1000

const allowedRoles = [
    USER_ROLES.BUYER,
    USER_ROLES.SELLER
]

const registerUser = async(userData) => {
    const firstName = userData.firstName
    const lastName = userData.lastName
    const email = userData.email
    const password = userData.password
    const role = userData.role
    const phoneNumber = userData.phoneNumber

    if(!allowedRoles.includes(role))
        throw new AppError(
            'Invalid registration role.',
            400,
            'INVALID_REGISTRATION_ROLE'
        )

    const transformedEmail =
        email.trim().toLowerCase()

    const existing = await User.findOne({
        email: transformedEmail
    })

    if(existing)
        throw new AppError(
            'User already registered.',
            409,
            'EMAIL_ALREADY_IN_USE'
        )

    const passwordHash =
        await bcrypt.hash(password, 12)

    const user = await User.create({
        firstName,
        lastName,
        email: transformedEmail,
        passwordHash,
        role,
        phoneNumber
    })

    if(role === USER_ROLES.SELLER) {
        const businessName =
            userData.businessName

        const description =
            userData.description

        try {
            await Seller.create({
                user: user._id,
                businessName,
                description
            })
        } catch(error) {
            await User.findByIdAndDelete(user._id)
            throw error
        }
    }

    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt
    }
}

const getUserByCredentials = async(credentials) => {
    const transformedEmail =
        credentials.email.trim().toLowerCase()

    const user = await User.findOne({
        email: transformedEmail
    }).select('+passwordHash')

    if(!user)
        throw new AppError(
            'Invalid email or password.',
            401,
            'INVALID_CREDENTIALS'
        )

    const passwordMatch =
        await bcrypt.compare(
            credentials.password,
            user.passwordHash
        )

    if(!passwordMatch)
        throw new AppError(
            'Invalid email or password.',
            401,
            'INVALID_CREDENTIALS'
        )

    return user
}

const createUserSession = async(user) => {
    const validUser = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
    }

    const accessToken =
        generateAccessToken(user)

    const refreshToken =
        await createRefreshSession(user._id)

    return {
        user: validUser,
        accessToken,
        refreshToken
    }
}

const loginUser = async(credentials) => {
    const user =
        await getUserByCredentials(credentials)

    if(!allowedRoles.includes(user.role))
        throw new AppError(
            'Administrators must use the admin login page.',
            403,
            'ADMIN_LOGIN_REQUIRED'
        )

    if(user.status === USER_STATUS.SUSPENDED) {
        const message = user.suspensionReason
            ? `Account suspended. Reason: ${user.suspensionReason}`
            : 'Account suspended.'

        throw new AppError(
            message,
            403,
            'ACCOUNT_SUSPENDED'
        )
    }

    if(user.status === USER_STATUS.BANNED) {
        const message = user.banReason
            ? `Account banned. Reason: ${user.banReason}`
            : 'Account banned.'

        throw new AppError(
            message,
            403,
            'ACCOUNT_BANNED'
        )
    }

    if(user.status === USER_STATUS.DEACTIVATED)
        throw new AppError(
            'Account deactivated.',
            403,
            'ACCOUNT_DEACTIVATED'
        )

    return createUserSession(user)
}

const reactivateUser = async(credentials) => {
    const user =
        await getUserByCredentials(credentials)

    if(!allowedRoles.includes(user.role))
        throw new AppError(
            'Administrators cannot reactivate through this endpoint.',
            403,
            'ACCOUNT_REACTIVATION_NOT_ALLOWED'
        )

    if(user.status !== USER_STATUS.DEACTIVATED)
        throw new AppError(
            'Only deactivated accounts can be reactivated.',
            409,
            'ACCOUNT_REACTIVATION_NOT_ALLOWED'
        )

    user.status = USER_STATUS.ACTIVE

    await user.save()

    return createUserSession(user)
}

const requestPasswordReset = async(email) => {
    const transformedEmail =
        email.trim().toLowerCase()

    const user = await User.findOne({
        email: transformedEmail
    }).select(
        '+passwordResetLastSentAt'
    )

    if(!user)
        return

    if(
        user.passwordResetLastSentAt &&
        Date.now() - user.passwordResetLastSentAt.getTime() <
        PASSWORD_RESET_RESEND_COOLDOWN_MS
    )
        return

    const code =
        randomInt(
            100000,
            1000000
        ).toString()

    const codeHash =
        await bcrypt.hash(
            code,
            12
        )

    const expiresAt =
        new Date(
            Date.now() +
            PASSWORD_RESET_EXPIRATION_MINUTES *
            60 *
            1000
        )

    user.passwordResetCodeHash =
        codeHash

    user.passwordResetCodeExpiresAt =
        expiresAt

    user.passwordResetAttempts =
        0

    user.passwordResetLastSentAt =
        new Date()

    await user.save()

    try {
        await sendPasswordResetCode(
            user.email,
            code
        )
    } catch(error) {
        user.passwordResetCodeHash =
            null

        user.passwordResetCodeExpiresAt =
            null

        user.passwordResetAttempts =
            0

        user.passwordResetLastSentAt =
            null

        await user.save()

        throw error
    }
}

const resetUserPassword = async(resetData) => {
    const transformedEmail =
        resetData.email.trim().toLowerCase()

    const user = await User.findOne({
        email: transformedEmail
    }).select(
        '+passwordHash +passwordResetCodeHash +passwordResetCodeExpiresAt +passwordResetAttempts'
    )

    if(
        !user ||
        !user.passwordResetCodeHash ||
        !user.passwordResetCodeExpiresAt
    )
        throw new AppError(
            'Invalid or expired password reset code.',
            400,
            'INVALID_PASSWORD_RESET_CODE'
        )

    if(
        user.passwordResetCodeExpiresAt <=
        new Date()
    ) {
        user.passwordResetCodeHash =
            null

        user.passwordResetCodeExpiresAt =
            null

        user.passwordResetAttempts =
            0

        await user.save()

        throw new AppError(
            'Password reset code has expired.',
            400,
            'PASSWORD_RESET_CODE_EXPIRED'
        )
    }

    if(
        user.passwordResetAttempts >=
        PASSWORD_RESET_MAX_ATTEMPTS
    )
        throw new AppError(
            'Too many invalid password reset attempts.',
            429,
            'PASSWORD_RESET_ATTEMPTS_EXCEEDED'
        )

    const codeMatches =
        await bcrypt.compare(
            resetData.code,
            user.passwordResetCodeHash
        )

    if(!codeMatches) {
        user.passwordResetAttempts +=
            1

        await user.save()

        throw new AppError(
            'Invalid password reset code.',
            400,
            'INVALID_PASSWORD_RESET_CODE'
        )
    }

    const samePassword =
        await bcrypt.compare(
            resetData.password,
            user.passwordHash
        )

    if(samePassword)
        throw new AppError(
            'New password must be different from the current password.',
            400,
            'PASSWORD_UNCHANGED'
        )

    user.passwordHash =
        await bcrypt.hash(
            resetData.password,
            12
        )

    user.passwordResetCodeHash =
        null

    user.passwordResetCodeExpiresAt =
        null

    user.passwordResetAttempts =
        0

    user.passwordResetLastSentAt =
        null

    await user.save()

    await revokeAllUserSessions(
        user._id
    )
}

const refreshUserSession = async(refreshToken) => {
    if(!refreshToken)
        throw new AppError(
            'Refresh token is required.',
            401,
            'REFRESH_TOKEN_REQUIRED'
        )

    const result =
        await rotateRefreshSession(refreshToken)

    const user = result.user

    const validUser = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
    }

    const accessToken =
        generateAccessToken(user)

    return {
        user: validUser,
        accessToken,
        refreshToken: result.refreshToken
    }
}

const logoutUser = async(refreshToken) => {
    await revokeRefreshSession(refreshToken)
}

export {
    registerUser,
    loginUser,
    reactivateUser,
    requestPasswordReset,
    resetUserPassword,
    refreshUserSession,
    logoutUser
}