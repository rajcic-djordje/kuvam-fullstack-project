import {getAdminDashboard} from "../services/adminDashboardService.js"

const getDashboard = async (req, res) => {
    const dashboard = await getAdminDashboard()

    return res.status(200).json({
        message: "Admin dashboard data retrieved successfully.",
        dashboard
    })
}

export {getDashboard}