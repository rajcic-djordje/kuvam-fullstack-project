import env from "../config/env.js"
import {loginAdmin} from "../services/adminAuthService.js"

const refreshCookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "strict",
    maxAge: env.refreshSessionExpiresInDays * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth"
}

const login = async(req, res) => {
    const result = await loginAdmin(req.body)

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions)

    return res.status(200).json({
        message: "Admin logged in successfully.",
        user: result.user,
        accessToken: result.accessToken
    })
}

export {login}