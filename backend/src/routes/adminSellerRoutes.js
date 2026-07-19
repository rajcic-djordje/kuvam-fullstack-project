import express from "express"
import { getPendingSellerApplications } from "../controllers/adminSellerController.js"
import { authenticate } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
import { USER_ROLES } from "../constants/user.js"
import { approveSellerApplication } from "../controllers/adminSellerController.js"
import { rejectSellerApplication } from "../controllers/adminSellerController.js"
import { validateBody } from "../middleware/validateBody.js"
import { rejectSellerSchema } from "../validators/adminSellerValidator.js"

const router = express.Router()

router.get(
    "/sellers/pending",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    getPendingSellerApplications
)

router.patch(
    "/sellers/:sellerId/approve",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    approveSellerApplication
)

router.patch(
    "/sellers/:sellerId/reject",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateBody(rejectSellerSchema),
    rejectSellerApplication
)
export default router