package com.rajcic.pages.auth;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.auth.constants.RegisterPageConstants.*;

public class RegisterPage extends BasePage {

    private final By firstNameInput = By.id(FIRST_NAME_INPUT_ID);
    private final By lastNameInput = By.id(LAST_NAME_INPUT_ID);
    private final By emailInput = By.id(EMAIL_INPUT_ID);
    private final By passwordInput = By.id(PASSWORD_INPUT_ID);
    private final By confirmPasswordInput = By.id(CONFIRM_PASSWORD_INPUT_ID);
    private final By submitButton = By.cssSelector(SUBMIT_BUTTON_SELECTOR);
    private final By sellerRoleButton = By.xpath(SELLER_ROLE_BUTTON_XPATH);
    private final By businessNameInput = By.id(BUSINESS_NAME_INPUT_ID);
    private final By descriptionInput = By.id(DESCRIPTION_INPUT_ID);

    public RegisterPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public RegisterPage open() {
        driver.get(REGISTER_URL);
        return this;
    }

    public RegisterPage enterFirstName(String firstName) {
        type(firstNameInput, firstName);
        return this;
    }

    public RegisterPage enterLastName(String lastName) {
        type(lastNameInput, lastName);
        return this;
    }

    public RegisterPage enterEmail(String email) {
        type(emailInput, email);
        return this;
    }

    public RegisterPage enterPassword(String password) {
        type(passwordInput, password);
        return this;
    }

    public RegisterPage enterConfirmPassword(String password) {
        type(confirmPasswordInput, password);
        return this;
    }

    public void submit() {
        click(submitButton);
    }

    public RegisterPage selectSellerRole() {
        click(sellerRoleButton);
        return this;
    }

    public RegisterPage enterBusinessName(String businessName) {
        type(businessNameInput, businessName);
        return this;
    }

    public RegisterPage enterDescription(String description) {
        type(descriptionInput, description);
        return this;
    }

    public void waitForLoginPage() {
        wait.until(ExpectedConditions.urlContains(LOGIN_URL_PART));
    }

    public void registerBuyer(String firstName, String lastName, String email, String password) {
        enterFirstName(firstName);
        enterLastName(lastName);
        enterEmail(email);
        enterPassword(password);
        enterConfirmPassword(password);
        submit();
    }

    public void registerSeller(String firstName, String lastName, String email, String password, String businessName, String description) {
        selectSellerRole();
        enterFirstName(firstName);
        enterLastName(lastName);
        enterEmail(email);
        enterPassword(password);
        enterConfirmPassword(password);
        enterBusinessName(businessName);
        enterDescription(description);
        submit();
    }
}