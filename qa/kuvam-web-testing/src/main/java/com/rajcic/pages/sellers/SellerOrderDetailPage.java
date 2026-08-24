package com.rajcic.pages.sellers;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static com.rajcic.pages.sellers.constants.SellerOrderDetailPageConstants.*;

public class SellerOrderDetailPage extends BasePage {

    private final By statusBadge = By.cssSelector(STATUS_BADGE_SELECTOR);
    private final By buyerEmail = By.cssSelector(BUYER_EMAIL_SELECTOR);
    private final By acceptButton = By.cssSelector(ACCEPT_BUTTON_SELECTOR);
    private final By estimatedPickupInput = By.id(ESTIMATED_PICKUP_INPUT_ID);
    private final By confirmAcceptButton = By.xpath(CONFIRM_ACCEPT_BUTTON_XPATH);
    private final By markReadyButton = By.xpath(MARK_READY_BUTTON_XPATH);
    private final By pickupCodeInput = By.id(PICKUP_CODE_INPUT_ID);
    private final By completeOrderButton = By.xpath(COMPLETE_ORDER_BUTTON_XPATH);

    public SellerOrderDetailPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public String getStatus() {
        return waitForVisible(statusBadge).getAttribute(DATA_STATUS_ATTRIBUTE);
    }

    public String getBuyerEmail() {
        String href = waitForVisible(buyerEmail).getAttribute(HREF_ATTRIBUTE);
        if(href==null) return null;

        return href.replace(MAILTO_PREFIX, "");
    }

    public void openAcceptForm() {
        click(acceptButton);
        waitForVisible(estimatedPickupInput);
    }

    public void enterEstimatedPickupAt(String value) {
        type(estimatedPickupInput, value);
    }

    public void enterEstimatedPickupAfterHours(int hours) {
        String value = LocalDateTime.now()
                .plusHours(hours)
                .withSecond(ZERO_SECONDS)
                .withNano(ZERO_NANOS)
                .format(DateTimeFormatter.ofPattern(PICKUP_DATE_TIME_PATTERN));

        enterEstimatedPickupAt(value);
    }

    public void confirmAcceptance() {
        click(confirmAcceptButton);
        wait.until(driver -> getStatus().equals(STATUS_ACCEPTED));
    }

    public void markAsReady() {
        click(markReadyButton);
        wait.until(driver -> getStatus().equals(STATUS_READY));
    }

    public void completeOrder(String pickupCode) {
        type(pickupCodeInput, pickupCode);
        click(completeOrderButton);
        wait.until(driver -> getStatus().equals(STATUS_COMPLETED));
    }
}