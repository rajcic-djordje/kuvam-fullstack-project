package com.rajcic.pages.orders;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.orders.constants.MyOrdersPageConstants.*;

public class MyOrdersPage extends BasePage {

    private final By myOrdersPage = By.cssSelector(MY_ORDERS_PAGE_SELECTOR);

    public MyOrdersPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public MyOrdersPage open() {
        driver.get(ORDERS_URL);
        wait.until(ExpectedConditions.visibilityOfElementLocated(myOrdersPage));

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

    public String getOrderTotal(String note) {
        return getOrderCardByNote(note)
                .findElement(By.cssSelector(ORDER_TOTAL_SELECTOR))
                .getText();
    }

    public void openOrderDetails(String note) {
        getOrderCardByNote(note)
                .findElement(By.cssSelector(DETAILS_LINK_SELECTOR))
                .click();
    }
}