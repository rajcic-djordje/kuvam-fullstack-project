import { registerUser } from "../services/authService.js"


const register = async (req, res) => {
    const user = await registerUser(req.body)

    return res.status(201).json({
        message: "User registered successfully.",
        user
    })
}

export { register }