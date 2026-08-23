package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderSeller {

    @JsonProperty("_id")
    private String id;

    private String businessName;

    public OrderSeller() {
    }

    public String getId() {
        return id;
    }

    public String getBusinessName() {
        return businessName;
    }
}