package com.rajcic.dto.response;

import com.rajcic.dto.common.Offer;

import java.util.List;

public class SellerOffersResponse {

    private String message;
    private List<Offer> offers;

    public SellerOffersResponse() {
    }

    public String getMessage() {
        return message;
    }

    public List<Offer> getOffers() {
        return offers;
    }
}