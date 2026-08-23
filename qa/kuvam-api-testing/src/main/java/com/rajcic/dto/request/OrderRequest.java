package com.rajcic.dto.request;

import java.util.List;

public class OrderRequest {

    private final List<OrderItemRequest> items;
    private final String buyerNote;

    public OrderRequest(List<OrderItemRequest> items, String buyerNote) {
        this.items = items;
        this.buyerNote = buyerNote;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public String getBuyerNote() {
        return buyerNote;
    }
}