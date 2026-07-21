import express from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { USER_ROLES } from '../constants/user.js'
import { validateBody } from '../middleware/validateBody.js'
import { suspendUserSchema } from '../validators/adminUserValidator.js'
import {suspendUserAccount, unsuspendUserAccount} from '../controllers/adminUserController.js'
const router = express.Router()


router.patch(
    "/users/:userId/suspend",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateBody(suspendUserSchema),
    suspendUserAccount
)

router.patch(
    "/users/:userId/unsuspend",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    unsuspendUserAccount
)

export default router