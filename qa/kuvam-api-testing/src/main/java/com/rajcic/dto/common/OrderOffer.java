package com.rajcic.dto.common;
import com.fasterxml.jackson.annotation.JsonProperty;

public class OrderOffer {

    @JsonProperty("_id")
    private String id;

    private String name;
    private String category;
    private String unit;
    private String imageUrl;

    public OrderOffer() {
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getUnit() {
        return unit;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}