import env from "./env.js";
import mongoose from "mongoose";

const connectToDatabase = async() => {

    await mongoose.connect(env.nodeMongoDBUri)

    console.log("Connected to MongoDB.")
}


const disconnectFromDatabase = async() => {
    await mongoose.disconnect(env.nodeMongoDBUri)

    console.log("Disconnected from MongoDb.")
}

export {connectToDatabase, disconnectFromDatabase}