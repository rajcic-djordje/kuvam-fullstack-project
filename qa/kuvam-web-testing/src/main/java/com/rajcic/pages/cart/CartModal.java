package com.rajcic.pages.cart;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.cart.constants.CartModalConstants.*;

public class CartModal extends BasePage {

    private final By modal = By.cssSelector(MODAL_SELECTOR);

    private final By cartItem = By.cssSelector(CART_ITEM_SELECTOR);

    private final By itemName = By.cssSelector(ITEM_NAME_SELECTOR);

    private final By quantity = By.cssSelector(QUANTITY_SELECTOR);

    private final By increaseQuantityButton = By.cssSelector(INCREASE_QUANTITY_BUTTON_SELECTOR);

    private final By decreaseQuantityButton = By.cssSelector(DECREASE_QUANTITY_BUTTON_SELECTOR);

    private final By buyerNote = By.id(BUYER_NOTE_ID);

    private final By totalPrice = By.cssSelector(TOTAL_PRICE_SELECTOR);

    private final By confirmButton = By.cssSelector(CONFIRM_BUTTON_SELECTOR);
    public CartModal(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public boolean isDisplayed() {
        return waitForVisible(modal).isDisplayed();
    }

    public int getItemCount() {
        return driver.findElements(cartItem).size();
    }

    public String getItemName() {
        return getText(itemName);
    }

    public int getQuantity() {
        return Integer.parseInt(getText(quantity));
    }

    public CartModal increaseQuantity() {
        click(increaseQuantityButton);
        return this;
    }

    public CartModal decreaseQuantity() {
        click(decreaseQuantityButton);
        return this;
    }

    public CartModal enterBuyerNote(String note) {
        type(buyerNote, note);
        return this;
    }

    public String getTotalPrice() {
        return getText(totalPrice);
    }

    public void confirmOrder() {
        click(confirmButton);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(modal));
    }
}