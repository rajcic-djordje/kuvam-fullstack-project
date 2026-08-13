import express from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorize } from '../middleware/authorize.js'
import { USER_ROLES } from '../constants/user.js'
import { validateBody } from '../middleware/validateBody.js'
import { suspendUserSchema, banUserSchema } from '../validators/adminUserValidator.js'
import {banUserAccount, unbanUserAccount, suspendUserAccount, unsuspendUserAccount, getUserAccounts, getSuspendedUserAccounts} from '../controllers/adminUserController.js'
import { validateObjectId } from "../middleware/validateObjectId.js"
import { suspendedUsersQuerySchema, adminUsersQuerySchema } from '../validators/queryValidator.js'
import { validateQuery } from "../middleware/validateQuery.js"
const router = express.Router()

router.get(
    "/users",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateQuery(adminUsersQuerySchema),
    getUserAccounts
)


router.get(
    "/users/suspended",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateQuery(suspendedUsersQuerySchema),
    getSuspendedUserAccounts
)


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


router.patch(
    "/users/:userId/ban",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateObjectId("userId"),
    validateBody(banUserSchema),
    banUserAccount
)

router.patch(
    "/users/:userId/unban",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateObjectId("userId"),
    unbanUserAccount
)

export default router