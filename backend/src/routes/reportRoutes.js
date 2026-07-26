import express from "express"
import { createReportListing, getAdminReportListings, getPendingReportListings, approveReportListing, rejectReportListing } from "../controllers/reportController.js"
import { authenticate } from "../middleware/authenticate.js"
import { authorize } from "../middleware/authorize.js"
import { validateBody } from "../middleware/validateBody.js"
import { USER_ROLES } from "../constants/user.js"
import { createReportSchema, approveReportSchema, rejectReportSchema } from "../validators/reportValidator.js"
import { validateObjectId } from "../middleware/validateObjectId.js"
import { validateQuery } from "../middleware/validateQuery.js"
import { reportQuerySchema } from "../validators/queryValidator.js"

const router = express.Router()

router.post(
    "/",
    authenticate,
    authorize(USER_ROLES.BUYER, USER_ROLES.SELLER),
    validateBody(createReportSchema),
    createReportListing
)

router.get(
    "/admin",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateQuery(reportQuerySchema),
    getAdminReportListings
)

router.get(
    "/admin/pending",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    getPendingReportListings
)

router.patch(
    "/admin/:reportId/approve",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateObjectId("reportId"),
    validateBody(approveReportSchema),
    approveReportListing
)

router.patch(
    "/admin/:reportId/reject",
    authenticate,
    authorize(USER_ROLES.ADMIN),
    validateObjectId("reportId"),
    validateBody(rejectReportSchema),
    rejectReportListing
)

export default router