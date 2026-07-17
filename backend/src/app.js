import express from "express"
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();

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