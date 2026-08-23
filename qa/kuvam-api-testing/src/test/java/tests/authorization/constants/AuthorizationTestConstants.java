package tests.authorization.constants;

public class AuthorizationTestConstants {

    public static final int STATUS_OK = 200;
    public static final int STATUS_CREATED = 201;
    public static final int STATUS_FORBIDDEN = 403;
    public static final int STATUS_NOT_FOUND = 404;

    public static final String FORBIDDEN_CODE = "FORBIDDEN";
    public static final String FORBIDDEN_MESSAGE =
            "You do not have permission to perform this action.";

    public static final String ORDER_NOT_FOUND_CODE = "ORDER_NOT_FOUND";
    public static final String ORDER_NOT_FOUND_MESSAGE = "Order not found.";

    public static final String ORDER_CREATED_MESSAGE =
            "Order created successfully.";

    public static final int ORDER_ITEM_QUANTITY = 1;
    public static final String EMPTY_BUYER_NOTE = "";

    public static final String buyerCannotCreateSellerOfferTest_NAME =
            "Test offer";
    public static final String buyerCannotCreateSellerOfferTest_DESCRIPTION =
            "Valid test offer description.";
    public static final String buyerCannotCreateSellerOfferTest_CATEGORY =
            "cooked_meals";
    public static final double buyerCannotCreateSellerOfferTest_PRICE =
            500.0;
    public static final int buyerCannotCreateSellerOfferTest_AVAILABLE_QUANTITY =
            10;
    public static final String buyerCannotCreateSellerOfferTest_UNIT =
            "portion";

    public static final String sellerCannotModifyAnotherSellersOfferTest_NAME =
            "Updated test offer";
    public static final String sellerCannotModifyAnotherSellersOfferTest_ERROR_CODE =
            "OFFER_ACCESS_DENIED";
    public static final String sellerCannotModifyAnotherSellersOfferTest_ERROR_MESSAGE =
            "You cannot modify another seller's offer.";

    public static final String authenticatedUserProfileUpdateIsSelfScopedTest_NAME =
            "Updated name";
    public static final String authenticatedUserProfileUpdateIsSelfScopedTest_MESSAGE =
            "User profile updated successfully.";

    public static final String buyerCanAccessOwnOrdersTest_MESSAGE =
            "Buyer orders retrieved successfully.";

    public static final String sellerCanAccessOwnOffersTest_MESSAGE =
            "Seller offers retrieved successfully.";

    public static final String sellerCanAccessOwnReceivedOrdersTest_MESSAGE =
            "Seller orders retrieved successfully.";
}