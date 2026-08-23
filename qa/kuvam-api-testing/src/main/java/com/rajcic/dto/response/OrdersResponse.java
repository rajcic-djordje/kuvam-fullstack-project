package com.rajcic.dto.response;

import com.rajcic.dto.common.BuyerOrder;


import java.util.List;

public class OrdersResponse {

    private String message;
    private List<BuyerOrder> orders;

    public OrdersResponse() {
    }

    public String getMessage() {
        return message;
    }

    public List<BuyerOrder> getOrders() {
        return orders;
    }
}