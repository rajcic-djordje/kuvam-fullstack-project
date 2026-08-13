import AppError from "../errors/appError.js"
import Notification from "../models/notification.js"
import {emitNotification} from "../config/socket.js"

const createNotification = async({
    recipient,
    type,
    title,
    message,
    order
}) => {
    const notification = await Notification.create({
        recipient,
        type,
        title,
        message,
        order
    })

    emitNotification(notification.toObject())

    return notification
}

const getUserNotifications = async(userId, query) => {
    const limit = Math.min(Number(query.limit) || 30, 100)

    return Notification.find({
        recipient: userId
    })
        .sort({
            createdAt: -1
        })
        .limit(limit)
}

const getUnreadNotificationsCount = async userId => {
    return Notification.countDocuments({
        recipient: userId,
        isRead: false
    })
}

const markNotificationAsRead = async(userId, notificationId) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: userId
        },
        {
            $set: {
                isRead: true
            }
        },
        {
            new: true
        }
    )

    if(!notification)
        throw new AppError(
            "Notification not found.",
            404,
            "NOTIFICATION_NOT_FOUND"
        )

    return notification
}

const markAllNotificationsAsRead = async userId => {
    await Notification.updateMany(
        {
            recipient: userId,
            isRead: false
        },
        {
            $set: {
                isRead: true
            }
        }
    )
}

export {
    createNotification,
    getUserNotifications,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
}