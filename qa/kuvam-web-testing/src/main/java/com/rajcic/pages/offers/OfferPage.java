package com.rajcic.pages.offers;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.offers.constants.OfferPageConstants.*;

public class OfferPage extends BasePage {

    private final By offerName = By.cssSelector(OFFER_NAME_SELECTOR);
    private final By offerPrice = By.cssSelector(OFFER_PRICE_SELECTOR);
    private final By quantityInput = By.id(QUANTITY_INPUT_ID);
    private final By totalPrice = By.cssSelector(TOTAL_PRICE_SELECTOR);
    private final By addToCartButton = By.cssSelector(ADD_TO_CART_BUTTON_SELECTOR);

    public OfferPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public OfferPage open(String offerId) {
        driver.get(OFFER_URL_PREFIX + offerId);
        waitForVisible(offerName);

        return this;
    }

    public String getOfferName() {
        return getText(offerName);
    }

    public String getOfferPrice() {
        return getText(offerPrice);
    }

    public OfferPage enterQuantity(int quantity) {
        type(quantityInput, String.valueOf(quantity));
        return this;
    }

    public String getTotalPrice() {
        return getText(totalPrice);
    }

    public void addToCart() {
        click(addToCartButton);
    }
}