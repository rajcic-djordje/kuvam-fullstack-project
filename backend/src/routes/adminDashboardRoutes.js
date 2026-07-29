import express from "express"
import {getDashboard} from "../controllers/adminDashboardController.js"
import {authenticate} from "../middleware/authenticate.js"
import {authorize} from "../middleware/authorize.js"
import {USER_ROLES} from "../constants/user.js"

const router = express.Router()

router.get(
    "/dashboard",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    getDashboard
)

export default router