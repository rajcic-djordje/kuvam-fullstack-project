import { createReport, getPendingReports, approveReport, rejectReport } from "../services/reportService.js"

const createReportListing = async (req, res) => {
    const userId = req.auth.userId
    const userRole = req.auth.role

    const report = await createReport(
        userId,
        userRole,
        req.body
    )

    return res.status(201).json({
        message: "Report submitted successfully.",
        report
    })
}


const getPendingReportListings = async (req, res) => {
    const reports = await getPendingReports()

    return res.status(200).json({
        message: "Pending reports retrieved successfully.",
        reports
    })
}

const approveReportListing = async (req, res) => {
    const adminId = req.auth.userId
    const reportId = req.params.reportId
    const adminNote = req.body.adminNote

    const result = await approveReport(
        adminId,
        reportId,
        adminNote
    )

    return res.status(200).json({
        message: "Report approved successfully.",
        report: result.report,
        reportedUser: result.reportedUser
    })
}

const rejectReportListing = async (req, res) => {
    const adminId = req.auth.userId
    const reportId = req.params.reportId
    const adminNote = req.body.adminNote

    const report = await rejectReport(
        adminId,
        reportId,
        adminNote
    )

    return res.status(200).json({
        message: "Report rejected successfully.",
        report
    })
}

export { createReportListing, getPendingReportListings, approveReportListing, rejectReportListing }