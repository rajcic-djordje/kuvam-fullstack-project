package com.rajcic.pages.auth;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ProfilePage extends BasePage {

    private final By sellerApprovalStatus =
            By.cssSelector(".seller-status-bar .approval-pill");

    public ProfilePage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public ProfilePage open() {
        driver.get("http://localhost:4200/profile");
        return this;
    }

    public String getSellerApprovalStatus() {
        return getText(sellerApprovalStatus);
    }
}