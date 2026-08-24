package com.rajcic.pages.admin.constants;

public final class AdminPendingSellersPageConstants {

    public static final String PENDING_SELLERS_LINK_SELECTOR =
            ".admin-navigation a[href='/admin/pending-sellers']";

    public static final String SEARCH_INPUT_SELECTOR =
            "input[aria-label='Pretraži prijave prodavaca']";

    public static final String PENDING_SELLERS_URL_PART =
            "/admin/pending-sellers";

    public static final String SELLER_CARD_XPATH =
            "//article[contains(@class,'seller-card')]" +
                    "[.//*[contains(@class,'owner-email')][normalize-space()=\"%s\"]]";

    public static final String ACTIONS_BUTTON_SELECTOR =
            ".actions-button";

    public static final String APPROVE_ACTION_SELECTOR =
            ".approve-action";

    public static final String SELLER_MODAL_SELECTOR =
            ".seller-modal";

    public static final String CONFIRM_BUTTON_SELECTOR =
            ".seller-modal .confirm-button";

    private AdminPendingSellersPageConstants() {
    }
}