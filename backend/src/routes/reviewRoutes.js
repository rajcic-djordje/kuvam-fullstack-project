import express from "express"
import { createReviewListing, getReviewsBySeller } from "../controllers/reviewController.js"
import { authenticate } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
import { validateBody } from "../middleware/validateBody.js"
import { USER_ROLES } from "../constants/user.js"
import { createReviewSchema } from "../validators/reviewValidator.js"
import { validateObjectId } from "../middleware/validateObjectId.js"
const router = express.Router()

router.post(
    "/",
    authenticate,
    authorize(USER_ROLES.BUYER),
    validateBody(createReviewSchema),
    createReviewListing
)

router.get(
    "/seller/:sellerId",
    validateObjectId("sellerId"),
    getReviewsBySeller
)

export default router