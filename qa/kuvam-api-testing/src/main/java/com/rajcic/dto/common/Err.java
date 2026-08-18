package com.rajcic.dto.common;

public class Err {


    private String code;
    private String message;

    public Err() {}

    public Err(String code, String message) {

        this.code = code;
        this.message = message;
    }

    public String getCode() {

        return this.code;
    }

    public String getMessage() {

        return this.message;
    }

}
