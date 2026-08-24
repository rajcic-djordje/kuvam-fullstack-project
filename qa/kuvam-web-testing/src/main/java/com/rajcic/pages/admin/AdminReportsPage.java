package com.rajcic.pages.admin;

import com.rajcic.pages.base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.rajcic.pages.admin.constants.AdminReportsPageConstants.*;

public class AdminReportsPage extends BasePage {

    private final By reportsLink = By.cssSelector(REPORTS_LINK_SELECTOR);
    private final By searchInput = By.cssSelector(SEARCH_INPUT_SELECTOR);
    private final By statusBadge = By.cssSelector(STATUS_BADGE_SELECTOR);
    private final By viewButton = By.cssSelector(VIEW_BUTTON_SELECTOR);
    private final By reportModal = By.cssSelector(REPORT_MODAL_SELECTOR);
    private final By adminNote = By.cssSelector(ADMIN_NOTE_SELECTOR);
    private final By approveButton = By.cssSelector(APPROVE_BUTTON_SELECTOR);

    public AdminReportsPage(WebDriver driver, WebDriverWait wait) {
        super(driver, wait);
    }

    public AdminReportsPage open() {
        click(reportsLink);
        wait.until(ExpectedConditions.urlContains(ADMIN_REPORTS_URL_PART));
        waitForVisible(searchInput);

        return this;
    }

    private By reportCard(String description) {
        return By.xpath(String.format(REPORT_CARD_XPATH, description));
    }

    private WebElement getReportCard(String description) {
        return waitForVisible(reportCard(description));
    }

    public void search(String description) {
        type(searchInput, description);
        wait.until(driver -> driver.findElements(reportCard(description)).size() == EXPECTED_SEARCH_RESULT_COUNT);
    }

    public String getStatus(String description) {
        return getReportCard(description)
                .findElement(statusBadge)
                .getText();
    }

    public void approveReport(String description, String adminNoteValue) {
        WebElement card = getReportCard(description);

        card.findElement(viewButton).click();

        waitForVisible(reportModal);

        type(adminNote, adminNoteValue);
        click(approveButton);

        wait.until(ExpectedConditions.invisibilityOfElementLocated(reportModal));
        wait.until(driver -> getStatus(description).equals(STATUS_APPROVED));
    }
}