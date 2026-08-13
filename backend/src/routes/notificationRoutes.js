import express from "express"
import {authenticate} from "../middleware/authenticate.js"
import {validateObjectId} from "../middleware/validateObjectId.js"
import {
    getMyNotifications,
    getMyUnreadCount,
    readMyNotification,
    readAllMyNotifications
} from "../controllers/notificationController.js"

const router = express.Router()

router.get(
    "/",
    authenticate,
    getMyNotifications
)

router.get(
    "/unread-count",
    authenticate,
    getMyUnreadCount
)

router.patch(
    "/read-all",
    authenticate,
    readAllMyNotifications
)

router.patch(
    "/:notificationId/read",
    authenticate,
    validateObjectId("notificationId"),
    readMyNotification
)

export default router