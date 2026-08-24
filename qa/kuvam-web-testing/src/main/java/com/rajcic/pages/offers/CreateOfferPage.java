package com.rajcic.pages.offers;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.offers.constants.CreateOfferPageConstants.*;

public class CreateOfferPage extends BasePage {

    private final By nameInput = By.id(NAME_INPUT_ID);
    private final By descriptionInput = By.id(DESCRIPTION_INPUT_ID);
    private final By categorySelect = By.id(CATEGORY_SELECT_ID);
    private final By priceInput = By.id(PRICE_INPUT_ID);
    private final By quantityInput = By.id(QUANTITY_INPUT_ID);
    private final By unitSelect = By.id(UNIT_SELECT_ID);
    private final By submitButton = By.cssSelector(SUBMIT_BUTTON_SELECTOR);

    public CreateOfferPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public CreateOfferPage open() {
        driver.get(CREATE_OFFER_URL);
        waitForVisible(nameInput);

        return this;
    }

    public CreateOfferPage enterName(String name) {
        type(nameInput, name);
        return this;
    }

    public CreateOfferPage enterDescription(String description) {
        type(descriptionInput, description);
        return this;
    }

    public CreateOfferPage selectCategory(String category) {
        new Select(waitForVisible(categorySelect)).selectByVisibleText(category);
        return this;
    }

    public CreateOfferPage enterPrice(int price) {
        type(priceInput, String.valueOf(price));
        return this;
    }

    public CreateOfferPage enterQuantity(int quantity) {
        type(quantityInput, String.valueOf(quantity));
        return this;
    }

    public CreateOfferPage selectUnit(String unit) {
        new Select(waitForVisible(unitSelect)).selectByVisibleText(unit);
        return this;
    }

    public void submit() {
        click(submitButton);
        wait.until(ExpectedConditions.urlToBe(SELLER_OFFERS_URL));
    }

    public void createOffer(String name, String description, String category, int price, int quantity, String unit) {
        enterName(name);
        enterDescription(description);
        selectCategory(category);
        enterPrice(price);
        enterQuantity(quantity);
        selectUnit(unit);
        submit();
    }
}