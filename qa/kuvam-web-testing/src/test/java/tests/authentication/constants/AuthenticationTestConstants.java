package tests.authentication.constants;

public final class AuthenticationTestConstants {

    public static final String BUYER_EMAIL_PREFIX = "selenium.";
    public static final String SELLER_EMAIL_PREFIX = "selenium.seller.";
    public static final String TEST_EMAIL_DOMAIN = "@kuvam.test";

    public static final String PASSWORD = "Test1234";

    public static final String BUYER_FIRST_NAME = "Selenium";
    public static final String BUYER_LAST_NAME = "Buyer";

    public static final String SELLER_FIRST_NAME = "Selenium";
    public static final String SELLER_LAST_NAME = "Seller";

    public static final String BUSINESS_NAME = "Selenium domaćin";
    public static final String BUSINESS_DESCRIPTION = "Test domaća kuhinja";

    public static final String SELLER_PENDING_STATUS = "Na čekanju";

    public static final String ASSERT_SELLER_PENDING =
            "Newly registered seller should have pending approval status.";

    private AuthenticationTestConstants() {
    }
}