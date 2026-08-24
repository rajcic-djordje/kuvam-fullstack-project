package tests.admin.constants;

public final class AdminTestConstants {

    public static final String ADMIN_EMAIL = "admin@kuvam.rs";
    public static final String ADMIN_PASSWORD = "qwertyuiopasdfghjklzxcvbnm1234567890";

    public static final String PASSWORD = "Test1234";

    public static final String TEST_FIRST_NAME = "Selenium";
    public static final String SELLER_LAST_NAME = "Seller";
    public static final String BUYER_LAST_NAME = "Buyer";

    public static final String SELLER_EMAIL_PREFIX = "selenium.seller.";
    public static final String BUYER_EMAIL_PREFIX = "selenium.buyer.";
    public static final String TEST_EMAIL_DOMAIN = "@kuvam.test";

    public static final String SELLER_BUSINESS_NAME_PREFIX = "Selenium domaćin ";
    public static final String SELLER_DESCRIPTION = "Domaća hrana kreirana za Selenium administratorski test.";

    public static final String STATUS_ACTIVE = "Aktivan";
    public static final String STATUS_SUSPENDED_PART = "Suspend";

    public static final String SUSPENSION_REASON = "Selenium administrativni test suspenzije.";

    public static final String REPORT_DESCRIPTION =
            "Dobijena porcija se značajno razlikovala od opisa i prikazane ponude.";

    public static final String REPORT_ADMIN_NOTE =
            "Selenium test - prijava je pregledana i potvrđena.";

    public static final String REPORT_STATUS_PENDING = "Na čekanju";
    public static final String REPORT_STATUS_APPROVED = "Odobrena";

    public static final String ASSERT_PENDING_SELLER_DISPLAYED =
            "New seller registration should appear in the pending seller administration list.";

    public static final String ASSERT_APPROVED_SELLER_REMOVED =
            "Approved seller should disappear from the pending seller list.";

    public static final String ASSERT_BUYER_ACTIVE =
            "New buyer should initially have active status.";

    public static final String ASSERT_BUYER_SUSPENDED =
            "Administrator should be able to suspend an active buyer.";

    public static final String ASSERT_REPORT_PENDING =
            "Seeded report should initially have pending status.";

    public static final String ASSERT_REPORT_APPROVED =
            "Administrator should successfully approve the pending report.";

    private AdminTestConstants() {
    }
}