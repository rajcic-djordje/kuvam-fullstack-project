package com.rajcic.dto.response;


import com.rajcic.dto.common.SuspendUser;

public class SuspensionResponse {


    private String message;
    private SuspendUser user;


    public SuspensionResponse() {}

    public SuspensionResponse(String message, SuspendUser user) {

        this.message = message;
        this.user = user;
    }


    public String getMessage() {

        return this.message;
    }

    public SuspendUser getUser() {
        return this.user;
    }
}