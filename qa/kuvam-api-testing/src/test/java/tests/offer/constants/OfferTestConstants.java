package tests.offer.constants;

public class OfferTestConstants {

    public static final int STATUS_OK = 200;
    public static final int STATUS_CREATED = 201;

    public static final String sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_NAME =
            "Offer for delete test";

    public static final String sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_DESCRIPTION =
            "Offer created for delete test.";

    public static final String sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_CATEGORY =
            "cooked_meals";

    public static final double sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_PRICE =
            500.0;

    public static final int sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_AVAILABLE_QUANTITY =
            10;

    public static final String sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_UNIT =
            "portion";

    public static final String sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_CREATE_MESSAGE =
            "Offer created successfully.";

    public static final String sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_DELETE_MESSAGE =
            "Offer deleted successfully.";

    public static final int STATUS_CONFLICT = 409;

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_NAME =
            "Offer with existing order";

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_DESCRIPTION =
            "Offer created for existing order delete test.";

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_CATEGORY =
            "cooked_meals";

    public static final double sellerCannotDeleteOwnOfferWithExistingOrdersTest_PRICE =
            500.0;

    public static final int sellerCannotDeleteOwnOfferWithExistingOrdersTest_AVAILABLE_QUANTITY =
            10;

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_UNIT =
            "portion";

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_CREATE_MESSAGE =
            "Offer created successfully.";



    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_ERROR_CODE =
            "OFFER_HAS_ORDERS";

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_ERROR_MESSAGE =
            "Offer with existing orders cannot be deleted.";


    public static final int sellerCannotDeleteOwnOfferWithExistingOrdersTest_QUANTITY =
            1;

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_BUYER_NOTE =
            "";

    public static final String sellerCannotDeleteOwnOfferWithExistingOrdersTest_ORDER_CREATED_MESSAGE =
            "Order created successfully.";


    public static final String sellerSuccessfullyDeactivatesOwnOfferTest_NAME =
            "Offer for deactivate test";

    public static final String sellerSuccessfullyDeactivatesOwnOfferTest_DESCRIPTION =
            "Offer created for deactivate test.";

    public static final String sellerSuccessfullyDeactivatesOwnOfferTest_CATEGORY =
            "cooked_meals";

    public static final double sellerSuccessfullyDeactivatesOwnOfferTest_PRICE =
            500.0;

    public static final int sellerSuccessfullyDeactivatesOwnOfferTest_AVAILABLE_QUANTITY =
            10;

    public static final String sellerSuccessfullyDeactivatesOwnOfferTest_UNIT =
            "portion";

    public static final String sellerSuccessfullyDeactivatesOwnOfferTest_CREATE_MESSAGE =
            "Offer created successfully.";

    public static final String sellerSuccessfullyDeactivatesOwnOfferTest_DEACTIVATE_MESSAGE =
            "Offer deactivated successfully.";

    public static final boolean sellerSuccessfullyDeactivatesOwnOfferTest_ACTIVE =
            false;


    public static final String sellerSuccessfullyUpdatesOwnOfferTest_NAME =
            "Updated offer name";

    public static final String sellerSuccessfullyUpdatesOwnOfferTest_CREATE_NAME =
            "Offer for update test";

    public static final String sellerSuccessfullyUpdatesOwnOfferTest_DESCRIPTION =
            "Offer created for update test.";

    public static final String sellerSuccessfullyUpdatesOwnOfferTest_CATEGORY =
            "cooked_meals";

    public static final double sellerSuccessfullyUpdatesOwnOfferTest_PRICE =
            500.0;

    public static final int sellerSuccessfullyUpdatesOwnOfferTest_AVAILABLE_QUANTITY =
            10;

    public static final String sellerSuccessfullyUpdatesOwnOfferTest_UNIT =
            "portion";

    public static final String sellerSuccessfullyUpdatesOwnOfferTest_CREATE_MESSAGE =
            "Offer created successfully.";

    public static final String sellerSuccessfullyUpdatesOwnOfferTest_UPDATE_MESSAGE =
            "Offer updated successfully.";


    public static final String sellerCannotCreateOfferWithInvalidPayloadTest_NAME =
            "A";

    public static final String sellerCannotCreateOfferWithInvalidPayloadTest_DESCRIPTION =
            "Invalid offer payload test.";

    public static final String sellerCannotCreateOfferWithInvalidPayloadTest_CATEGORY =
            "cooked_meals";

    public static final double sellerCannotCreateOfferWithInvalidPayloadTest_PRICE =
            500.0;

    public static final int sellerCannotCreateOfferWithInvalidPayloadTest_AVAILABLE_QUANTITY =
            10;

    public static final String sellerCannotCreateOfferWithInvalidPayloadTest_UNIT =
            "portion";

    public static final String sellerCannotCreateOfferWithInvalidPayloadTest_ERROR_CODE =
            "VALIDATION_ERROR";

    public static final String sellerCannotCreateOfferWithInvalidPayloadTest_ERROR_MESSAGE =
            "Invalid request data.";

    public static final int STATUS_BAD_REQUEST = 400;

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_CREATE_NAME =
            "Offer for invalid update";

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_DESCRIPTION =
            "Offer created for invalid update test.";

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_CATEGORY =
            "cooked_meals";

    public static final double sellerCannotUpdateOwnOfferWithInvalidPayloadTest_PRICE =
            500.0;

    public static final int sellerCannotUpdateOwnOfferWithInvalidPayloadTest_AVAILABLE_QUANTITY =
            10;

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_UNIT =
            "portion";

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_INVALID_NAME =
            "A";

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_CREATE_MESSAGE =
            "Offer created successfully.";

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_ERROR_CODE =
            "VALIDATION_ERROR";

    public static final String sellerCannotUpdateOwnOfferWithInvalidPayloadTest_ERROR_MESSAGE =
            "Invalid request data.";


    public static final String sellerSuccessfullyReactivatesOwnInactiveOfferTest_NAME =
            "Offer for reactivate test";

    public static final String sellerSuccessfullyReactivatesOwnInactiveOfferTest_DESCRIPTION =
            "Offer created for reactivate test.";

    public static final String sellerSuccessfullyReactivatesOwnInactiveOfferTest_CATEGORY =
            "cooked_meals";

    public static final double sellerSuccessfullyReactivatesOwnInactiveOfferTest_PRICE =
            500.0;

    public static final int sellerSuccessfullyReactivatesOwnInactiveOfferTest_AVAILABLE_QUANTITY =
            10;

    public static final String sellerSuccessfullyReactivatesOwnInactiveOfferTest_UNIT =
            "portion";

    public static final String sellerSuccessfullyReactivatesOwnInactiveOfferTest_CREATE_MESSAGE =
            "Offer created successfully.";

    public static final String sellerSuccessfullyReactivatesOwnInactiveOfferTest_DEACTIVATE_MESSAGE =
            "Offer deactivated successfully.";

    public static final String sellerSuccessfullyReactivatesOwnInactiveOfferTest_ACTIVATE_MESSAGE =
            "Offer activated successfully.";

    public static final boolean sellerSuccessfullyReactivatesOwnInactiveOfferTest_INACTIVE =
            false;

    public static final boolean sellerSuccessfullyReactivatesOwnInactiveOfferTest_ACTIVE =
            true;
}
