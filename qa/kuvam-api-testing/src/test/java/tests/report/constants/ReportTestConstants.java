package tests.report.constants;

public class ReportTestConstants {

    public static final int STATUS_OK = 200;
    public static final int STATUS_CREATED = 201;
    public static final int STATUS_FORBIDDEN = 403;
    public static final int STATUS_NOT_FOUND = 404;
    public static final int STATUS_CONFLICT = 409;

    public static final String REPORT_REASON = "other";
    public static final int ORDER_QUANTITY = 1;
    public static final String ORDER_NOTE = "";

    public static final double OFFER_PRICE = 500.0;
    public static final int OFFER_AVAILABLE_QUANTITY = 20;
    public static final String OFFER_UNIT = "portion";
    public static final String OFFER_CATEGORY = "cooked_meals";

    public static final String buyerAndSellerCanReportCompletedOrderTest_OFFER_NAME =
            "Offer for valid report test";

    public static final String buyerAndSellerCanReportCompletedOrderTest_DESCRIPTION =
            "Valid report submitted for completed order.";

    public static final String buyerAndSellerCanReportCompletedOrderTest_MESSAGE =
            "Report submitted successfully.";

    public static final String buyerAndSellerCanReportCompletedOrderTest_PENDING_STATUS =
            "pending";


    public static final String invalidOrderCannotBeReportedTest_PENDING_OFFER_NAME =
            "Offer for pending order report test";

    public static final String invalidOrderCannotBeReportedTest_OTHER_BUYER_OFFER_NAME =
            "Offer for other buyer report test";

    public static final String invalidOrderCannotBeReportedTest_OTHER_SELLER_OFFER_NAME =
            "Offer for other seller report test";

    public static final String invalidOrderCannotBeReportedTest_DESCRIPTION =
            "Invalid relationship report should be rejected.";

    public static final String invalidOrderCannotBeReportedTest_NOT_COMPLETED_CODE =
            "ORDER_CANNOT_BE_REPORTED";

    public static final String invalidOrderCannotBeReportedTest_NOT_COMPLETED_MESSAGE =
            "Only completed orders can be reported.";

    public static final String invalidOrderCannotBeReportedTest_NOT_FOUND_CODE =
            "ORDER_NOT_FOUND";

    public static final String invalidOrderCannotBeReportedTest_NOT_FOUND_MESSAGE =
            "Order not found.";

    public static final String invalidOrderCannotBeReportedTest_NON_EXISTING_ORDER_ID =
            "000000000000000000000001";


    public static final String duplicateReportIsRejectedTest_OFFER_NAME =
            "Offer for duplicate report test";

    public static final String duplicateReportIsRejectedTest_DESCRIPTION =
            "Duplicate report attempt for completed order.";

    public static final String duplicateReportIsRejectedTest_ERROR_CODE =
            "ORDER_ALREADY_REPORTED";

    public static final String duplicateReportIsRejectedTest_ERROR_MESSAGE =
            "You have already reported this order.";


    public static final String adminCanListApproveAndRejectReportsTest_FIRST_OFFER_NAME =
            "Offer for report approval test";

    public static final String adminCanListApproveAndRejectReportsTest_SECOND_OFFER_NAME =
            "Offer for report rejection test";

    public static final String adminCanListApproveAndRejectReportsTest_DESCRIPTION =
            "Pending report created for admin processing.";

    public static final String adminCanListApproveAndRejectReportsTest_APPROVE_NOTE =
            "Report confirmed by administrator.";

    public static final String adminCanListApproveAndRejectReportsTest_REJECT_NOTE =
            "Report rejected by administrator.";

    public static final String adminCanListApproveAndRejectReportsTest_LIST_MESSAGE =
            "Reports retrieved successfully.";

    public static final String adminCanListApproveAndRejectReportsTest_PENDING_MESSAGE =
            "Pending reports retrieved successfully.";

    public static final String adminCanListApproveAndRejectReportsTest_APPROVE_MESSAGE =
            "Report approved successfully.";

    public static final String adminCanListApproveAndRejectReportsTest_REJECT_MESSAGE =
            "Report rejected successfully.";

    public static final String adminCanListApproveAndRejectReportsTest_APPROVED_STATUS =
            "approved";

    public static final String adminCanListApproveAndRejectReportsTest_REJECTED_STATUS =
            "rejected";


    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_EMAIL =
            "report.autoban.buyer@test.com";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_FIRST_NAME =
            "Auto";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_LAST_NAME =
            "Ban";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_PASSWORD =
            "Test1234";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_ROLE =
            "buyer";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_FIRST_OFFER =
            "Autoban report offer one";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_SECOND_OFFER =
            "Autoban report offer two";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_THIRD_OFFER =
            "Autoban report offer three";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_DESCRIPTION =
            "Confirmed report used for automatic ban test.";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_ADMIN_NOTE =
            "Confirmed offence.";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_BANNED_STATUS =
            "banned";

    public static final String userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_BAN_REASON =
            "Account automatically banned after 3 new confirmed offences.";
}