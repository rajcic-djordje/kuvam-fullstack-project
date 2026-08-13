import bcrypt from "bcrypt"
import User from "../models/user.js"
import Seller from "../models/seller.js"
import AppError from "../errors/appError.js"
import { USER_ROLES, USER_STATUS } from "../constants/user.js"
import {revokeAllUserSessions} from "./refreshSessionService.js"
import City from "../models/city.js"
import { geocodeAddress } from "./geocodingService.js"


const getCurrentUserProfile = async (userId) => {
    const user = await User.findById(userId)
        .populate("city", "name slug")

    if (!user)
        throw new AppError(
            "User not found.",
            404,
            "USER_NOT_FOUND"
        )

    const result = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        reportsCount: user.reportsCount,
        offences: user.offences,
        createdAt: user.createdAt,
        city: user.city
            ? {
                id: user.city._id,
                name: user.city.name,
                slug: user.city.slug
            }
            : null,
        address: {
            street: user.address?.street ?? null,
            streetNumber:
                user.address?.streetNumber ?? null,
            additionalInfo:
                user.address?.additionalInfo ?? null,

                latitude: user.address?.latitude ?? null,
longitude: user.address?.longitude ?? null
        },
        hasLocation: Boolean(
    user.city &&
    user.address?.street &&
    user.address?.streetNumber &&
    user.address?.latitude !== null &&
    user.address?.latitude !== undefined &&
    user.address?.longitude !== null &&
    user.address?.longitude !== undefined
)
    }

    if (user.role === USER_ROLES.SELLER) {
        const seller = await Seller.findOne({
            user: user._id
        }).populate("city", "name slug")

        result.sellerProfile = seller
            ? {
                id: seller._id,
                businessName:
                    seller.businessName,
                slug: seller.slug,
                description:
                    seller.description,
                profileImageUrl:
                    seller.profileImageUrl,
                coverImageUrl:
                    seller.coverImageUrl,
                isOpen:
                    seller.isOpen,
                city: seller.city
                    ? {
                        id: seller.city._id,
                        name: seller.city.name,
                        slug: seller.city.slug
                    }
                    : null,
                pickupAddress: {
                    street:
                        seller.pickupAddress?.street ??
                        null,
                    streetNumber:
                        seller.pickupAddress
                            ?.streetNumber ?? null,
                    additionalInfo:
                        seller.pickupAddress
                            ?.additionalInfo ?? null,
                    latitude:
                        seller.pickupAddress?.latitude ??
                        null,
                    longitude:
                        seller.pickupAddress?.longitude ??
                        null
                },
                approvalStatus:
                    seller.approvalStatus,
                rejectionReason:
                    seller.rejectionReason,
                isProfileComplete: Boolean(
                    seller.businessName &&
                    seller.description &&
                    seller.city &&
                    seller.pickupAddress?.street &&
                    seller.pickupAddress
                        ?.streetNumber &&
                    seller.pickupAddress
                        ?.latitude !== null &&
                    seller.pickupAddress
                        ?.latitude !== undefined &&
                    seller.pickupAddress
                        ?.longitude !== null &&
                    seller.pickupAddress
                        ?.longitude !== undefined
                ),
                createdAt:
                    seller.createdAt,
                updatedAt:
                    seller.updatedAt
            }
            : null
    }

    return result
}

const updateCurrentUserProfile = async (
    userId,
    updateData
) => {
    const user = await User.findById(userId)

    if (!user)
        throw new AppError(
            "User not found.",
            404,
            "USER_NOT_FOUND"
        )

    if (updateData.firstName !== undefined)
        user.firstName = updateData.firstName

    if (updateData.lastName !== undefined)
        user.lastName = updateData.lastName

    await user.save()

    return getCurrentUserProfile(user._id)
}

const changeCurrentUserPassword = async (
    userId,
    currentPassword,
    newPassword
) => {
    const user = await User.findById(userId)
        .select("+passwordHash")

    if (!user)
        throw new AppError(
            "User not found.",
            404,
            "USER_NOT_FOUND"
        )

    const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.passwordHash
    )

    if (!passwordMatch)
        throw new AppError(
            "Current password is incorrect.",
            401,
            "INVALID_CURRENT_PASSWORD"
        )

    user.passwordHash =
        await bcrypt.hash(newPassword, 12)

    await user.save()

    await revokeAllUserSessions(user._id)

    return true
}

const deactivateCurrentUser = async (userId) => {
    const user = await User.findById(userId)

    if (!user)
        throw new AppError(
            "User not found.",
            404,
            "USER_NOT_FOUND"
        )

    if (user.status === USER_STATUS.DEACTIVATED)
        throw new AppError(
            "Account is already deactivated.",
            409,
            "ACCOUNT_ALREADY_DEACTIVATED"
        )

    if (user.status === USER_STATUS.BANNED)
        throw new AppError(
            "Banned accounts cannot be deactivated through this endpoint.",
            409,
            "BANNED_ACCOUNT_CANNOT_BE_DEACTIVATED"
        )

    user.status = USER_STATUS.DEACTIVATED
    user.suspensionReason = null
    user.suspendedAt = null

    await user.save()

    await revokeAllUserSessions(user._id)

    return {
        id: user._id,
        status: user.status
    }
}

const updateCurrentUserLocation = async (
    userId,
    locationData
) => {
    const user = await User.findById(userId)

    if (!user)
        throw new AppError(
            "User not found.",
            404,
            "USER_NOT_FOUND"
        )

    if (user.role !== USER_ROLES.BUYER)
        throw new AppError(
            "Location can only be updated through this endpoint by buyers.",
            403,
            "BUYER_LOCATION_UPDATE_ONLY"
        )

    const city = await City.findOne({
        _id: locationData.cityId,
        isActive: true
    })

    if (!city)
        throw new AppError(
            "City not found or inactive.",
            404,
            "CITY_NOT_FOUND"
        )

    const coordinates = await geocodeAddress(
        city.name,
        locationData.street,
        locationData.streetNumber
    )

    user.city = city._id

    user.address = {
        street: locationData.street,
        streetNumber: locationData.streetNumber,
        additionalInfo:
            locationData.additionalInfo || null,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
    }

    await user.save()

    return getCurrentUserProfile(user._id)
}

export {
    getCurrentUserProfile,
    updateCurrentUserProfile,
    changeCurrentUserPassword,
    deactivateCurrentUser,
    updateCurrentUserLocation
}