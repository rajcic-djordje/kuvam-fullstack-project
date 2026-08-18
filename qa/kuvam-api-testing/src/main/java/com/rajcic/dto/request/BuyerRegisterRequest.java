package com.rajcic.dto.request;

public class BuyerRegisterRequest {

    private final String email;
    private final String firstName;
    private final String lastName;
    private final String password;
    private final String role;


    public BuyerRegisterRequest (String email, String firstName, String lastName, String password, String role) {

        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.role = role;
    }

    public String getEmail() {

        return this.email;
    }

    public String getFirstName() {

        return this.firstName;
    }

    public String getLastName() {

        return this.lastName;
    }

    public String getPassword() {

        return this.password;
    }

    public String getRole() {

        return this.role;
    }
}
