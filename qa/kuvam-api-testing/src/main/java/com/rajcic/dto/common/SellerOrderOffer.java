package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SellerOrderOffer {

    @JsonProperty("_id")
    private String id;

    private String name;
    private String description;
    private String category;
    private String unit;
    private String imageUrl;

    @JsonProperty("isActive")
    private boolean active;

    public SellerOrderOffer() {
    }

    public SellerOrderOffer(
            String id,
            String name,
            String description,
            String category,
            String unit,
            String imageUrl,
            boolean active
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.unit = unit;
        this.imageUrl = imageUrl;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
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

    public boolean isActive() {
        return active;
    }
}