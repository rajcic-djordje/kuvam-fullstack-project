package com.rajcic.pages.offers;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.offers.constants.OffersPageConstants.*;

public class OffersPage extends BasePage {

    private final By sellersGrid =
            By.cssSelector(SELLERS_GRID_SELECTOR);

    private final By sellerCard =
            By.cssSelector(SELLER_CARD_SELECTOR);

    public OffersPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public OffersPage open() {
        driver.get(OFFERS_URL);
        waitForVisible(sellersGrid);

        return this;
    }

    public boolean hasSellers() {
        waitForVisible(sellersGrid);
        return !driver.findElements(sellerCard).isEmpty();
    }

    public void openSeller(String sellerName) {
        By sellerButton =
                By.xpath(String.format(SELLER_BUTTON_XPATH, sellerName));

        click(sellerButton);
    }
}