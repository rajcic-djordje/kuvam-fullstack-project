package com.rajcic.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rajcic.dto.common.Err;

public class ErrorResponse {


    @JsonProperty("error")
    private Err error;

    public ErrorResponse() {}

    public ErrorResponse(Err error){

        this.error = error;
    }


    public Err getError() {

        return this.error;
    }

}
