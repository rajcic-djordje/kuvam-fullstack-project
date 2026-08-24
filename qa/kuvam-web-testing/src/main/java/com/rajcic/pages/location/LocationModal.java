package com.rajcic.pages.location;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LocationModal extends BasePage {

    private final By modal =
            By.cssSelector(".location-modal");

    private final By citySelect =
            By.id("locationCity");

    private final By streetInput =
            By.id("locationStreet");

    private final By streetNumberInput =
            By.id("locationStreetNumber");

    private final By additionalInfoInput =
            By.id("locationAdditionalInfo");

    private final By saveButton =
            By.cssSelector(".location-modal .save-button");

    public LocationModal(
            WebDriver driver,
            WebDriverWait wait
    ) {
        super(driver, wait);
    }

    public boolean isDisplayed() {
        return waitForVisible(modal).isDisplayed();
    }

    public LocationModal selectCity(String city) {
        Select select =
                new Select(waitForVisible(citySelect));

        select.selectByVisibleText(city);

        return this;
    }

    public LocationModal enterStreet(String street) {
        type(streetInput, street);
        return this;
    }

    public LocationModal enterStreetNumber(String number) {
        type(streetNumberInput, number);
        return this;
    }

    public LocationModal enterAdditionalInfo(String info) {
        type(additionalInfoInput, info);
        return this;
    }

    public void save() {
        click(saveButton);
        wait.until(ExpectedConditions.invisibilityOfElementLocated(modal));
    }
}