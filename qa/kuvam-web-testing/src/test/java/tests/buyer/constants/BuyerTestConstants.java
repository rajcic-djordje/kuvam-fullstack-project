package tests.buyer.constants;

public final class BuyerTestConstants {

    public static final String BUYER_EMAIL = "nikola.seed@kuvam.rs";
    public static final String SELLER_EMAIL = "milica.seed@kuvam.rs";
    public static final String PASSWORD = "Test1234";

    public static final String TEST_FIRST_NAME = "Selenium";
    public static final String LOCATION_LAST_NAME = "Location";
    public static final String LOCATION_EMAIL_PREFIX = "selenium.location.";
    public static final String TEST_EMAIL_DOMAIN = "@kuvam.test";

    public static final String LOCATION_CITY = "Kragujevac";
    public static final String LOCATION_STREET = "Kneza Miloša";
    public static final String LOCATION_STREET_NUMBER = "64";

    public static final String SELLER_NAME = "Miličina domaća kuhinja";
    public static final String OFFER_NAME = "Domaća sarma";
    public static final String OFFER_PRICE = "720 RSD";
    public static final String TWO_PORTIONS_TOTAL = "1440 RSD";

    public static final String PICKUP_CITY = "Kragujevac";
    public static final String PICKUP_STREET = "Svetozara Markovića 27";

    public static final String ORDER_NOTE = "Selenium test porudžbina";
    public static final String PICKUP_NOTE_PREFIX = "Selenium pickup ";
    public static final String COMPLETED_NOTE_PREFIX = "Selenium completed ";
    public static final String REVIEW_COMMENT_PREFIX = "Odlična hrana - Selenium ";
    public static final String REPORT_DESCRIPTION_PREFIX = "Selenium test prijava za završenu porudžbinu ";
    public static final String REPORT_REASON_OTHER = "Drugo";

    public static final String STATUS_PENDING = "pending";
    public static final String STATUS_ACCEPTED = "accepted";
    public static final String STATUS_READY = "ready";
    public static final String STATUS_COMPLETED = "completed";

    public static final int ONE_ITEM = 1;
    public static final int ONE_PORTION = 1;
    public static final int TWO_PORTIONS = 2;
    public static final int PICKUP_DELAY_HOURS = 2;

    public static final String ASSERT_LOCATION_MODAL_DISPLAYED =
            "Location modal should be displayed after buyer login.";

    public static final String ASSERT_SELLERS_DISPLAYED =
            "Offers page should display available sellers.";

    public static final String ASSERT_OFFER_NAME =
            "Opened offer should have the expected name.";

    public static final String ASSERT_OFFER_PRICE =
            "Opened offer should have the expected price.";

    public static final String ASSERT_TWO_PORTIONS_TOTAL =
            "Total price for two portions should have the expected value.";

    public static final String ASSERT_CART_AUTO_OPEN =
            "Cart should open automatically after adding an offer.";

    public static final String ASSERT_CART_ITEM_COUNT =
            "Cart should contain exactly one distinct offer.";

    public static final String ASSERT_CART_ITEM_NAME =
            "Cart should contain the offer that was added.";

    public static final String ASSERT_CART_QUANTITY =
            "Cart should contain the expected quantity.";

    public static final String ASSERT_CART_TOTAL =
            "Cart should display the expected total price.";

    public static final String ASSERT_PICKUP_OFFER =
            "Buyer should open the expected offer.";

    public static final String ASSERT_CART_OPEN =
            "Cart should be displayed after adding an offer.";

    public static final String ASSERT_NEW_ORDER_PENDING =
            "Newly created order should initially be pending.";

    public static final String ASSERT_PICKUP_TOTAL =
            "Created order should have the expected total price.";

    public static final String ASSERT_BUYER_PENDING_DETAIL =
            "Buyer order details should display pending status.";

    public static final String ASSERT_PICKUP_ADDRESS_LOCKED =
            "Exact pickup address should remain hidden while the order is pending.";

    public static final String ASSERT_SELLER_RECEIVES_PENDING =
            "Seller should receive the created order as pending.";

    public static final String ASSERT_SELLER_ACCEPTED =
            "Seller should successfully accept the order.";

    public static final String ASSERT_SELLER_READY =
            "Seller should successfully mark the order as ready.";

    public static final String ASSERT_BUYER_READY =
            "Buyer should see the order as ready.";

    public static final String ASSERT_BUYER_READY_DETAIL =
            "Buyer order details should display ready status.";

    public static final String ASSERT_PICKUP_CITY =
            "Buyer should see the expected pickup city.";

    public static final String ASSERT_PICKUP_STREET =
            "Buyer should see the expected pickup street.";

    public static final String ASSERT_PICKUP_CODE =
            "Ready order should expose a valid six-digit pickup code.";

    public static final String ASSERT_ON_THE_WAY =
            "Buyer should see confirmation that the seller was notified.";

    public static final String ASSERT_CREATED_ORDER_PENDING =
            "Created order should initially be pending.";

    public static final String ASSERT_ORDER_MOVED_TO_READY =
            "Seller should move the order to ready.";

    public static final String ASSERT_BUYER_SEES_READY =
            "Buyer should see the order as ready.";

    public static final String ASSERT_BUYER_RECEIVES_CODE =
            "Buyer should receive a valid six-digit pickup code.";

    public static final String ASSERT_SELLER_SEES_READY =
            "Seller should see the order as ready before pickup confirmation.";

    public static final String ASSERT_ORDER_COMPLETED =
            "Valid pickup code should complete the order.";

    public static final String ASSERT_BUYER_SEES_COMPLETED =
            "Buyer should see the order as completed after pickup.";

    public static final String ASSERT_REVIEW_MODAL_CLOSED =
            "Review modal should close after successful review submission.";

    public static final String ASSERT_REPORT_MODAL_CLOSED =
            "Report modal should close after successful report submission.";

    private BuyerTestConstants() {
    }
}