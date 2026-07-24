import {getCurrentUserProfile,updateCurrentUserProfile,changeCurrentUserPassword,deactivateCurrentUser} from "../services/userService.js"

const getMyProfile = async (req, res) => {
    const userId = req.auth.userId

    const user = await getCurrentUserProfile(userId)

    return res.status(200).json({
        message: "User profile retrieved successfully.",
        user
    })
}

const updateMyProfile = async (req, res) => {
    const userId = req.auth.userId

    const user = await updateCurrentUserProfile(
        userId,
        req.body
    )

    return res.status(200).json({
        message: "User profile updated successfully.",
        user
    })
}

const changeMyPassword = async (req, res) => {
    const userId = req.auth.userId
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword

    await changeCurrentUserPassword(userId,currentPassword,newPassword)

    return res.status(200).json({
        message: "Password changed successfully."
    })
}

const deactivateMyAccount = async (req, res) => {
    const userId = req.auth.userId

    const user = await deactivateCurrentUser(userId)

    return res.status(200).json({
        message: "Account deactivated successfully.",
        user
    })
}

export {getMyProfile,updateMyProfile,changeMyPassword,deactivateMyAccount}