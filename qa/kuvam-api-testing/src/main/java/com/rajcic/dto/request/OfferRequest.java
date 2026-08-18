package com.rajcic.dto.request;

public class OfferRequest {


    private final String name;
    private final String description;
    private final String category;
    private final double price;
    private final int availableQuantity;
    private final String unit;


    public OfferRequest(String name, String description, String category, double price, int availableQuantity, String unit) {

        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.availableQuantity = availableQuantity;
        this.unit = unit;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public String getCategory() {
        return this.category;
    }

    public double getPrice() {
        return this.price;
    }

    public int getAvailableQuantity() {
        return this.availableQuantity;
    }

    public String getUnit() {
        return this.unit;
    }
}
