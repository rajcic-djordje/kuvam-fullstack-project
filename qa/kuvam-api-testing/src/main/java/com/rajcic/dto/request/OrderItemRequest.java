package com.rajcic.dto.request;

public class OrderItemRequest {

    private final String offerId;
    private final int quantity;

    public OrderItemRequest(String offerId, int quantity) {
        this.offerId = offerId;
        this.quantity = quantity;
    }

    public String getOfferId() {
        return offerId;
    }

    public int getQuantity() {
        return quantity;
    }
}