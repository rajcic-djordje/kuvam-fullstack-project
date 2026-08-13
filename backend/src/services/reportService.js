import AppError from "../errors/appError.js"
import Report from "../models/report.js"
import Order from "../models/order.js"
import Seller from "../models/seller.js"
import { ORDER_STATUS } from "../constants/order.js"
import { USER_ROLES } from "../constants/user.js"
import User from "../models/user.js"
import { REPORT_STATUS, AUTO_BAN_OFFENCE_THRESHOLD } from "../constants/report.js"
import { USER_STATUS } from "../constants/user.js"
import {revokeAllUserSessions} from "./refreshSessionService.js"


const escapeRegExp = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}


const createReport = async (userId, userRole, reportData) => {
    const orderId = reportData.orderId
    const reason = reportData.reason
    const description = reportData.description

    let reportedUserId

    const order = await Order.findById(orderId)

    if (!order)
        throw new AppError("Order not found.", 404,"ORDER_NOT_FOUND")

    if (order.status !== ORDER_STATUS.COMPLETED)
        throw new AppError("Only completed orders can be reported.",409,"ORDER_CANNOT_BE_REPORTED")

    if (userRole === USER_ROLES.BUYER) {
        if (!order.buyer.equals(userId))
            throw new AppError("Order not found.", 404,"ORDER_NOT_FOUND" )

        const seller = await Seller.findById(order.seller)

        if (!seller)
            throw new AppError("Seller profile not found.", 404, "SELLER_PROFILE_NOT_FOUND")

        reportedUserId = seller.user
    }

    if (userRole === USER_ROLES.SELLER) {
        const seller = await Seller.findOne({ user: userId })

        if (!seller)
            throw new AppError( "Seller profile not found.",404,"SELLER_PROFILE_NOT_FOUND")

        if (!order.seller.equals(seller._id))
            throw new AppError("Order not found.",404,"ORDER_NOT_FOUND")

        reportedUserId = order.buyer
    }

    const existingReport = await Report.findOne({reporter: userId,order: order._id})

    if (existingReport)
        throw new AppError("You have already reported this order.",409,"ORDER_ALREADY_REPORTED")

    const report = await Report.create({
        reporter: userId,
        reportedUser: reportedUserId,
        order: order._id,
        reason,
        description
    })

    await User.findByIdAndUpdate(reportedUserId,{ $inc: { reportsCount: 1 } })

    return report
}


const getPendingReports = async () => {
    const reports = await Report.find({ status: REPORT_STATUS.PENDING }).sort({ createdAt: 1 }).populate({path: "reporter",select: "firstName lastName email role"}).populate({path: "reportedUser",select: "firstName lastName email role reportsCount offences status"}).populate({path: "order",select: "quantity unitPrice totalPrice status createdAt"})

    return reports
}


const approveReport = async (adminId, reportId, adminNote) => {
    const report = await Report.findById(reportId)

    if (!report)
        throw new AppError("Report not found.",404,"REPORT_NOT_FOUND")

    if (report.status !== REPORT_STATUS.PENDING)
        throw new AppError("Only pending reports can be reviewed.",409,"REPORT_ALREADY_REVIEWED" )

    const reportedUser = await User.findById(report.reportedUser)

    if (!reportedUser)
        throw new AppError("Reported user not found.",404,"REPORTED_USER_NOT_FOUND")

    reportedUser.offences += 1
    reportedUser.offencesSinceLastBan += 1

    if (
        reportedUser.offencesSinceLastBan >=
        AUTO_BAN_OFFENCE_THRESHOLD
    ) {
        reportedUser.status = USER_STATUS.BANNED
        reportedUser.banReason =
            `Account automatically banned after ${AUTO_BAN_OFFENCE_THRESHOLD} new confirmed offences.`
        reportedUser.suspensionReason = null
        reportedUser.suspendedAt = null
    }

    await reportedUser.save()

    if(reportedUser.status === USER_STATUS.BANNED)
        await revokeAllUserSessions(reportedUser._id)

    report.status = REPORT_STATUS.APPROVED
    report.reviewedBy = adminId
    report.adminNote = adminNote || null
    report.reviewedAt = new Date()

    await report.save()

    return {
        report,
        reportedUser: {
            id: reportedUser._id,
            offences: reportedUser.offences,
            offencesSinceLastBan: reportedUser.offencesSinceLastBan,
            status: reportedUser.status,
            banReason: reportedUser.banReason
        }
    }
}


const rejectReport = async (adminId, reportId, adminNote) => {
    const report = await Report.findById(reportId)

    if (!report)
        throw new AppError("Report not found.",404,"REPORT_NOT_FOUND")

    if (report.status !== REPORT_STATUS.PENDING)
        throw new AppError("Only pending reports can be reviewed.",409,"REPORT_ALREADY_REVIEWED")

    report.status = REPORT_STATUS.REJECTED
    report.reviewedBy = adminId
    report.adminNote = adminNote
    report.reviewedAt = new Date()

    await report.save()

    return report
}


const getAdminReports = async (query) => {
    const search = query.search
    const status = query.status
    const sort = query.sort ?? "newest"

    const filter = {}

    if (status)
        filter.status = status

    if (search) {
        const searchRegex = new RegExp(
            escapeRegExp(search),
            "i"
        )

        const matchingUsers = await User.find({
            $or: [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex }
            ]
        })
            .select("_id")
            .lean()

        const matchingUserIds = matchingUsers.map(
            user => user._id
        )

        filter.$or = [
            { reporter: { $in: matchingUserIds } },
            { reportedUser: { $in: matchingUserIds } },
            { reason: searchRegex },
            { description: searchRegex }
        ]
    }

    const sortOption =
        sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 }

    return Report.find(filter)
        .sort(sortOption)
        .populate({
            path: "reporter",
            select: "firstName lastName email role"
        })
        .populate({
            path: "reportedUser",
            select:
                "firstName lastName email role reportsCount offences status"
        })
        .populate({
            path: "order",
            select:
                "quantity unitPrice totalPrice status createdAt"
        })
        .populate({
            path: "reviewedBy",
            select: "firstName lastName email"
        })
        .lean()
}


export {getAdminReports, createReport, getPendingReports, approveReport, rejectReport}