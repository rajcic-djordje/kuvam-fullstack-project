import express from "express"
import { register, login } from "../controllers/authController.js"
import { validateBody } from "../middleware/validateBody.js"
import { loginSchema, registerSchema } from "../validators/authValidator.js"
import { authenticate } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
import { USER_ROLES } from "../constants/user.js"
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


export default router