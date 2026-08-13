import jsonwebtoken from "jsonwebtoken"
import env from "../config/env.js"

const generateAccessToken = (user) => {
    const payload = {
        userId: user._id,
        role: user.role
    }

    return jsonwebtoken.sign(payload, env.accessTokenSecret, {expiresIn: env.accessTokenExpiresIn})
}

const verifyAccessToken = (token) => {
    return jsonwebtoken.verify(token, env.accessTokenSecret)
}

export {generateAccessToken, verifyAccessToken}