package com.rajcic.pages.sellers.constants;

public final class SellerOrderDetailPageConstants {

    public static final String STATUS_BADGE_SELECTOR = ".seller-order-detail-page .status-badge";
    public static final String BUYER_EMAIL_SELECTOR = ".buyer-information a[href^='mailto:']";
    public static final String ACCEPT_BUTTON_SELECTOR = ".action-card .primary-button";

    public static final String ESTIMATED_PICKUP_INPUT_ID = "estimatedPickupAt";
    public static final String PICKUP_CODE_INPUT_ID = "pickupCode";

    public static final String CONFIRM_ACCEPT_BUTTON_XPATH =
            "//button[normalize-space()='Potvrdi prihvatanje']";

    public static final String MARK_READY_BUTTON_XPATH =
            "//button[contains(normalize-space(),'Označi kao spremno')]";

    public static final String COMPLETE_ORDER_BUTTON_XPATH =
            "//button[contains(normalize-space(),'Potvrdi preuzimanje')]";

    public static final String STATUS_ACCEPTED = "accepted";
    public static final String STATUS_READY = "ready";
    public static final String STATUS_COMPLETED = "completed";

    public static final String DATA_STATUS_ATTRIBUTE = "data-status";
    public static final String HREF_ATTRIBUTE = "href";
    public static final String MAILTO_PREFIX = "mailto:";

    public static final String PICKUP_DATE_TIME_PATTERN = "yyyy-MM-dd'T'HH:mm";

    public static final int ZERO_SECONDS = 0;
    public static final int ZERO_NANOS = 0;

    private SellerOrderDetailPageConstants() {
    }
}