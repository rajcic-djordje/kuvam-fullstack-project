import express from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { USER_ROLES } from '../constants/user.js'
import { validateBody } from '../middleware/validateBody.js'
import { suspendUserSchema } from '../validators/adminUserValidator.js'
import {suspendUserAccount, unsuspendUserAccount} from '../controllers/adminUserController.js'
import { validateObjectId } from "../middleware/validateObjectId.js"

const router = express.Router()


router.patch(
    "/users/:userId/suspend",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateObjectId("userId"),
    validateBody(suspendUserSchema),
    suspendUserAccount
)

router.patch(
    "/users/:userId/unsuspend",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateObjectId("userId"),
    unsuspendUserAccount
)

export default router