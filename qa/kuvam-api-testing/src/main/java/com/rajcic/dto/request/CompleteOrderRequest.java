package com.rajcic.dto.request;

public class CompleteOrderRequest {

    private final String pickupCode;

    public CompleteOrderRequest(String pickupCode) {
        this.pickupCode = pickupCode;
    }

    public String getPickupCode() {
        return pickupCode;
    }
}