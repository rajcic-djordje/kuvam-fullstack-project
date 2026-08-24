package com.rajcic.pages.sellers.constants;

public final class SellerOrdersPageConstants {

    public static final String SELLER_ORDERS_URL = "http://localhost:4200/seller/orders";
    public static final String SELLER_ORDERS_PAGE_SELECTOR = ".seller-orders-page";

    public static final String ORDER_CARD_BY_NOTE_XPATH =
            "//article[contains(@class,'order-card')]" +
                    "[.//*[contains(@class,'buyer-note')]//p[normalize-space()=\"%s\"]]";

    public static final String STATUS_BADGE_SELECTOR = ".status-badge";
    public static final String DETAILS_LINK_SELECTOR = ".details-link";
    public static final String DATA_STATUS_ATTRIBUTE = "data-status";


}