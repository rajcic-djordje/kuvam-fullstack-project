import express from "express"
import helmet from "helmet"
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors"
import env from "./config/env.js";
const app = express();

app.use(helmet())
app.use(cors({
    origin: env.nodeClientOrigin
}))
app.use(express.json())


app.get("/api/v1/health", (req,res) => {

    return res.status(200).json({
        "status": "ok",
        "message": "Kuvam API is running"
    })
})


app.use((req,res)=>{

    return res.status(404).json({
        error: {
            message: "Route does not exist."
        }
    })
})

app.use(errorHandler)


export default app;