import express from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import env from "./config/env.js"
import {errorHandler} from "./middleware/errorHandler.js"
import authRoutes from "./routes/authRoutes.js"
import adminSellerRoutes from "./routes/adminSellerRoutes.js"
import adminUserRoutes from "./routes/adminUserRoutes.js"
import offerRoutes from "./routes/offerRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()

app.use(helmet())
app.use(cors({
    origin: env.nodeClientOrigin,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get("/api/v1/health", (req, res) => {
    return res.status(200).json({
        status: "ok",
        message: "Kuvam API is running"
    })
})

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/admin", adminSellerRoutes)
app.use("/api/v1/admin", adminUserRoutes)
app.use("/api/v1/offers", offerRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/reports", reportRoutes)
app.use("/api/v1/users", userRoutes)

app.use((req, res) => {
    return res.status(404).json({
        error: {
            message: "Route does not exist."
        }
    })
})

app.use(errorHandler)

export default app