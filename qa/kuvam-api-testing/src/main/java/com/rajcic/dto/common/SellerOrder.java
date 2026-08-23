package com.rajcic.dto.common;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class SellerOrder {

    @JsonProperty("_id")
    private String id;

    private OrderBuyer buyer;
    private String seller;
    private List<SellerOrderItem> items;

    private double totalPrice;
    private String status;
    private String buyerNote;

    private String rejectionReason;
    private String estimatedPickupAt;
    private String buyerOnTheWayAt;

    private String createdAt;
    private String updatedAt;

    public SellerOrder() {
    }

    public SellerOrder(
            String id,
            OrderBuyer buyer,
            String seller,
            List<SellerOrderItem> items,
            double totalPrice,
            String status,
            String buyerNote,
            String rejectionReason,
            String estimatedPickupAt,
            String buyerOnTheWayAt,
            String createdAt,
            String updatedAt
    ) {
        this.id = id;
        this.buyer = buyer;
        this.seller = seller;
        this.items = items;
        this.totalPrice = totalPrice;
        this.status = status;
        this.buyerNote = buyerNote;
        this.rejectionReason = rejectionReason;
        this.estimatedPickupAt = estimatedPickupAt;
        this.buyerOnTheWayAt = buyerOnTheWayAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public OrderBuyer getBuyer() {
        return buyer;
    }

    public String getSeller() {
        return seller;
    }

    public List<SellerOrderItem> getItems() {
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

    public String getRejectionReason() {
        return rejectionReason;
    }

    public String getEstimatedPickupAt() {
        return estimatedPickupAt;
    }

    public String getBuyerOnTheWayAt() {
        return buyerOnTheWayAt;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }
}