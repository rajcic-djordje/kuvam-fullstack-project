import env from "./src/config/env.js"

import app from "./src/app.js"

import { connectToDatabase, disconnectFromDatabase } from "./src/config/mongodb.js"

let server

const startServer = async () => {


    try{
        await connectToDatabase()
        server = app.listen(env.nodePort, ()=>{
    console.log(`Kuvam backend starting on ${env.nodeEnv} mode on port ${env.nodePort}.`)
    })
    }
    catch(error)
    {
        console.log("Server has not started.")
        console.log(error)
        process.exitCode = 1
    }
    

}

const shutdown = (signal) => {
    
    console.log(`${signal} received.`)

    if(!server)
    {
        process.exitCode = 1
        return
    }

    server.close(async() =>{
        try{
            console.log("Http server is closed.")

            await disconnectFromDatabase()
            process.exitCode = 0
        }
        catch(error)
        {
            console.error("Error during shutdown.")
            console.error(error)

            process.exitCode = 1
        }
    })
        

    
}


startServer()
process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)




