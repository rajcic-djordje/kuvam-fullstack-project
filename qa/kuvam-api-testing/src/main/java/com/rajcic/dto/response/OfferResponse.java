package com.rajcic.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rajcic.dto.common.Offer;


public class OfferResponse {


    @JsonProperty("message")
    private String message;
    @JsonProperty("offer")
    private Offer offer;

    public OfferResponse() {
    }

    public OfferResponse(String message, Offer offer) {

        this.message =message;
        this.offer = offer;
    }



    public String getMessage() {
        return message;
    }

    public Offer getOffer() {
        return offer;
    }
}
