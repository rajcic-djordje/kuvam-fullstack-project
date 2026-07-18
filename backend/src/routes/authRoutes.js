import express from "express"
import { register } from "../controllers/authController.js"
import { validateBody } from "../middleware/validateBody.js"
import { registerSchema } from "../validators/authValidator.js"

const router = express.Router()

router.post(
    "/register",
    validateBody(registerSchema),
    register
)

export default router