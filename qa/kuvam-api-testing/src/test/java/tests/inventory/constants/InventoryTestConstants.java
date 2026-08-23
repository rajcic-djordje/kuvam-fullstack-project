package tests.inventory.constants;

public class InventoryTestConstants {

    public static final String buyerSuccessfullyCreatesOrderTest_OFFER_NAME =
            "Offer for valid order creation test";

    public static final String buyerSuccessfullyCreatesOrderTest_OFFER_DESCRIPTION =
            "Offer created for valid order creation test.";

    public static final String buyerSuccessfullyCreatesOrderTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double buyerSuccessfullyCreatesOrderTest_OFFER_PRICE =
            500.0;

    public static final int buyerSuccessfullyCreatesOrderTest_OFFER_AVAILABLE_QUANTITY =
            10;

    public static final String buyerSuccessfullyCreatesOrderTest_OFFER_UNIT =
            "portion";

    public static final int buyerSuccessfullyCreatesOrderTest_ORDER_QUANTITY =
            2;

    public static final String buyerSuccessfullyCreatesOrderTest_BUYER_NOTE =
            "Test order note.";

    public static final String buyerSuccessfullyCreatesOrderTest_MESSAGE =
            "Order created successfully.";

    public static final String buyerSuccessfullyCreatesOrderTest_PENDING_STATUS =
            "pending";


    public static final String orderCreationBusinessRulesTest_OFFER_NAME =
            "Offer for business rules test";

    public static final String orderCreationBusinessRulesTest_OFFER_DESCRIPTION =
            "Offer created for business rules test.";

    public static final String orderCreationBusinessRulesTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double orderCreationBusinessRulesTest_OFFER_PRICE =
            500.0;

    public static final int orderCreationBusinessRulesTest_OFFER_AVAILABLE_QUANTITY =
            5;

    public static final String orderCreationBusinessRulesTest_OFFER_UNIT =
            "portion";

    public static final int orderCreationBusinessRulesTest_VALID_QUANTITY =
            1;

    public static final int orderCreationBusinessRulesTest_EXCESS_QUANTITY =
            6;

    public static final String orderCreationBusinessRulesTest_BUYER_NOTE =
            "";

    public static final String orderCreationBusinessRulesTest_NON_EXISTING_OFFER_ID =
            "507f1f77bcf86cd799439011";

    public static final String orderCreationBusinessRulesTest_OFFER_NOT_FOUND_CODE =
            "OFFER_NOT_FOUND";

    public static final String orderCreationBusinessRulesTest_OFFER_NOT_FOUND_MESSAGE =
            "One or more offers were not found.";

    public static final String orderCreationBusinessRulesTest_OFFER_NOT_AVAILABLE_CODE =
            "OFFER_NOT_AVAILABLE";

    public static final String orderCreationBusinessRulesTest_OFFER_NOT_AVAILABLE_MESSAGE =
            "One or more offers are currently not available.";

    public static final String orderCreationBusinessRulesTest_INSUFFICIENT_QUANTITY_CODE =
            "INSUFFICIENT_OFFER_QUANTITY";

    public static final String orderCreationBusinessRulesTest_SECOND_OFFER_NAME =
            "Second seller offer for business rules test";

    public static final String orderCreationBusinessRulesTest_MULTIPLE_SELLERS_CODE =
            "MULTIPLE_SELLERS_NOT_ALLOWED";

    public static final String orderCreationBusinessRulesTest_MULTIPLE_SELLERS_MESSAGE =
            "All items in an order must belong to the same seller.";


    public static final int STATUS_OK = 200;
    public static final int STATUS_CREATED = 201;
    public static final int STATUS_NOT_FOUND = 404;
    public static final int STATUS_CONFLICT = 409;


    public static final String orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_NAME =
            "Offer for inventory snapshot test";

    public static final String orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_DESCRIPTION =
            "Offer created for inventory snapshot test.";

    public static final String orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_PRICE =
            500.0;

    public static final double orderCreationUpdatesQuantityAndPriceSnapshotTest_UPDATED_OFFER_PRICE =
            750.0;

    public static final int orderCreationUpdatesQuantityAndPriceSnapshotTest_INITIAL_QUANTITY =
            10;

    public static final int orderCreationUpdatesQuantityAndPriceSnapshotTest_ORDER_QUANTITY =
            3;

    public static final String orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_UNIT =
            "portion";

    public static final String orderCreationUpdatesQuantityAndPriceSnapshotTest_BUYER_NOTE =
            "";

    public static final String orderCreationRollsBackQuantitiesTest_FIRST_OFFER_NAME =
            "First offer for rollback test";

    public static final String orderCreationRollsBackQuantitiesTest_SECOND_OFFER_NAME =
            "Second offer for rollback test";

    public static final String orderCreationRollsBackQuantitiesTest_OFFER_DESCRIPTION =
            "Offer created for rollback test.";

    public static final String orderCreationRollsBackQuantitiesTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double orderCreationRollsBackQuantitiesTest_OFFER_PRICE =
            500.0;

    public static final String orderCreationRollsBackQuantitiesTest_OFFER_UNIT =
            "portion";

    public static final int orderCreationRollsBackQuantitiesTest_FIRST_OFFER_QUANTITY =
            10;

    public static final int orderCreationRollsBackQuantitiesTest_SECOND_OFFER_QUANTITY =
            2;

    public static final int orderCreationRollsBackQuantitiesTest_FIRST_ORDER_QUANTITY =
            3;

    public static final int orderCreationRollsBackQuantitiesTest_SECOND_ORDER_QUANTITY =
            3;

    public static final String orderCreationRollsBackQuantitiesTest_BUYER_NOTE =
            "";

    public static final String orderCreationRollsBackQuantitiesTest_ERROR_CODE =
            "INSUFFICIENT_OFFER_QUANTITY";

    public static final String cancellingPendingOrderRestoresQuantityTest_OFFER_NAME =
            "Offer for cancel quantity restore test";

    public static final String cancellingPendingOrderRestoresQuantityTest_OFFER_DESCRIPTION =
            "Offer created for cancel quantity restore test.";

    public static final String cancellingPendingOrderRestoresQuantityTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double cancellingPendingOrderRestoresQuantityTest_OFFER_PRICE =
            500.0;

    public static final int cancellingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY =
            10;

    public static final int cancellingPendingOrderRestoresQuantityTest_ORDER_QUANTITY =
            3;

    public static final String cancellingPendingOrderRestoresQuantityTest_OFFER_UNIT =
            "portion";

    public static final String cancellingPendingOrderRestoresQuantityTest_BUYER_NOTE =
            "";

    public static final String cancellingPendingOrderRestoresQuantityTest_CANCELLED_STATUS =
            "cancelled";

    public static final String cancellingPendingOrderRestoresQuantityTest_CANCEL_MESSAGE =
            "Order cancelled successfully.";


    public static final String rejectingPendingOrderRestoresQuantityTest_OFFER_NAME =
            "Offer for reject quantity restore test";

    public static final String rejectingPendingOrderRestoresQuantityTest_OFFER_DESCRIPTION =
            "Offer created for reject quantity restore test.";

    public static final String rejectingPendingOrderRestoresQuantityTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double rejectingPendingOrderRestoresQuantityTest_OFFER_PRICE =
            500.0;

    public static final int rejectingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY =
            10;

    public static final int rejectingPendingOrderRestoresQuantityTest_ORDER_QUANTITY =
            3;

    public static final String rejectingPendingOrderRestoresQuantityTest_OFFER_UNIT =
            "portion";

    public static final String rejectingPendingOrderRestoresQuantityTest_BUYER_NOTE =
            "";

    public static final String rejectingPendingOrderRestoresQuantityTest_REJECTION_REASON =
            "Unable to fulfill this order.";

    public static final String rejectingPendingOrderRestoresQuantityTest_REJECT_MESSAGE =
            "Order rejected successfully.";

    public static final String rejectingPendingOrderRestoresQuantityTest_REJECTED_STATUS =
            "rejected";


    public static final String concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_NAME =
            "Offer for concurrent order test";

    public static final String concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_DESCRIPTION =
            "Offer created for concurrent order test.";

    public static final String concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_CATEGORY =
            "cooked_meals";

    public static final double concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_PRICE =
            500.0;

    public static final int concurrentOrdersCannotReduceQuantityBelowZeroTest_INITIAL_QUANTITY =
            5;

    public static final int concurrentOrdersCannotReduceQuantityBelowZeroTest_ORDER_QUANTITY =
            4;

    public static final int concurrentOrdersCannotReduceQuantityBelowZeroTest_EXPECTED_REMAINING_QUANTITY =
            1;

    public static final String concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_UNIT =
            "portion";

    public static final String concurrentOrdersCannotReduceQuantityBelowZeroTest_BUYER_NOTE =
            "";

    public static final String concurrentOrdersCannotReduceQuantityBelowZeroTest_ERROR_CODE =
            "INSUFFICIENT_OFFER_QUANTITY";
}