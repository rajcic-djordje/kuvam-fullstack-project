import express from "express"
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    refresh,
    logout
} from "../controllers/authController.js"
import { validateBody } from "../middleware/validateBody.js"
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema
} from "../validators/authValidator.js"

const router = express.Router()

router.post(
    "/register",
    validateBody(registerSchema),
    register
)

router.post(
    "/login",
    validateBody(loginSchema),
    login
)

router.post(
    "/forgot-password",
    validateBody(forgotPasswordSchema),
    forgotPassword
)

router.post(
    "/reset-password",
    validateBody(resetPasswordSchema),
    resetPassword
)

router.post(
    "/refresh",
    refresh
)

router.post(
    "/logout",
    logout
)

export default router