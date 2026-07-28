import User from "../models/user.js"
import AppError from "../errors/appError.js"
import {USER_STATUS} from "../constants/user.js"
import {verifyAccessToken} from "../utils/jwt.js"

const authenticate = async(req, res, next) => {
    const header = req.headers.authorization

    if(!header)
        return next(new AppError("Authentication required.", 401, "AUTHENTICATION_REQUIRED"))

    const parts = header.split(" ")
    const schema = parts[0]
    const token = parts[1]

    if(schema !== "Bearer" || !token)
        return next(new AppError("Invalid authorization format.", 401, "INVALID_AUTHORIZATION_FORMAT"))

    try {
        const decoded = verifyAccessToken(token)
        const user = await User.findById(decoded.userId)

        if(!user)
            return next(new AppError("User not found.", 401, "INVALID_ACCESS_TOKEN"))

        if(user.status === USER_STATUS.SUSPENDED)
            return next(new AppError("Account suspended.", 403, "ACCOUNT_SUSPENDED"))

        if(user.status === USER_STATUS.BANNED)
            return next(new AppError("Account banned.", 403, "ACCOUNT_BANNED"))

        if(user.status === USER_STATUS.DEACTIVATED)
            return next(new AppError("Account deactivated.", 403, "ACCOUNT_DEACTIVATED"))

        req.auth = {
            userId: user._id,
            role: user.role
        }

        return next()
    }
    catch(error) {
        if(error instanceof AppError)
            return next(error)

        return next(new AppError("Invalid or expired access token.", 401, "INVALID_ACCESS_TOKEN"))
    }
}

export {authenticate}