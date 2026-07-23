const REPORT_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
}

const REPORT_REASONS = {
    NO_SHOW: "no_show",
    INAPPROPRIATE_BEHAVIOR: "inappropriate_behavior",
    MISLEADING_INFORMATION: "misleading_information",
    FOOD_QUALITY_OR_SAFETY: "food_quality_or_safety",
    PAYMENT_ISSUE: "payment_issue",
    OTHER: "other"
}

const AUTO_BAN_OFFENCE_THRESHOLD = 3

export {
    REPORT_STATUS,
    REPORT_REASONS,
    AUTO_BAN_OFFENCE_THRESHOLD
}