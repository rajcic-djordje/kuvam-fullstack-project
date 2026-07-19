import jsonwebtoken from 'jsonwebtoken'

const generateAccessToken = (user) =>{

    const payload = {
        userId: user._id,
        role: user.role,
    }
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

const verifyAccessToken = (token) =>{

    return jsonwebtoken.verify(token, process.env.JWT_SECRET)

}

export {generateAccessToken, verifyAccessToken}