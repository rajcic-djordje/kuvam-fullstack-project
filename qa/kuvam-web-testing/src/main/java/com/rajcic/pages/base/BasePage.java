package com.rajcic.pages.base;

import org.openqa.selenium.By;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class BasePage {

    private final By toast = By.cssSelector(".toast");

    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage(WebDriver driver, WebDriverWait wait) {
        this.driver = driver;
        this.wait = wait;
    }

    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected WebElement waitForClickable(By locator) {
        return wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    protected boolean isLoaded(By locator) {
        return waitForVisible(locator).isDisplayed();
    }

    protected void click(By locator) {
        try {
            waitForClickable(locator).click();
        } catch (ElementClickInterceptedException exception) {
            if (driver.findElements(toast).isEmpty()) {
                throw exception;
            }

            wait.until(ExpectedConditions.invisibilityOfElementLocated(toast));
            waitForClickable(locator).click();
        }
    }

    protected void type(By locator, String value) {
        WebElement element = waitForVisible(locator);

        element.clear();
        element.sendKeys(value);
    }

    protected String getText(By locator) {
        return waitForVisible(locator).getText();
    }

    protected boolean isVisible(By locator) {
        return !driver.findElements(locator).isEmpty();
    }
}