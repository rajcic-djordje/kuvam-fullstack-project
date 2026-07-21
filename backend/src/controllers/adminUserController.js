import { suspendUser, unsuspendUser } from "../services/adminUserService.js"



const suspendUserAccount = async(req,res) =>{


    const userId = req.params.userId
    const reason = req.body.reason

    const user = await suspendUser(userId, reason)

    return res.status(200).json({
        message: "User suspended successfully.",
        user
    })
}


const unsuspendUserAccount = async(req,res) => {
    const userId = req.params.userId

    const user = await unsuspendUser(userId)

    return res.status(200).json({
        message: "User unsuspended successfully.",
        user
    })
}


export {suspendUserAccount, unsuspendUserAccount}