import {createServer} from "node:http"
import env from "./src/config/env.js"
import app from "./src/app.js"
import {
    connectToDatabase,
    disconnectFromDatabase
} from "./src/config/mongodb.js"
import {
    initializeSocket,
    closeSocket
} from "./src/config/socket.js"

let server = null
let isShuttingDown = false

const startServer = async() => {
    try {
        await connectToDatabase()

        server = createServer(app)

        initializeSocket(server)

        server.listen(env.nodePort, () => {
            console.log(
                `Kuvam backend starting on ${env.nodeEnv} mode on port ${env.nodePort}.`
            )
        })
    }
    catch(error) {
        console.log("Server has not started.")
        console.log(error)
        process.exitCode = 1
    }
}

const shutdown = signal => {
    if(isShuttingDown)
        return

    isShuttingDown = true

    console.log(`${signal} received.`)

    closeSocket()

    if(!server) {
        process.exitCode = 1
        return
    }

    server.close(async() => {
        try {
            console.log("HTTP server is closed.")

            await disconnectFromDatabase()

            process.exitCode = 0
        }
        catch(error) {
            console.error("Error during shutdown.")
            console.error(error)

            process.exitCode = 1
        }
    })
}

startServer()

process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))