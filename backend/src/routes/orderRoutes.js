import express from "express"
import {
    createOrderListing,
    getMyOrders,
    getMyOrderById,
    cancelMyOrder,
    markMyOrderAsOnTheWay,
    getReceivedOrders,
    getReceivedOrderById,
    acceptReceivedOrder,
    rejectReceivedOrder,
    markReceivedOrderAsReady,
    completeReceivedOrder
} from "../controllers/orderController.js"
import {authenticate} from "../middleware/authenticate.js"
import {authorize} from "../middleware/authorize.js"
import {validateBody} from "../middleware/validateBody.js"
import {validateObjectId} from "../middleware/validateObjectId.js"
import {validateQuery} from "../middleware/validateQuery.js"
import {USER_ROLES} from "../constants/user.js"
import {
    createOrderSchema,
    acceptOrderSchema,
    rejectOrderSchema,
    verifyPickupCodeSchema
} from "../validators/orderValidator.js"
import {orderQuerySchema} from "../validators/queryValidator.js"

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
    validateQuery(orderQuerySchema),
    getMyOrders
)

router.get(
    "/mine/:orderId",
    authenticate,
    authorize(USER_ROLES.BUYER),
    validateObjectId("orderId"),
    getMyOrderById
)

router.patch(
    "/mine/:orderId/cancel",
    authenticate,
    authorize(USER_ROLES.BUYER),
    validateObjectId("orderId"),
    cancelMyOrder
)

router.patch(
    "/mine/:orderId/on-the-way",
    authenticate,
    authorize(USER_ROLES.BUYER),
    validateObjectId("orderId"),
    markMyOrderAsOnTheWay
)

router.get(
    "/received",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateQuery(orderQuerySchema),
    getReceivedOrders
)

router.get(
    "/received/:orderId",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("orderId"),
    getReceivedOrderById
)

router.patch(
    "/received/:orderId/accept",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("orderId"),
    validateBody(acceptOrderSchema),
    acceptReceivedOrder
)

router.patch(
    "/received/:orderId/reject",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("orderId"),
    validateBody(rejectOrderSchema),
    rejectReceivedOrder
)

router.patch(
    "/received/:orderId/ready",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("orderId"),
    markReceivedOrderAsReady
)

router.patch(
    "/received/:orderId/complete",
    authenticate,
    authorize(USER_ROLES.SELLER),
    validateObjectId("orderId"),
    validateBody(verifyPickupCodeSchema),
    completeReceivedOrder
)

export default router