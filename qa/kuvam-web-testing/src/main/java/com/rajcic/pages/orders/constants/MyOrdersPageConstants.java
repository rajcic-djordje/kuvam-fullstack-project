package com.rajcic.pages.orders.constants;

public final class MyOrdersPageConstants {

    public static final String ORDERS_URL = "http://localhost:4200/orders";
    public static final String MY_ORDERS_PAGE_SELECTOR = ".my-orders-page";

    public static final String ORDER_CARD_BY_NOTE_XPATH =
            "//article[contains(@class,'order-card')]" +
                    "[.//*[contains(@class,'buyer-note')]//p[normalize-space()=\"%s\"]]";

    public static final String STATUS_BADGE_SELECTOR = ".status-badge";
    public static final String ORDER_TOTAL_SELECTOR = ".order-total strong";
    public static final String DETAILS_LINK_SELECTOR = ".details-link";

    public static final String DATA_STATUS_ATTRIBUTE = "data-status";

    private MyOrdersPageConstants() {
    }
}