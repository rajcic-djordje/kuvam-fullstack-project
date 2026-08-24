package com.rajcic.pages.sellers;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.sellers.constants.SellerOffersPageConstants.*;

public class SellerOffersPage extends BasePage {

    private final By sellerOffersPage = By.cssSelector(SELLER_OFFERS_PAGE_SELECTOR);
    private final By loader = By.cssSelector(LOADER_SELECTOR);

    public SellerOffersPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public SellerOffersPage open() {
        driver.get(SELLER_OFFERS_URL);
        waitForVisible(sellerOffersPage);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(loader));

        return this;
    }

    private By offerCard(String offerName) {
        return By.xpath(String.format(OFFER_CARD_XPATH, offerName));
    }

    private WebElement getOfferCard(String offerName) {
        return waitForVisible(offerCard(offerName));
    }

    public boolean isOfferDisplayed(String offerName) {
        return !driver.findElements(offerCard(offerName)).isEmpty();
    }

    public String getOfferStatus(String offerName) {
        return getOfferCard(offerName)
                .findElement(By.cssSelector(STATUS_BADGE_SELECTOR))
                .getText();
    }

    public String getOfferPrice(String offerName) {
        return getOfferCard(offerName)
                .findElements(By.cssSelector(OFFER_DETAILS_SELECTOR))
                .get(PRICE_INDEX)
                .findElement(By.tagName(STRONG_TAG))
                .getText();
    }

    public String getOfferQuantity(String offerName) {
        return getOfferCard(offerName)
                .findElements(By.cssSelector(OFFER_DETAILS_SELECTOR))
                .get(QUANTITY_INDEX)
                .findElement(By.tagName(STRONG_TAG))
                .getText();
    }

    public void deactivateOffer(String offerName) {
        getOfferCard(offerName)
                .findElement(By.cssSelector(DEACTIVATE_ACTION_SELECTOR))
                .click();

        wait.until(driver -> getOfferStatus(offerName).equals(STATUS_INACTIVE));
    }

    public void activateOffer(String offerName) {
        getOfferCard(offerName)
                .findElement(By.cssSelector(ACTIVATE_ACTION_SELECTOR))
                .click();

        wait.until(driver -> getOfferStatus(offerName).equals(STATUS_ACTIVE));
    }

    public void deleteOffer(String offerName) {
        getOfferCard(offerName)
                .findElement(By.cssSelector(DELETE_ACTION_SELECTOR))
                .click();

        wait.until(ExpectedConditions.alertIsPresent());

        driver.switchTo().alert().accept();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(offerCard(offerName)));
    }
}