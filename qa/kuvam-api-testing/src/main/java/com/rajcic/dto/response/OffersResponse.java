package com.rajcic.dto.response;

import com.rajcic.dto.common.Offer;

import java.util.List;

public class OffersResponse {

    private String message;
    private List<Offer> offers;

    public OffersResponse() {
    }

    public String getMessage() {
        return message;
    }

    public List<Offer> getOffers() {
        return offers;
    }
}