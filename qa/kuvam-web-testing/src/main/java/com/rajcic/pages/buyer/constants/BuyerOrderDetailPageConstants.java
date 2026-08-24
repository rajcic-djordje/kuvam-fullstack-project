package com.rajcic.pages.buyer.constants;

public final class BuyerOrderDetailPageConstants {

    public static final String STATUS_BADGE_SELECTOR = ".order-detail-page .status-badge";
    public static final String LOCKED_LOCATION_SELECTOR = ".locked-location";
    public static final String PICKUP_CITY_SELECTOR = ".pickup-address .city-name";
    public static final String PICKUP_STREET_SELECTOR = ".pickup-address > strong";
    public static final String PICKUP_CODE_SELECTOR = ".pickup-code";
    public static final String ON_THE_WAY_BUTTON_SELECTOR = ".on-the-way-button";
    public static final String ON_THE_WAY_CONFIRMATION_SELECTOR = ".on-the-way-confirmation";
    public static final String REVIEW_BUTTON_SELECTOR = ".review-button";
    public static final String FIVE_STAR_BUTTON_SELECTOR = ".rating-star[aria-label='5 od 5']";
    public static final String REVIEW_COMMENT_ID = "reviewComment";
    public static final String REVIEW_SUBMIT_BUTTON_SELECTOR = ".review-submit-button";
    public static final String REVIEW_MODAL_SELECTOR = ".review-modal";
    public static final String REPORT_BUTTON_SELECTOR = ".report-button";
    public static final String REPORT_REASON_ID = "reportReason";
    public static final String REPORT_DESCRIPTION_ID = "reportDescription";
    public static final String REPORT_SUBMIT_BUTTON_SELECTOR = ".report-submit-button";
    public static final String REPORT_MODAL_SELECTOR = ".report-modal";

    public static final String DATA_STATUS_ATTRIBUTE = "data-status";
    public static final String PICKUP_CODE_REGEX = "\\d{6}";

    private BuyerOrderDetailPageConstants() {
    }
}