import { loginAdmin } from "../services/adminAuthService.js"


const login = async(req, res) => {
    const result = await loginAdmin(req.body)

    return res.status(200).json({
        message: "Admin logged in successfully.",
        user: result.user,
        accessToken: result.accessToken
    })
}


export {login}