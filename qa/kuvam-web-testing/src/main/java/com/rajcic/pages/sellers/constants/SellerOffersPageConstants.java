package com.rajcic.pages.sellers.constants;

public final class SellerOffersPageConstants {

    public static final String SELLER_OFFERS_URL = "http://localhost:4200/seller/offers";
    public static final String SELLER_OFFERS_PAGE_SELECTOR = ".seller-offers-page";
    public static final String LOADER_SELECTOR = ".seller-offers-page .loader";

    public static final String OFFER_CARD_XPATH =
            "//article[contains(@class,'offer-card')][.//h2[normalize-space()=\"%s\"]]";

    public static final String STATUS_BADGE_SELECTOR = ".status-badge";
    public static final String OFFER_DETAILS_SELECTOR = ".offer-details > div";
    public static final String STRONG_TAG = "strong";

    public static final String DEACTIVATE_ACTION_SELECTOR = ".status-action.deactivate";
    public static final String ACTIVATE_ACTION_SELECTOR = ".status-action.activate";
    public static final String DELETE_ACTION_SELECTOR = ".delete-action";

    public static final String STATUS_INACTIVE = "Neaktivna";
    public static final String STATUS_ACTIVE = "Aktivna";

    public static final int PRICE_INDEX = 0;
    public static final int QUANTITY_INDEX = 1;

    private SellerOffersPageConstants() {
    }
}