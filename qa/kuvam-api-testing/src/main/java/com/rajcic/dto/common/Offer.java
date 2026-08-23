package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Offer {

    @JsonProperty("_id")
    private String id;

    private String name;
    private String description;
    private String category;
    private double price;
    private int availableQuantity;
    private String unit;
    @JsonProperty("isActive")
    private boolean isActive;

    public Offer() {
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

    public double getPrice() {
        return price;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public boolean isActive() {
        return isActive;
    }
}