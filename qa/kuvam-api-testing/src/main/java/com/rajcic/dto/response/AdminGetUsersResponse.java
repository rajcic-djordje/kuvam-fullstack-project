package com.rajcic.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rajcic.dto.common.User;

import java.util.List;

public class AdminGetUsersResponse {


    @JsonProperty("users")
    private List<User> users;


    public AdminGetUsersResponse() {}

    public AdminGetUsersResponse(List<User> users){
        this.users = users;
    }

    public List<User> getUsers() {
        return this.users;
    }
}
