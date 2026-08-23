package com.rajcic.dto.request;

public class AcceptOrderRequest {

    private final String estimatedPickupAt;

    public AcceptOrderRequest(String estimatedPickupAt) {
        this.estimatedPickupAt = estimatedPickupAt;
    }

    public String getEstimatedPickupAt() {
        return estimatedPickupAt;
    }
}