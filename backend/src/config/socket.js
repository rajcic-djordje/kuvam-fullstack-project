import {Server} from "socket.io"
import env from "./env.js"
import User from "../models/user.js"
import {USER_STATUS} from "../constants/user.js"
import {verifyAccessToken} from "../utils/jwt.js"

let io = null

const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: env.nodeClientOrigin,
            credentials: true
        }
    })

    io.use(async(socket, next) => {
        const token = socket.handshake.auth?.token

        if(!token)
            return next(new Error("AUTHENTICATION_REQUIRED"))

        try {
            const decoded = verifyAccessToken(token)
            const user = await User.findById(decoded.userId)

            if(!user)
                return next(new Error("INVALID_ACCESS_TOKEN"))

            if(user.status === USER_STATUS.SUSPENDED)
                return next(new Error("ACCOUNT_SUSPENDED"))

            if(user.status === USER_STATUS.BANNED)
                return next(new Error("ACCOUNT_BANNED"))

            if(user.status === USER_STATUS.DEACTIVATED)
                return next(new Error("ACCOUNT_DEACTIVATED"))

            socket.data.userId = String(user._id)
            socket.data.role = user.role

            return next()
        }
        catch {
            return next(new Error("INVALID_ACCESS_TOKEN"))
        }
    })

    io.on("connection", socket => {
        socket.join(`user:${socket.data.userId}`)
    })

    return io
}

const emitNotification = notification => {
    if(!io)
        return

    io.to(`user:${String(notification.recipient)}`).emit(
        "notification:new",
        notification
    )
}

const closeSocket = () => {
    if(!io)
        return

    io.close()
    io = null
}

export {
    initializeSocket,
    emitNotification,
    closeSocket
}