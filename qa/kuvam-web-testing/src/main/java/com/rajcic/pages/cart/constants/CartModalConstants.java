package com.rajcic.pages.cart.constants;

public final class CartModalConstants {

    public static final String MODAL_SELECTOR = ".cart-modal";
    public static final String CART_ITEM_SELECTOR = ".cart-item";
    public static final String ITEM_NAME_SELECTOR = ".cart-item h3";
    public static final String QUANTITY_SELECTOR = ".cart-item .quantity-control span";
    public static final String INCREASE_QUANTITY_BUTTON_SELECTOR = ".cart-item button[aria-label='Povećaj količinu']";
    public static final String DECREASE_QUANTITY_BUTTON_SELECTOR = ".cart-item button[aria-label='Smanji količinu']";
    public static final String BUYER_NOTE_ID = "cartBuyerNote";
    public static final String TOTAL_PRICE_SELECTOR = ".cart-total strong";
    public static final String CONFIRM_BUTTON_SELECTOR = ".confirm-button";

    private CartModalConstants() {
    }
}