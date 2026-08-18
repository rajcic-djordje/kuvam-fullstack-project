package com.rajcic.dto.common;

public class User {


    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String status;

    public User() {}

    public User (String id, String firstName, String lastName, String email, String role, String status) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public String getFirstName() {

        return this.firstName;
    }

    public String getLastName() {

        return this.lastName;
    }

    public String getId() {

        return this.id;
    }

    public String getEmail() {

        return this.email;
    }

    public String getRole() {

        return this.role;
    }

    public String getStatus() {

        return this.status;
    }

}
