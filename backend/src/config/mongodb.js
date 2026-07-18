import env from "./env.js";
import mongoose from "mongoose";

const connectToDatabase = async() => {

    await mongoose.connect(env.nodeMongoDBUri)

    console.log("Conected to MongoDB.")
}

export {connectToDatabase}