package com.rajcic.dto.request;

public class ForgotPasswordRequest {


    private final String verificationEmail;



    public ForgotPasswordRequest(String email) {

        this.verificationEmail = email;
    }


    public String getVerificationEmail() {

        return this.verificationEmail;
    }
}
