package com.rajcic.pages.admin;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.admin.constants.AdminPendingSellersPageConstants.*;

public class AdminPendingSellersPage extends BasePage {

    private final By pendingSellersLink = By.cssSelector(PENDING_SELLERS_LINK_SELECTOR);
    private final By searchInput = By.cssSelector(SEARCH_INPUT_SELECTOR);
    private final By actionsButton = By.cssSelector(ACTIONS_BUTTON_SELECTOR);
    private final By approveAction = By.cssSelector(APPROVE_ACTION_SELECTOR);
    private final By sellerModal = By.cssSelector(SELLER_MODAL_SELECTOR);
    private final By confirmButton = By.cssSelector(CONFIRM_BUTTON_SELECTOR);

    public AdminPendingSellersPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public AdminPendingSellersPage open() {
        click(pendingSellersLink);
        wait.until(ExpectedConditions.urlContains(PENDING_SELLERS_URL_PART));
        waitForVisible(searchInput);

        return this;
    }

    private By sellerCard(String email) {
        return By.xpath(String.format(SELLER_CARD_XPATH, email));
    }

    public void search(String email) {
        type(searchInput, email);
        waitForVisible(sellerCard(email));
    }

    public boolean isSellerDisplayed(String email) {
        return !driver.findElements(sellerCard(email)).isEmpty();
    }

    public void approveSeller(String email) {
        WebElement card = waitForVisible(sellerCard(email));

        card.findElement(actionsButton).click();
        card.findElement(approveAction).click();

        waitForVisible(sellerModal);
        click(confirmButton);

        wait.until(ExpectedConditions.invisibilityOfElementLocated(sellerCard(email)));
    }
}