import { getUsers, suspendUser, unsuspendUser, getSuspendedUsers, banUser, unbanUser} from "../services/adminUserService.js"



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

const getUserAccounts = async(req, res) => {
    const search = req.queryData.search ?? ""
    const role = req.queryData.role
    const status = req.queryData.status
    const sort = req.queryData.sort ?? "newest"

    const users = await getUsers(
        search,
        role,
        status,
        sort
    )

    return res.status(200).json({
        users
    })
}

const getSuspendedUserAccounts = async(req, res) => {
    const search = req.queryData.search ?? ""
    const sort = req.queryData.sort ?? "newest"

    const users = await getSuspendedUsers(search, sort)

    return res.status(200).json({
        users
    })
}

const banUserAccount = async(req, res) => {
    const userId = req.params.userId
    const reason = req.body.reason

    const user = await banUser(userId, reason)

    return res.status(200).json({
        message: "User banned successfully.",
        user
    })
}

const unbanUserAccount = async(req, res) => {
    const userId = req.params.userId

    const user = await unbanUser(userId)

    return res.status(200).json({
        message: "User unbanned successfully.",
        user
    })
}


export {banUserAccount, unbanUserAccount, suspendUserAccount, unsuspendUserAccount, getUserAccounts, getSuspendedUserAccounts}