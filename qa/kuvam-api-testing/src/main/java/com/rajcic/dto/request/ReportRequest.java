package com.rajcic.dto.request;

public class ReportRequest {

    private final String orderId;
    private final String reason;
    private final String description;

    public ReportRequest(String orderId, String reason, String description) {
        this.orderId = orderId;
        this.reason = reason;
        this.description = description;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getReason() {
        return reason;
    }

    public String getDescription() {
        return description;
    }
}