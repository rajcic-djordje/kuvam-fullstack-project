package com.rajcic.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rajcic.dto.common.Order;

public class OrderResponse {

    @JsonProperty("message")
    private String message;
    @JsonProperty("order")
    private Order order;

    public OrderResponse() {
    }

    public OrderResponse(String message, Order order) {

        this.message =message;
        this.order = order;
    }



    public String getMessage() {
        return message;
    }

    public Order getOrder() {
        return order;
    }
}