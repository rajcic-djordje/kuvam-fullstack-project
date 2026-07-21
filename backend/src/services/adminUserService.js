import User from '../models/user.js'
import { USER_STATUS } from '../constants/user.js'
import AppError from '../errors/appError.js'


const suspendUser = async(userId, reason) => {


    const user = await User.findById(userId)

    if(!user)
        throw new AppError("User not found.", 404, "USER_NOT_FOUND")
    
    if(user.status===USER_STATUS.SUSPENDED)
        throw new AppError("User is already suspended.", 409, "USER_ALREADY_SUSPENDED")
    else if(user.status === USER_STATUS.BANNED)
        throw new AppError("Banned user cant be suspended.", 409, "USER_ALREADY_BANNED")

    user.status = USER_STATUS.SUSPENDED
    user.suspensionReason = reason


    await user.save()

    return user

}


const unsuspendUser = async(userId) => {
    const user = await User.findById(userId)

    if(!user)
        throw new AppError("User not found.", 404, "USER_NOT_FOUND")
    
    if(user.status!==USER_STATUS.SUSPENDED)
        throw new AppError("User is not suspended.", 409, "USER_NOT_SUSPENDED")


    user.status = USER_STATUS.ACTIVE
    user.suspensionReason = null
    
    await user.save()

    return user
}


export {suspendUser, unsuspendUser}