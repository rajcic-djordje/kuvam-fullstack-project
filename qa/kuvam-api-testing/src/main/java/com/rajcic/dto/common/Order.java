package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Order {

    @JsonProperty("_id")
    private String id;
    private String buyer;
    private String seller;
    private List<OrderItem> items;
    private double totalPrice;
    private String status;
    private String buyerNote;

    public Order() {
    }

    public Order(String id, String buyer, String seller, List<OrderItem> items, double totalPrice, String status, String buyerNote) {
        this.id = id;
        this.buyer = buyer;
        this.seller = seller;
        this.items = items;
        this.totalPrice = totalPrice;
        this.status = status;
        this.buyerNote = buyerNote;
    }

    public String getId() {
        return id;
    }

    public String getBuyer() {
        return buyer;
    }

    public String getSeller() {
        return seller;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public String getBuyerNote() {
        return buyerNote;
    }
}