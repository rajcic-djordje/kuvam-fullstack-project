const nodeEnv = process.env.NODE_ENV
const nodePort = Number(process.env.PORT)
const nodeClientOrigin = process.env.CLIENT_ORIGIN?.trim()

const allowedValues = ["development", "test", "production"]

if (!allowedValues.includes(nodeEnv))
    throw new Error("Mode not allowed!")

if (!Number.isInteger(nodePort) || nodePort < 1 || nodePort > 65535)
    throw new Error("Port is not valid.")

if (!nodeClientOrigin)
    throw new Error("Client origin is not valid.")

const env = {
    nodeEnv,
    nodePort,
    nodeClientOrigin
}

export default env