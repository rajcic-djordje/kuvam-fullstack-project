package com.rajcic.pages.sellers;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.sellers.constants.SellerPageConstants.OFFER_BUTTON_XPATH;

public class SellerPage extends BasePage {

    public SellerPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public void openOffer(String offerName) {
        By offerButton = By.xpath(String.format(OFFER_BUTTON_XPATH, offerName));
        click(offerButton);
    }
}