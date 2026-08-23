package tests.status.constants;

public class StatusTestConstants {

    public static final int STATUS_OK = 200;
    public static final int STATUS_CREATED = 201;
    public static final int STATUS_FORBIDDEN = 403;


    public static final String pendingSellerCannotCreateOfferTest_NAME =
            "Test pending offer";

    public static final String pendingSellerCannotCreateOfferTest_DESCRIPTION =
            "Valid offer created by pending seller.";

    public static final String pendingSellerCannotCreateOfferTest_CATEGORY =
            "cooked_meals";

    public static final double pendingSellerCannotCreateOfferTest_PRICE =
            500.0;

    public static final int pendingSellerCannotCreateOfferTest_AVAILABLE_QUANTITY =
            10;

    public static final String pendingSellerCannotCreateOfferTest_UNIT =
            "portion";

    public static final String pendingSellerCannotCreateOfferTest_ERROR_CODE =
            "SELLER_NOT_APPROVED";

    public static final String pendingSellerCannotCreateOfferTest_ERROR_MESSAGE =
            "Seller account is not approved.";


    public static final String rejectedSellerCannotCreateOfferTest_NAME =
            "Rejected seller offer";

    public static final String rejectedSellerCannotCreateOfferTest_DESCRIPTION =
            "Valid offer created by rejected seller.";

    public static final String rejectedSellerCannotCreateOfferTest_CATEGORY =
            "cooked_meals";

    public static final double rejectedSellerCannotCreateOfferTest_PRICE =
            500.0;

    public static final int rejectedSellerCannotCreateOfferTest_AVAILABLE_QUANTITY =
            10;

    public static final String rejectedSellerCannotCreateOfferTest_UNIT =
            "portion";

    public static final String rejectedSellerCannotCreateOfferTest_ERROR_CODE =
            "SELLER_NOT_APPROVED";

    public static final String rejectedSellerCannotCreateOfferTest_ERROR_MESSAGE =
            "Seller account is not approved.";


    public static final String approvedSellerCanCreateOfferTest_NAME =
            "Approved seller offer";

    public static final String approvedSellerCanCreateOfferTest_DESCRIPTION =
            "Valid offer created by approved seller.";

    public static final String approvedSellerCanCreateOfferTest_CATEGORY =
            "cooked_meals";

    public static final double approvedSellerCanCreateOfferTest_PRICE =
            500.0;

    public static final int approvedSellerCanCreateOfferTest_AVAILABLE_QUANTITY =
            10;

    public static final String approvedSellerCanCreateOfferTest_UNIT =
            "portion";

    public static final String approvedSellerCanCreateOfferTest_MESSAGE =
            "Offer created successfully.";


    public static final String suspendedUserCannotAccessProtectedEndpointTest_REASON =
            "Temporary suspension for testing.";

    public static final String suspendedUserCannotAccessProtectedEndpointTest_ERROR_CODE =
            "ACCOUNT_SUSPENDED";

    public static final String suspendedUserCannotAccessProtectedEndpointTest_ERROR_MESSAGE =
            "Account suspended.";


    public static final String previouslySuspendedUserCanAccessProtectedEndpointAfterUnsuspensionTest_REASON =
            "Temporary suspension for testing.";

    public static final String previouslySuspendedUserCanAccessProtectedEndpointAfterUnsuspensionTest_ERROR_CODE =
            "ACCOUNT_SUSPENDED";

    public static final String previouslySuspendedUserCanAccessProtectedEndpointAfterUnsuspensionTest_MESSAGE_REGEX =
            "^Account suspended\\. Reason: \\S.{3,}$";

    public static final String suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_NAME =
            "Offer from seller that will be suspended";

    public static final String suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_DESCRIPTION =
            "Offer created for suspended seller public availability test.";

    public static final String suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_PRICE =
            500.0;

    public static final int suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_AVAILABLE_QUANTITY =
            10;

    public static final String suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_UNIT =
            "portion";

    public static final String suspendedSellerOffersAreNotPubliclyAvailableTest_SUSPENSION_REASON =
            "Suspended for public availability test.";

    public static final String suspendedSellerOffersAreNotPubliclyAvailableTest_SELLERS_MESSAGE =
            "Sellers retrieved successfully.";


    public static final String adminSuccessfullyApprovesPendingSellerTest_EMAIL =
            "status.approve.pending@test.com";

    public static final String adminSuccessfullyApprovesPendingSellerTest_FIRST_NAME =
            "Pending";

    public static final String adminSuccessfullyApprovesPendingSellerTest_LAST_NAME =
            "Seller";

    public static final String adminSuccessfullyApprovesPendingSellerTest_PASSWORD =
            "Test1234";

    public static final String adminSuccessfullyApprovesPendingSellerTest_ROLE =
            "seller";

    public static final String adminSuccessfullyApprovesPendingSellerTest_BUSINESS_NAME =
            "Pending Approval Test Seller";

    public static final String adminSuccessfullyApprovesPendingSellerTest_DESCRIPTION =
            "Seller created for admin approval test.";

    public static final String adminSuccessfullyApprovesPendingSellerTest_MESSAGE =
            "Seller application approved successfully.";

    public static final String adminSuccessfullyApprovesPendingSellerTest_APPROVED_STATUS =
            "approved";


    public static final String adminCannotProcessAlreadyProcessedSellerApplicationTest_REASON =
            "Application should not be processed again.";

    public static final String adminCannotProcessAlreadyProcessedSellerApplicationTest_ERROR_CODE =
            "SELLER_APPLICATION_ALREADY_PROCESSED";

    public static final String adminCannotProcessAlreadyProcessedSellerApplicationTest_ERROR_MESSAGE =
            "Seller application already processed.";
    public static final int STATUS_CONFLICT = 409;


}