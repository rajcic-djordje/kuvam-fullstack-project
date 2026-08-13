import express from "express"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "node:path"
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
import adminAuthRoutes from "./routes/adminAuthRoutes.js"
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js"
import cityRoutes from "./routes/cityRoutes.js"
import sellerRoutes from "./routes/sellerRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"

const app = express()

app.use(helmet())

app.use(cors({
    origin: env.nodeClientOrigin,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use(
    "/uploads",
    helmet.crossOriginResourcePolicy({policy: "cross-origin"}),
    express.static(path.resolve("uploads"))
)

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
app.use("/api/v1/sellers", sellerRoutes)
app.use("/api/v1/admin/auth", adminAuthRoutes)
app.use("/api/v1/admin", adminDashboardRoutes)
app.use("/api/v1/cities", cityRoutes)
app.use("/api/v1/notifications", notificationRoutes)

app.use((req, res) => {
    return res.status(404).json({
        error: {
            message: "Route does not exist."
        }
    })
})

app.use(errorHandler)

export default app