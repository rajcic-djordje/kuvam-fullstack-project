package com.rajcic.dto.common;

public class BuyerOrderItem {

    private OrderOffer offer;
    private String name;
    private String category;
    private String imageUrl;
    private int quantity;
    private String unit;
    private double unitPrice;
    private double totalPrice;

    public BuyerOrderItem() {
    }

    public OrderOffer getOffer() {
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