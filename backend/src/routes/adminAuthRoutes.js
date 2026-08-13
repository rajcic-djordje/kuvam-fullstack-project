import express from "express"
import {login} from "../controllers/adminAuthController.js"
import {validateBody} from "../middleware/validateBody.js"
import {loginSchema} from "../validators/authValidator.js"

const router = express.Router()

router.post(
    "/login",
     validateBody(loginSchema),
      login
    )

export default router