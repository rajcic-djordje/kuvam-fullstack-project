package com.rajcic.pages.admin.constants;

public final class AdminUsersPageConstants {

    public static final String ADMIN_USERS_URL = "http://localhost:4200/admin/users";

    public static final String SEARCH_INPUT_SELECTOR =
            "input[aria-label='Pretraži korisnike']";

    public static final String USER_CARD_XPATH =
            "//article[contains(@class,'user-card')]" +
                    "[.//*[contains(@class,'user-details')]//span[normalize-space()=\"%s\"]]";

    public static final String USER_STATUS_BADGE_XPATH =
            USER_CARD_XPATH +
                    "//*[contains(@class,'status-badge')]";

    public static final String STATUS_BADGE_SELECTOR = ".status-badge";
    public static final String ACTIONS_BUTTON_SELECTOR = ".actions-button";

    public static final String SUSPEND_BUTTON_XPATH =
            ".//button[contains(normalize-space(),'Suspenduj korisnika')]";

    public static final String SUSPENSION_REASON_SELECTOR =
            ".user-modal .reason-field textarea";

    public static final String CONFIRM_BUTTON_SELECTOR =
            ".user-modal .confirm-button";

    public static final String SUSPENDED_STATUS_PART = "Suspend";

    private AdminUsersPageConstants() {
    }
}