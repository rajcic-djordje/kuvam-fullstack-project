import bcrypt from 'bcrypt'
import User from '../models/user.js'
import { USER_ROLES, USER_STATUS } from '../constants/user.js'
import AppError from '../errors/appError.js'
import Seller from '../models/seller.js'
import { generateAccessToken } from '../utils/jwt.js'

const allowedRoles = [USER_ROLES.BUYER, USER_ROLES.SELLER]

    


const registerUser = async(userData) => {

    const firstName = userData.firstName
    const lastName = userData.lastName
    const email = userData.email
    const password = userData.password
    const role = userData.role

    if(!allowedRoles.includes(role))
        throw new AppError("Invalid registration role.",
    400,
    "INVALID_REGISTRATION_ROLE")

    const transformedEmail = email.trim().toLowerCase()

    const existing = await User.findOne({email: transformedEmail})

    if(existing)
        throw new AppError("User already registered.", 409, "EMAIL_ALREADY_IN_USE")

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await User.create({
    firstName,
    lastName,
    email: transformedEmail,
    passwordHash,
    role
})


    if (role === USER_ROLES.SELLER){
    const businessName = userData.businessName
    const description = userData.description


    try{
        await Seller.create({
            user: user._id,
            businessName,
            description
        })
    }
    catch(error)
    {
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
        createdAt: user.createdAt
    }
}


const loginUser = async (credentials) => {

    const email = credentials.email
    const password = credentials.password

    const transformedEmail = email.trim().toLowerCase()

    const user = await User.findOne({email: transformedEmail}).select("+passwordHash")

    if(!user)
        throw new AppError("Invalid email or password", 401,"INVALID_CREDENTIALS")

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if(!passwordMatch)
        throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS")

    if(user.status==USER_STATUS.SUSPENDED){
        const message = user.suspensionReason? `Account suspended. Reason: ${user.suspensionReason}`: "Account suspended."
        throw new AppError(message, 403, "ACCOUNT_SUSPENDED")
    }

    else if(user.status==USER_STATUS.BANNED){
        const message = user.banReason? `Account banned. Reason: ${user.banReason}`: "Account banned."
        throw new AppError(message, 403, "ACCOUNT_BANNED")
    }
    else if(user.status==USER_STATUS.DEACTIVATED)
        throw new AppError("Account deactivated.", 403, "ACCOUNT_DEACTIVATED")

    const validUser = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status

    }

    const accessToken = generateAccessToken(user)

    return {
        user: validUser,
        accessToken
    }
}

    


export {registerUser, loginUser}