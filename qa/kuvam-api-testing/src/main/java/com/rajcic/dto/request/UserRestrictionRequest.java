package com.rajcic.dto.request;

public class UserRestrictionRequest {

    private final String reason;

    public UserRestrictionRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }
}