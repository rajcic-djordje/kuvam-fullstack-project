import {
    getUserNotifications,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
} from "../services/notificationService.js"

const getMyNotifications = async (
    req,
    res
) => {
    const notifications =
        await getUserNotifications(
            req.auth.userId,
            req.query
        )

    return res.status(200).json({
        message:
            "Notifications retrieved successfully.",
        notifications
    })
}

const getMyUnreadCount = async (
    req,
    res
) => {
    const unreadCount =
        await getUnreadNotificationsCount(
            req.auth.userId
        )

    return res.status(200).json({
        message:
            "Unread notification count retrieved successfully.",
        unreadCount
    })
}

const readMyNotification = async (
    req,
    res
) => {
    const notification =
        await markNotificationAsRead(
            req.auth.userId,
            req.params.notificationId
        )

    return res.status(200).json({
        message:
            "Notification marked as read.",
        notification
    })
}

const readAllMyNotifications = async (
    req,
    res
) => {
    await markAllNotificationsAsRead(
        req.auth.userId
    )

    return res.status(200).json({
        message:
            "All notifications marked as read."
    })
}

export {
    getMyNotifications,
    getMyUnreadCount,
    readMyNotification,
    readAllMyNotifications
}