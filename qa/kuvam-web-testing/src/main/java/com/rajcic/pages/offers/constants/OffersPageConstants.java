package com.rajcic.pages.offers.constants;

public final class OffersPageConstants {

    public static final String OFFERS_URL =
            "http://localhost:4200/offers";

    public static final String SELLERS_GRID_SELECTOR =
            ".sellers-grid";

    public static final String SELLER_CARD_SELECTOR =
            ".seller-card";

    public static final String SELLER_BUTTON_XPATH =
            "//article[contains(@class,'seller-card')]" +
                    "[.//h3[normalize-space()='%s']]" +
                    "//a[contains(@class,'seller-button')]";

    private OffersPageConstants() {
    }
}