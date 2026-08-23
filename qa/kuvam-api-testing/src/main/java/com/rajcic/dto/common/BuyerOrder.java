package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class BuyerOrder {

    @JsonProperty("_id")
    private String id;

    private String buyer;
    private OrderSeller seller;
    private List<BuyerOrderItem> items;
    private double totalPrice;
    private String status;
    private String buyerNote;
    private String buyerOnTheWayAt;

    public BuyerOrder() {
    }

    public String getId() {
        return id;
    }

    public String getBuyer() {
        return buyer;
    }

    public OrderSeller getSeller() {
        return seller;
    }

    public List<BuyerOrderItem> getItems() {
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

    public String getBuyerOnTheWayAt() {
        return buyerOnTheWayAt;
    }
}