package tests.seller.constants;

public final class SellerTestConstants {

    public static final String SELLER_EMAIL = "milica.seed@kuvam.rs";
    public static final String BUYER_EMAIL = "nikola.seed@kuvam.rs";
    public static final String PASSWORD = "Test1234";

    public static final String SELLER_NAME = "Miličina domaća kuhinja";
    public static final String OFFER_NAME = "Domaća sarma";

    public static final String OFFER_NAME_PREFIX = "Selenium ponuda ";
    public static final String OFFER_DESCRIPTION = "Ponuda kreirana kroz Selenium test.";
    public static final String OFFER_CATEGORY = "Kuvana jela";
    public static final String OFFER_UNIT = "Porcija";

    public static final int OFFER_PRICE = 550;
    public static final int OFFER_QUANTITY = 7;

    public static final String OFFER_PRICE_DISPLAY = "550 RSD";
    public static final String OFFER_QUANTITY_DISPLAY = "7 porcija";

    public static final String STATUS_ACTIVE = "Aktivna";
    public static final String STATUS_INACTIVE = "Neaktivna";

    public static final String ORDER_NOTE_PREFIX = "Selenium seller order ";
    public static final int ORDER_QUANTITY = 1;
    public static final String ORDER_TOTAL = "720 RSD";
    public static final int PICKUP_DELAY_HOURS = 2;

    public static final String STATUS_PENDING = "pending";
    public static final String STATUS_ACCEPTED = "accepted";
    public static final String STATUS_READY = "ready";

    public static final String ASSERT_OFFER_DISPLAYED =
            "Newly created offer should be visible on the seller offers page.";

    public static final String ASSERT_OFFER_PRICE =
            "Created offer should display the exact configured price.";

    public static final String ASSERT_OFFER_QUANTITY =
            "Created offer should display the exact configured quantity and unit.";

    public static final String ASSERT_OFFER_ACTIVE =
            "Newly created offer should initially be active.";

    public static final String ASSERT_OFFER_INACTIVE =
            "Offer should become inactive after seller deactivates it.";

    public static final String ASSERT_OFFER_REACTIVATED =
            "Offer should become active again after seller activates it.";

    public static final String ASSERT_OFFER_DELETED =
            "Deleted offer should no longer be displayed in seller offers.";

    public static final String ASSERT_SELECTED_OFFER =
            "Buyer should open the expected offer before creating the test order.";

    public static final String ASSERT_ORDER_TOTAL =
            "Selected quantity should have the expected total price.";

    public static final String ASSERT_CART_OPEN =
            "Cart should open automatically after adding the offer.";

    public static final String ASSERT_CART_ITEM =
            "Cart should contain the selected offer.";

    public static final String ASSERT_CART_QUANTITY =
            "Cart should contain the expected quantity.";

    public static final String ASSERT_NEW_ORDER_PENDING =
            "New buyer order should appear to the seller with pending status.";

    public static final String ASSERT_DETAIL_PENDING =
            "Order detail page should initially display pending status.";

    public static final String ASSERT_BUYER_EMAIL =
            "Seller order details should show the correct buyer email.";

    public static final String ASSERT_ORDER_ACCEPTED =
            "Order should transition from pending to accepted after seller confirmation.";

    public static final String ASSERT_ORDER_READY =
            "Accepted order should transition to ready after seller finishes preparation.";

    private SellerTestConstants() {
    }
}