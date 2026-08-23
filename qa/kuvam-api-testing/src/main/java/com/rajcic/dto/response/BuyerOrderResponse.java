package com.rajcic.dto.response;

import com.rajcic.dto.common.BuyerOrder;

public class BuyerOrderResponse {

    private String message;
    private BuyerOrder order;

    public BuyerOrderResponse() {
    }

    public String getMessage() {
        return message;
    }

    public BuyerOrder getOrder() {
        return order;
    }
}