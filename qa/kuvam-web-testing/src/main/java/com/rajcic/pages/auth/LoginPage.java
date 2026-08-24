package com.rajcic.pages.auth;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.auth.constants.LoginPageConstants.*;

public class LoginPage extends BasePage {

    private final By emailInput = By.id(EMAIL_INPUT_ID);
    private final By passwordInput = By.id(PASSWORD_INPUT_ID);
    private final By submitButton = By.cssSelector(SUBMIT_BUTTON_SELECTOR);

    public LoginPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public boolean isLoaded() {
        return isLoaded(submitButton);
    }

    public LoginPage open() {
        driver.get(LOGIN_URL);
        isLoaded();

        return this;
    }

    public void waitForHomePage() {
        wait.until(ExpectedConditions.urlToBe(HOME_URL));
    }

    public LoginPage enterEmail(String email) {
        type(emailInput, email);
        return this;
    }

    public LoginPage enterPassword(String password) {
        type(passwordInput, password);
        return this;
    }

    public void submit() {
        click(submitButton);
    }

    public void login(String email, String password) {
        isLoaded();
        enterEmail(email);
        enterPassword(password);
        submit();
    }
}