package tests.admin;

import com.rajcic.pages.admin.AdminLoginPage;
import com.rajcic.pages.admin.AdminPendingSellersPage;
import com.rajcic.pages.admin.AdminReportsPage;
import com.rajcic.pages.admin.AdminUsersPage;
import com.rajcic.pages.auth.RegisterPage;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.base.BaseTest;

import static tests.admin.constants.AdminTestConstants.*;

public class AdminTest extends BaseTest {

    @Test
    public void sellerAndUserAdministrationFlowTest() {
        String timestamp = String.valueOf(System.currentTimeMillis());

        String sellerEmail = SELLER_EMAIL_PREFIX + timestamp + TEST_EMAIL_DOMAIN;
        String buyerEmail = BUYER_EMAIL_PREFIX + timestamp + TEST_EMAIL_DOMAIN;
        String sellerBusinessName = SELLER_BUSINESS_NAME_PREFIX + timestamp;

        RegisterPage registerPage = new RegisterPage(driver, wait);
        registerPage.open().registerSeller(TEST_FIRST_NAME, SELLER_LAST_NAME, sellerEmail, PASSWORD, sellerBusinessName, SELLER_DESCRIPTION);
        registerPage.waitForLoginPage();

        clearCurrentSession();

        registerPage = new RegisterPage(driver, wait);
        registerPage.open().registerBuyer(TEST_FIRST_NAME, BUYER_LAST_NAME, buyerEmail, PASSWORD);
        registerPage.waitForLoginPage();

        clearCurrentSession();

        AdminLoginPage adminLoginPage = new AdminLoginPage(driver, wait);
        adminLoginPage.open();
        adminLoginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        AdminPendingSellersPage pendingSellersPage = new AdminPendingSellersPage(driver, wait);
        pendingSellersPage.open().search(sellerEmail);

        Assert.assertTrue(pendingSellersPage.isSellerDisplayed(sellerEmail), ASSERT_PENDING_SELLER_DISPLAYED);

        pendingSellersPage.approveSeller(sellerEmail);

        Assert.assertFalse(pendingSellersPage.isSellerDisplayed(sellerEmail), ASSERT_APPROVED_SELLER_REMOVED);

        AdminUsersPage usersPage = new AdminUsersPage(driver, wait);
        usersPage.open().search(buyerEmail);

        Assert.assertEquals(usersPage.getStatus(buyerEmail), STATUS_ACTIVE, ASSERT_BUYER_ACTIVE);

        usersPage.suspendUser(buyerEmail, SUSPENSION_REASON);

        Assert.assertTrue(usersPage.getStatus(buyerEmail).contains(STATUS_SUSPENDED_PART), ASSERT_BUYER_SUSPENDED);
    }

    @Test
    public void reportModerationFlowTest() {
        AdminLoginPage adminLoginPage = new AdminLoginPage(driver, wait);
        adminLoginPage.open();
        adminLoginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);

        AdminReportsPage reportsPage = new AdminReportsPage(driver, wait);
        reportsPage.open().search(REPORT_DESCRIPTION);

        Assert.assertEquals(reportsPage.getStatus(REPORT_DESCRIPTION), REPORT_STATUS_PENDING, ASSERT_REPORT_PENDING);

        reportsPage.approveReport(REPORT_DESCRIPTION, REPORT_ADMIN_NOTE);

        Assert.assertEquals(reportsPage.getStatus(REPORT_DESCRIPTION), REPORT_STATUS_APPROVED, ASSERT_REPORT_APPROVED);
    }
}