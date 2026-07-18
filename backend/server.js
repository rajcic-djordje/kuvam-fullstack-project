import env from "./src/config/env.js"

import app from "./src/app.js"

import { connectToDatabase } from "./src/config/mongodb.js"

const startServer = async () => {


    try{
        await connectToDatabase()
        app.listen(env.nodePort, ()=>{
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


startServer()




