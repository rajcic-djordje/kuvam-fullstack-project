package com.rajcic.pages.admin;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.admin.constants.AdminUsersPageConstants.*;

public class AdminUsersPage extends BasePage {

    private final By searchInput = By.cssSelector(SEARCH_INPUT_SELECTOR);
    private final By statusBadge = By.cssSelector(STATUS_BADGE_SELECTOR);
    private final By actionsButton = By.cssSelector(ACTIONS_BUTTON_SELECTOR);
    private final By suspendButton = By.xpath(SUSPEND_BUTTON_XPATH);
    private final By suspensionReason = By.cssSelector(SUSPENSION_REASON_SELECTOR);
    private final By confirmButton = By.cssSelector(CONFIRM_BUTTON_SELECTOR);

    public AdminUsersPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public AdminUsersPage open() {
        driver.get(ADMIN_USERS_URL);
        waitForVisible(searchInput);

        return this;
    }

    private By userCard(String email) {
        return By.xpath(String.format(USER_CARD_XPATH, email));
    }

    private By userStatusBadge(String email) {
        return By.xpath(String.format(USER_STATUS_BADGE_XPATH, email));
    }

    private WebElement getUserCard(String email) {
        return waitForVisible(userCard(email));
    }

    public void search(String email) {
        type(searchInput, email);
        waitForVisible(userCard(email));
    }

    public String getStatus(String email) {
        return waitForVisible(userStatusBadge(email)).getText();
    }

    public void suspendUser(String email, String reason) {
        WebElement card = getUserCard(email);

        card.findElement(actionsButton).click();
        card.findElement(suspendButton).click();

        type(suspensionReason, reason);
        click(confirmButton);

        wait.until(ExpectedConditions.textToBePresentInElementLocated(userStatusBadge(email), SUSPENDED_STATUS_PART));
    }
}