package com.rajcic.requestbuilder.orders;

import com.rajcic.dto.request.AcceptOrderRequest;
import com.rajcic.dto.request.CompleteOrderRequest;
import com.rajcic.dto.request.OrderRequest;
import com.rajcic.dto.request.RejectOrderRequest;
import com.rajcic.dto.response.OrderResponse;
import com.rajcic.requestbuilder.orders.constants.OrdersRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;


public class OrdersRequestBuilder {


    public static Response getMyOrders( String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OrdersRequestBuilderConstants.MY_ORDERS_PATH,accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response createOrder(OrderRequest body, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(OrdersRequestBuilderConstants.CREATE_ORDER_PATH, body, accessToken))
                .when()
                .post()
                .then()
                .extract()
                .response();
    }

    public static Response getMyOrder( String id, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OrdersRequestBuilderConstants.MY_ORDER_PATH+id, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response getMyRecievedOrder(String id, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OrdersRequestBuilderConstants.GET_RECEIVED_ORDER_PATH+id, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response getMyRecievedOrders(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OrdersRequestBuilderConstants.GET_RECEIVED_ORDER_PATH, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response cancelMyOrder(String orderId, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OrdersRequestBuilderConstants.MY_ORDER_PATH+orderId+ OrdersRequestBuilderConstants.CANCEL_MY_ORDER_PATH, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response acceptOrder(String orderId, AcceptOrderRequest body, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(OrdersRequestBuilderConstants.RECEIVED_ORDERS_PATH+orderId+ OrdersRequestBuilderConstants.ACCEPT_ORDER_PATH,body, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response rejectOrder(String orderId, RejectOrderRequest body, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(OrdersRequestBuilderConstants.RECEIVED_ORDERS_PATH+orderId+ OrdersRequestBuilderConstants.REJECT_ORDER_PATH,body, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response markOrderAsReady(String orderId, String token) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OrdersRequestBuilderConstants.RECEIVED_ORDERS_PATH+orderId+ OrdersRequestBuilderConstants.READY_ORDER_PATH, token))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response markMyOrderAsOnTheWay(String orderId, String token) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OrdersRequestBuilderConstants.MY_ORDER_PATH+orderId+ OrdersRequestBuilderConstants.ON_THE_WAY_ORDER_PATH, token))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }


    public static Response completeOrder(String orderId, CompleteOrderRequest completeOrderRequest, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(OrdersRequestBuilderConstants.RECEIVED_ORDERS_PATH+orderId+ OrdersRequestBuilderConstants.COMPLETE_ORDER_PATH, completeOrderRequest,accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }
}



