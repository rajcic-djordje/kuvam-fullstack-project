package com.rajcic.pages.auth;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.auth.constants.ProfilePageConstants.*;

public class ProfilePage extends BasePage {

    private final By sellerApprovalStatus = By.cssSelector(SELLER_APPROVAL_STATUS_SELECTOR);

    public ProfilePage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public boolean isLoaded() {
        return isLoaded(sellerApprovalStatus);
    }

    public ProfilePage open() {
        driver.get(PROFILE_URL);
        isLoaded();

        return this;
    }

    public String getSellerApprovalStatus() {
        return getText(sellerApprovalStatus);
    }
}