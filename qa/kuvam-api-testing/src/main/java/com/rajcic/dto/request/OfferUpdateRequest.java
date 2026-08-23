package com.rajcic.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class OfferUpdateRequest {

    private String name;
    private String description;
    private String category;
    private Double price;
    private Integer availableQuantity;
    private String unit;

    public OfferUpdateRequest() {
    }

    public OfferUpdateRequest(
            String name,
            String description,
            String category,
            Double price,
            Integer availableQuantity,
            String unit
    ) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.availableQuantity = availableQuantity;
        this.unit = unit;
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

    public Double getPrice() {
        return price;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}