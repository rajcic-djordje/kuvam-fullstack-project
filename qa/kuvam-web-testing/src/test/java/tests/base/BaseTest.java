package tests.base;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeSuite;

import java.time.Duration;

import static tests.base.BaseTestConstants.*;

public class BaseTest {

    protected static WebDriver driver;
    protected static WebDriverWait wait;

    @BeforeSuite
    public void setUp() {
        if (driver != null) {
            return;
        }

        driver = new FirefoxDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().window().maximize();
    }

    @BeforeMethod
    public void resetApplicationState() {
        driver.get(HOME_URL);

        logoutCurrentSession();

        driver.manage().deleteAllCookies();

        ((JavascriptExecutor) driver).executeScript(CLEAR_BROWSER_STORAGE_SCRIPT);

        driver.get(BLANK_PAGE_URL);
    }

    protected void clearCurrentSession() {
        driver.get(HOME_URL);
        logoutCurrentSession();
        driver.manage().deleteAllCookies();
        ((JavascriptExecutor) driver).executeScript(CLEAR_BROWSER_STORAGE_SCRIPT);
        driver.get(BLANK_PAGE_URL);
        driver.get(LOGIN_URL);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id(EMAIL_INPUT_ID)));
    }

    private void logoutCurrentSession() {
        ((JavascriptExecutor) driver).executeAsyncScript(LOGOUT_SCRIPT);
    }

    @AfterSuite
    public void tearDown() {
        if (driver != null) {
            driver.quit();
            driver = null;
            wait = null;
        }
    }
}