package com.rajcic.dto.response;

import com.rajcic.dto.common.User;

public class UpdateProfileResponse {

    private String message;
    private User user;

    public UpdateProfileResponse() {
    }

    public String getMessage() {
        return message;
    }

    public User getUser() {
        return user;
    }
}