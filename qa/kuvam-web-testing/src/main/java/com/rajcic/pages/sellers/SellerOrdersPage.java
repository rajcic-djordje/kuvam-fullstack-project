package com.rajcic.pages.sellers;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.sellers.constants.SellerOrdersPageConstants.*;

public class SellerOrdersPage extends BasePage {

    private final By sellerOrdersPage = By.cssSelector(SELLER_ORDERS_PAGE_SELECTOR);

    public SellerOrdersPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public SellerOrdersPage open() {
        driver.get(SELLER_ORDERS_URL);
        wait.until(ExpectedConditions.visibilityOfElementLocated(sellerOrdersPage));

        return this;
    }

    private By orderCardByNote(String note) {
        return By.xpath(String.format(ORDER_CARD_BY_NOTE_XPATH, note));
    }

    private WebElement getOrderCardByNote(String note) {
        return waitForVisible(orderCardByNote(note));
    }

    public String getOrderStatus(String note) {
        return getOrderCardByNote(note)
                .findElement(By.cssSelector(STATUS_BADGE_SELECTOR))
                .getAttribute(DATA_STATUS_ATTRIBUTE);
    }

    public void openOrderDetails(String note) {
        getOrderCardByNote(note)
                .findElement(By.cssSelector(DETAILS_LINK_SELECTOR))
                .click();
    }
}