package com.rajcic.dto.request;

public class RejectOrderRequest {

    private final String rejectionReason;

    public RejectOrderRequest(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }
}