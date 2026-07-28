const nodeEnv = process.env.NODE_ENV
const nodePort = Number(process.env.PORT)
const nodeClientOrigin = process.env.CLIENT_ORIGIN?.trim()
const nodeMongoDBUri = process.env.MONGODB_URI?.trim()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET?.trim()
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN?.trim()
const refreshSessionExpiresInDays = Number(process.env.REFRESH_SESSION_EXPIRES_IN_DAYS)

const allowedValues = ["development", "test", "production"]

if(!allowedValues.includes(nodeEnv))
    throw new Error("Mode not allowed!")

if(!Number.isInteger(nodePort) || nodePort < 1 || nodePort > 65535)
    throw new Error("Port is not valid.")

if(!nodeClientOrigin)
    throw new Error("Client origin is not valid.")

if(!nodeMongoDBUri)
    throw new Error("MongoDB connection uri not valid.")

if(!accessTokenSecret || accessTokenSecret.length < 64)
    throw new Error("Access token secret is not valid.")

if(!accessTokenExpiresIn)
    throw new Error("Access token expiration is not valid.")

if(!Number.isInteger(refreshSessionExpiresInDays) || refreshSessionExpiresInDays < 1)
    throw new Error("Refresh session expiration is not valid.")

const env = {
    nodeEnv,
    nodePort,
    nodeClientOrigin,
    nodeMongoDBUri,
    accessTokenSecret,
    accessTokenExpiresIn,
    refreshSessionExpiresInDays
}

export default env