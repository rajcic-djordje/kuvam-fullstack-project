package com.rajcic.pages.admin;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.admin.constants.AdminLoginPageConstants.*;

public class AdminLoginPage extends BasePage {

    private final By emailInput = By.id(EMAIL_INPUT_ID);
    private final By passwordInput = By.id(PASSWORD_INPUT_ID);
    private final By submitButton = By.cssSelector(SUBMIT_BUTTON_SELECTOR);

    public AdminLoginPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public AdminLoginPage open() {
        driver.get(ADMIN_LOGIN_URL);
        waitForVisible(emailInput);

        return this;
    }

    public void login(String email, String password) {
        type(emailInput, email);
        type(passwordInput, password);
        click(submitButton);
    }
}