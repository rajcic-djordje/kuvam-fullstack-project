package com.rajcic.pages.admin.constants;

public final class AdminReportsPageConstants {

    public static final String REPORTS_LINK_SELECTOR =
            ".admin-navigation a[href='/admin/reports']";

    public static final String SEARCH_INPUT_SELECTOR =
            "input[aria-label='Pretraži prijave']";

    public static final String ADMIN_REPORTS_URL_PART =
            "/admin/reports";

    public static final String REPORT_CARD_XPATH =
            "//article[contains(@class,'report-card')]" +
                    "[.//*[contains(@class,'reason-section')]//p[normalize-space()=\"%s\"]]";

    public static final String STATUS_BADGE_SELECTOR =
            ".status-badge";

    public static final String VIEW_BUTTON_SELECTOR =
            ".view-button";

    public static final String REPORT_MODAL_SELECTOR =
            ".report-modal";

    public static final String ADMIN_NOTE_SELECTOR =
            ".admin-note-field textarea";

    public static final String APPROVE_BUTTON_SELECTOR =
            ".report-modal .approve-button";

    public static final String STATUS_APPROVED =
            "Odobrena";

    public static final int EXPECTED_SEARCH_RESULT_COUNT =
            1;

    private AdminReportsPageConstants() {
    }
}