package com.rajcic.dto.response;

import com.rajcic.dto.common.OrderSeller;

import java.util.List;

public class SellerOrdersResponse {

    private String message;
    private List<OrderSeller> orders;

    public SellerOrdersResponse() {
    }

    public String getMessage() {
        return message;
    }

    public List<OrderSeller> getOrders() {
        return orders;
    }
}