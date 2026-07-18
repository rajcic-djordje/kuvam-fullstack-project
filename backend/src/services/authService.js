import bcrypt from 'bcrypt'
import User from '../models/user.js'
import { USER_ROLES } from '../constants/user.js'
import AppError from '../errors/appError.js'
import Seller from '../models/seller.js'

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

export {registerUser}