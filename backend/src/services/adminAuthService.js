import bcrypt from "bcrypt"
import User from "../models/user.js"
import {USER_ROLES, USER_STATUS} from "../constants/user.js"
import AppError from "../errors/appError.js"
import {generateAccessToken} from "../utils/jwt.js"
import {createRefreshSession} from "./refreshSessionService.js"



const loginAdmin = async(credentials) => {

    const email = credentials.email
    const password = credentials.password


    const transformedEmail = email.trim().toLowerCase()

    const user = await User.findOne({email:transformedEmail}).select("+passwordHash")

    if(!user)
        throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS")

    const passwordMatches = await bcrypt.compare(password,user.passwordHash)

    if(!passwordMatches)
        throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS")

    if(user.role!== USER_ROLES.ADMIN)
        throw new AppError("Admin access required.", 403, "ADMIN_ACCESS_REQUIRED")

    if(user.status===USER_STATUS.SUSPENDED)
        throw new AppError("Account is suspended.", 403, "ACCOUNT_SUSPENDED")
    else if(user.status === USER_STATUS.BANNED)
        throw new AppError("Account is banned.", 403, "ACCOUNT_BANNED")
    else if(user.status === USER_STATUS.DEACTIVATED)
        throw new AppError("Account is deactivated.", 403, "ACCOUNT_DEACTIVATED")


    const validUser= {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = await createRefreshSession(validUser.id)


    return {
        user: validUser,
        accessToken,
        refreshToken
    }
}

export {loginAdmin}