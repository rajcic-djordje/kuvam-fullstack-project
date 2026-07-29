import User from "../models/user.js"
import Seller from "../models/seller.js"
import Offer from "../models/offer.js"
import Order from "../models/order.js"
import Report from "../models/report.js"
import { USER_ROLES, USER_STATUS } from "../constants/user.js"
import { SELLER_APPROVAL_STATUS } from "../constants/seller.js"
import { ORDER_STATUS } from "../constants/order.js"
import { REPORT_STATUS } from "../constants/report.js"

const getAdminDashboard = async () => {
    const [
        totalUsers,
        buyers,
        sellers,
        activeUsers,
        suspendedUsers,
        bannedUsers,
        deactivatedUsers,
        approvedSellers,
        pendingSellers,
        activeOffers,
        activeOrders,
        pendingReports,
        recentPendingSellers,
        recentPendingReports,
        latestUser,
        latestOffer,
        latestOrder,
        latestApprovedSeller,
        latestReviewedReport
    ] = await Promise.all([
        User.countDocuments({
            role: { $ne: USER_ROLES.ADMIN }
        }),

        User.countDocuments({
            role: USER_ROLES.BUYER
        }),

        User.countDocuments({
            role: USER_ROLES.SELLER
        }),

        User.countDocuments({
            role: { $ne: USER_ROLES.ADMIN },
            status: USER_STATUS.ACTIVE
        }),

        User.countDocuments({
            role: { $ne: USER_ROLES.ADMIN },
            status: USER_STATUS.SUSPENDED
        }),

        User.countDocuments({
            role: { $ne: USER_ROLES.ADMIN },
            status: USER_STATUS.BANNED
        }),

        User.countDocuments({
            role: { $ne: USER_ROLES.ADMIN },
            status: USER_STATUS.DEACTIVATED
        }),

        Seller.countDocuments({
            approvalStatus: SELLER_APPROVAL_STATUS.APPROVED
        }),

        Seller.countDocuments({
            approvalStatus: SELLER_APPROVAL_STATUS.PENDING
        }),

        Offer.countDocuments({
            isActive: true
        }),

        Order.countDocuments({
            status: {
                $in: [
                    ORDER_STATUS.PENDING,
                    ORDER_STATUS.ACCEPTED,
                    ORDER_STATUS.READY
                ]
            }
        }),

        Report.countDocuments({
            status: REPORT_STATUS.PENDING
        }),

        Seller.find({
            approvalStatus: SELLER_APPROVAL_STATUS.PENDING
        })
            .populate({
                path: "user",
                select: "firstName lastName email status"
            })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        Report.find({
            status: REPORT_STATUS.PENDING
        })
            .populate({
                path: "reporter",
                select: "firstName lastName email role"
            })
            .populate({
                path: "reportedUser",
                select: "firstName lastName email role reportsCount offences status"
            })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        User.findOne({
            role: { $ne: USER_ROLES.ADMIN }
        })
            .sort({ createdAt: -1 })
            .select("firstName lastName createdAt")
            .lean(),

        Offer.findOne()
            .sort({ createdAt: -1 })
            .select("name createdAt")
            .lean(),

        Order.findOne()
            .sort({ createdAt: -1 })
            .select("offer createdAt")
            .populate({
                path: "offer",
                select: "name"
            })
            .lean(),

        Seller.findOne({
            approvalStatus: SELLER_APPROVAL_STATUS.APPROVED
        })
            .sort({ updatedAt: -1 })
            .select("businessName updatedAt")
            .lean(),

        Report.findOne({
            status: {
                $in: [
                    REPORT_STATUS.APPROVED,
                    REPORT_STATUS.REJECTED
                ]
            },
            reviewedAt: { $ne: null }
        })
            .sort({ reviewedAt: -1 })
            .select("status reviewedAt")
            .lean()
    ])

    const recentActivity = []

    if (latestUser) {
        recentActivity.push({
            type: "user_registered",
            title: "Novi korisnik",
            description: `${latestUser.firstName} ${latestUser.lastName} se registrovao/la.`,
            createdAt: latestUser.createdAt
        })
    }

    if (latestOffer) {
        recentActivity.push({
            type: "offer_created",
            title: "Nova ponuda",
            description: `Objavljena je ponuda „${latestOffer.name}“.`,
            createdAt: latestOffer.createdAt
        })
    }

    if (latestOrder) {
        recentActivity.push({
            type: "order_created",
            title: "Nova porudžbina",
            description: latestOrder.offer
                ? `Kreirana je porudžbina za ponudu „${latestOrder.offer.name}“.`
                : "Kreirana je nova porudžbina.",
            createdAt: latestOrder.createdAt
        })
    }

    if (latestApprovedSeller) {
        recentActivity.push({
            type: "seller_approved",
            title: "Prodavac odobren",
            description: `Prodavac „${latestApprovedSeller.businessName}“ je odobren.`,
            createdAt: latestApprovedSeller.updatedAt
        })
    }

    if (latestReviewedReport) {
        const reportResult =
            latestReviewedReport.status === REPORT_STATUS.APPROVED
                ? "odobrena"
                : "odbijena"

        recentActivity.push({
            type: "report_reviewed",
            title: "Prijava obrađena",
            description: `Korisnička prijava je ${reportResult}.`,
            createdAt: latestReviewedReport.reviewedAt
        })
    }

    recentActivity.sort(
        (firstActivity, secondActivity) =>
            new Date(secondActivity.createdAt).getTime() -
            new Date(firstActivity.createdAt).getTime()
    )

    return {
        statistics: {
            totalUsers,
            buyers,
            sellers,
            activeUsers,
            suspendedUsers,
            bannedUsers,
            deactivatedUsers,
            approvedSellers,
            pendingSellers,
            activeOffers,
            activeOrders,
            pendingReports
        },
        recentPendingSellers,
        recentPendingReports,
        recentActivity
    }
}

export { getAdminDashboard }