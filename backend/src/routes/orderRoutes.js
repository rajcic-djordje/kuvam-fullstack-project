import express from "express"
import { createOrderListing, markReceivedOrderAsReady, completeMyOrder, getReceivedOrderById, acceptReceivedOrder, rejectReceivedOrder, getReceivedOrders, getMyOrders, getMyOrderById, cancelMyOrder} from "../controllers/orderController.js"
import { authenticate } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
import { validateBody } from "../middleware/validateBody.js"
import { USER_ROLES } from "../constants/user.js"
import { createOrderSchema, rejectOrderSchema } from "../validators/orderValidator.js"

const router = express.Router()

router.post(
    "/",
    authenticate,
    authorize(USER_ROLES.BUYER),
    validateBody(createOrderSchema),
    createOrderListing
)

router.get(
    "/mine",
    authenticate,
    authorize(USER_ROLES.BUYER),
    getMyOrders
)

router.get(
    "/mine/:orderId",
    authenticate,
    authorize(USER_ROLES.BUYER),
    getMyOrderById
)

router.patch(
    "/mine/:orderId/cancel",
    authenticate,
    authorize(USER_ROLES.BUYER),
    cancelMyOrder
)

router.get(
    "/received",
    authenticate,
    authorize(USER_ROLES.SELLER),
    getReceivedOrders
)


router.get(
    "/received/:orderId",
    authenticate,
    authorize(USER_ROLES.SELLER),
    getReceivedOrderById
)

router.patch(
    "/received/:orderId/accept",
    authenticate,
    authorize(USER_ROLES.SELLER),
    acceptReceivedOrder
)

router.patch(
    "/received/:orderId/reject",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateBody(rejectOrderSchema),
    rejectReceivedOrder
)

router.patch(
    "/received/:orderId/ready",
    authenticate,
    authorize(USER_ROLES.SELLER),
    markReceivedOrderAsReady
)

router.patch(
    "/mine/:orderId/complete",
    authenticate,
    authorize(USER_ROLES.BUYER),
    completeMyOrder
)

export default router