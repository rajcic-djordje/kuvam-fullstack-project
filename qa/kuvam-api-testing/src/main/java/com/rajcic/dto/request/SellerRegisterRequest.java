package com.rajcic.dto.request;

import jdk.jfr.Description;

public class SellerRegisterRequest {


    private final String email;
    private final String firstName;
    private final String lastName;
    private final String password;
    private final String role;
    private final String businessName;
    private final String description;


    public SellerRegisterRequest (String email, String firstName, String lastName,
                                  String password, String role, String businessName, String description) {

        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.role = role;
        this.businessName = businessName;
        this.description = description;
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


    public String getBusinessName() {

        return this.businessName;
    }

    public String getDescription() {

        return this.description;
    }
}
