import env from "../config/env.js"
import {
    loginUser,
    registerUser,
    reactivateUser,
    requestPasswordReset,
    resetUserPassword,
    refreshUserSession,
    logoutUser
} from "../services/authService.js"

const refreshCookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: env.refreshSessionExpiresInDays * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth"
}

const register = async(req, res) => {
    const user = await registerUser(req.body)

    return res.status(201).json({
        message: "User registered successfully.",
        user
    })
}

const login = async(req, res) => {
    const result = await loginUser(req.body)

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions)

    return res.status(200).json({
        message: "User logged in successfully.",
        user: result.user,
        accessToken: result.accessToken
    })
}

const reactivate = async(req, res) => {
    const result = await reactivateUser(req.body)

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions)

    return res.status(200).json({
        message: "Account reactivated successfully.",
        user: result.user,
        accessToken: result.accessToken
    })
}

const forgotPassword = async(req, res) => {
    await requestPasswordReset(
        req.body.email
    )

    return res.status(200).json({
        message: "If an account with that email exists, a password reset code has been sent."
    })
}

const resetPassword = async(req, res) => {
    await resetUserPassword(
        req.body
    )

    return res.status(200).json({
        message: "Password reset successfully."
    })
}

const refresh = async(req, res) => {
    const result = await refreshUserSession(req.cookies.refreshToken)

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions)

    return res.status(200).json({
        message: "Session refreshed successfully.",
        user: result.user,
        accessToken: result.accessToken
    })
}

const logout = async(req, res) => {
    await logoutUser(req.cookies.refreshToken)

    res.clearCookie("refreshToken", refreshCookieOptions)

    return res.status(200).json({
        message: "User logged out successfully."
    })
}

export {
    register,
    login,
    reactivate,
    forgotPassword,
    resetPassword,
    refresh,
    logout
}