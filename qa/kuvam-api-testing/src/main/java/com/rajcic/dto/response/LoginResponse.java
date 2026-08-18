package com.rajcic.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rajcic.dto.common.User;

public class LoginResponse {


    @JsonProperty("message")
    private String message;

    @JsonProperty("user")
    private User user;

    @JsonProperty("accessToken")
    private String accessToken;


    public LoginResponse() {}

    public LoginResponse( String message, User user, String token) {

        this.message = message;
        this.user = user;
        this.accessToken = token;
    }


    public String getMessage () {

        return this.message;
    }

    public User getUser() {

        return this.user;
    }

    public String getAccessToken() {

        return this.accessToken;
    }


}
