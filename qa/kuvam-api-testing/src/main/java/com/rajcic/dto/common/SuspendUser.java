package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SuspendUser {

    @JsonProperty("_id")
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String status;

    private String suspensionReason;
    private String suspendedAt;

    public SuspendUser() {
    }

    public SuspendUser(
            String id,
            String firstName,
            String lastName,
            String email,
            String role,
            String status,
            String suspensionReason,
            String suspendedAt
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.suspensionReason = suspensionReason;
        this.suspendedAt = suspendedAt;
    }

    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public String getSuspensionReason() {
        return suspensionReason;
    }

    public String getSuspendedAt() {
        return suspendedAt;
    }
}