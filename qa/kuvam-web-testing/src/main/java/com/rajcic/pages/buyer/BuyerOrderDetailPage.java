package com.rajcic.pages;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.buyer.constants.BuyerOrderDetailPageConstants.*;

public class BuyerOrderDetailPage extends BasePage {

    private final By statusBadge = By.cssSelector(STATUS_BADGE_SELECTOR);
    private final By lockedLocation = By.cssSelector(LOCKED_LOCATION_SELECTOR);
    private final By pickupCity = By.cssSelector(PICKUP_CITY_SELECTOR);
    private final By pickupStreet = By.cssSelector(PICKUP_STREET_SELECTOR);
    private final By pickupCode = By.cssSelector(PICKUP_CODE_SELECTOR);
    private final By onTheWayButton = By.cssSelector(ON_THE_WAY_BUTTON_SELECTOR);
    private final By onTheWayConfirmation = By.cssSelector(ON_THE_WAY_CONFIRMATION_SELECTOR);
    private final By reviewButton = By.cssSelector(REVIEW_BUTTON_SELECTOR);
    private final By fiveStarButton = By.cssSelector(FIVE_STAR_BUTTON_SELECTOR);
    private final By reviewComment = By.id(REVIEW_COMMENT_ID);
    private final By reviewSubmitButton = By.cssSelector(REVIEW_SUBMIT_BUTTON_SELECTOR);
    private final By reviewModal = By.cssSelector(REVIEW_MODAL_SELECTOR);
    private final By reportButton = By.cssSelector(REPORT_BUTTON_SELECTOR);
    private final By reportReason = By.id(REPORT_REASON_ID);
    private final By reportDescription = By.id(REPORT_DESCRIPTION_ID);
    private final By reportSubmitButton = By.cssSelector(REPORT_SUBMIT_BUTTON_SELECTOR);
    private final By reportModal = By.cssSelector(REPORT_MODAL_SELECTOR);

    public BuyerOrderDetailPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public String getStatus() {
        return waitForVisible(statusBadge).getAttribute(DATA_STATUS_ATTRIBUTE);
    }

    public boolean isPickupAddressLocked() {
        return waitForVisible(lockedLocation).isDisplayed();
    }

    public String getPickupCity() {
        return getText(pickupCity);
    }

    public String getPickupStreet() {
        return getText(pickupStreet);
    }

    public String getPickupCode() {
        return getText(pickupCode);
    }

    public boolean hasValidPickupCode() {
        return getPickupCode().matches(PICKUP_CODE_REGEX);
    }

    public void markAsOnTheWay() {
        click(onTheWayButton);
        wait.until(ExpectedConditions.visibilityOfElementLocated(onTheWayConfirmation));
    }

    public boolean isOnTheWayConfirmed() {
        return waitForVisible(onTheWayConfirmation).isDisplayed();
    }

    public void submitReview(String comment) {
        click(reviewButton);
        waitForVisible(reviewModal);
        click(fiveStarButton);
        type(reviewComment, comment);
        click(reviewSubmitButton);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(reviewModal));
    }

    public boolean isReviewModalClosed() {
        return driver.findElements(reviewModal).isEmpty();
    }

    public void submitReport(String reason, String description) {
        click(reportButton);
        waitForVisible(reportModal);
        new Select(waitForVisible(reportReason)).selectByVisibleText(reason);
        type(reportDescription, description);
        click(reportSubmitButton);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(reportModal));
    }

    public boolean isReportModalClosed() {
        return driver.findElements(reportModal).isEmpty();
    }
}