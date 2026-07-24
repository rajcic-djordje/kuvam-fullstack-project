import express from "express"
import {getMyProfile,updateMyProfile,changeMyPassword, deactivateMyAccount} from "../controllers/userController.js"
import { authenticate } from "../middleware/authenticate.js"
import { validateBody } from "../middleware/validateBody.js"
import {updateProfileSchema,changePasswordSchema} from "../validators/userValidator.js"

const router = express.Router()

router.get(
    "/me",
    authenticate,
    getMyProfile
)

router.patch(
    "/me",
    authenticate,
    validateBody(updateProfileSchema),
    updateMyProfile
)

router.patch(
    "/me/password",
    authenticate,
    validateBody(changePasswordSchema),
    changeMyPassword
)

router.patch(
    "/me/deactivate",
    authenticate,
    deactivateMyAccount
)

export default router