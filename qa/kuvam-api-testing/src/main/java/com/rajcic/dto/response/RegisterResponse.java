package com.rajcic.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rajcic.dto.common.User;

public class RegisterResponse {


    @JsonProperty("message")
    private String message;

    @JsonProperty("user")
    private User user;


    public RegisterResponse() {}

    public RegisterResponse(String message, User user){

        this.message = message;
        this.user = user;
    }

    public String getMessage() {

        return this.message;
    }

    public User getUser() {

        return this.user;
    }
}
