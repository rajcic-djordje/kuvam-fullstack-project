import { loginUser, registerUser } from "../services/authService.js"


const register = async (req, res) => {
    const user = await registerUser(req.body)

    return res.status(201).json({
        message: "User registered successfully.",
        user
    })
}


const login = async (req,res)=>{
    const result = await loginUser(req.body)

    return res.status(201).json({
        message: "User logged in successfully.",
        user: result.user,
        accessToken: result.accessToken
    })
}

export { register, login }