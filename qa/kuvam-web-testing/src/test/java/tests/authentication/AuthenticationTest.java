package tests.authentication;

import com.rajcic.pages.auth.LoginPage;
import com.rajcic.pages.auth.ProfilePage;
import com.rajcic.pages.auth.RegisterPage;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.base.BaseTest;

import static tests.authentication.constants.AuthenticationTestConstants.*;

public class AuthenticationTest extends BaseTest {

    @Test
    public void buyerRegistrationAndLoginFlowTest() {
        String email = BUYER_EMAIL_PREFIX + System.currentTimeMillis() + TEST_EMAIL_DOMAIN;

        RegisterPage registerPage = new RegisterPage(driver, wait);
        registerPage.open().registerBuyer(BUYER_FIRST_NAME, BUYER_LAST_NAME, email, PASSWORD);
        registerPage.waitForLoginPage();

        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.login(email, PASSWORD);
        loginPage.waitForHomePage();
    }

    @Test
    public void sellerRegistrationAndPendingApprovalFlowTest() {
        String email = SELLER_EMAIL_PREFIX + System.currentTimeMillis() + TEST_EMAIL_DOMAIN;

        RegisterPage registerPage = new RegisterPage(driver, wait);
        registerPage.open().registerSeller(SELLER_FIRST_NAME, SELLER_LAST_NAME, email, PASSWORD, BUSINESS_NAME, BUSINESS_DESCRIPTION);
        registerPage.waitForLoginPage();

        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.login(email, PASSWORD);
        loginPage.waitForHomePage();

        ProfilePage profilePage = new ProfilePage(driver, wait);
        profilePage.open();

        Assert.assertEquals(profilePage.getSellerApprovalStatus(), SELLER_PENDING_STATUS, ASSERT_SELLER_PENDING);
    }
}