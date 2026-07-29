import { getUsers, suspendUser, unsuspendUser, getSuspendedUsers} from "../services/adminUserService.js"



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
    const search =
        typeof req.query.search === "string"
            ? req.query.search.trim()
            : ""

    const sort =
        req.query.sort === "oldest"
            ? "oldest"
            : "newest"

    const users = await getUsers(search, sort)

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


export {suspendUserAccount, unsuspendUserAccount, getUserAccounts, getSuspendedUserAccounts}