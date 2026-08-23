package com.rajcic.dto.response;

import com.rajcic.dto.common.SellerOrder;

public class SellerOrderResponse {

    private String message;
    private SellerOrder order;

    public SellerOrderResponse() {
    }

    public String getMessage() {
        return message;
    }

    public SellerOrder getOrder() {
        return order;
    }
}