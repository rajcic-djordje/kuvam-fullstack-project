package com.rajcic.dto.common;

public class OrderItem {

    private String offer;
    private String name;
    private String category;
    private String imageUrl;
    private int quantity;
    private String unit;
    private double unitPrice;
    private double totalPrice;

    public OrderItem() {
    }

    public OrderItem(String offer, String name, String category, String imageUrl, int quantity, String unit, double unitPrice, double totalPrice)
    {
        this.offer = offer;
        this.name = name;
        this.category = category;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.unit = unit;
        this.unitPrice = unitPrice;
        this.totalPrice = totalPrice;
    }
    public String getOffer() {
        return offer;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getUnit() {
        return unit;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public double getTotalPrice() {
        return totalPrice;
    }
}