package com.rajcic.dto.response;

import com.rajcic.dto.common.BanUser;

public class BanResponse {


    private String message;
    private BanUser user;


    public BanResponse() {}

    public BanResponse(String message, BanUser user) {

        this.message = message;
        this.user = user;
    }


    public String getMessage() {

        return this.message;
    }

    public BanUser getUser() {
        return this.user;
    }
}
