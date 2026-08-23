package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BanUser {


        @JsonProperty("_id")
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private String status;

        private String banReason;
        private int offencesSinceLastBan;

        public BanUser() {
        }



    public BanUser (String id, String firstName, String lastName, String email, String role, String status, String banReason, int offencesSinceLastBan) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.status = status;
        this.banReason = banReason;
        this.offencesSinceLastBan = offencesSinceLastBan;
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

    public String getBanReason() {

            return this.banReason;
    }

    public int getOffencesSinceLastBan() {

            return this.offencesSinceLastBan;
    }

}
