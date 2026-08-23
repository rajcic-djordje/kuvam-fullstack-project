package com.rajcic.requestbuilder.admin;

import com.rajcic.dto.request.UserRestrictionRequest;
import com.rajcic.requestbuilder.admin.constants.AdminRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class AdminRequestBuilder {

    public static Response getUsers(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(AdminRequestBuilderConstants.GET_USERS_PATH,accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }


    public static Response suspendUser(String id, UserRestrictionRequest body, String accessToken ) {

        return RestAssured
                .given()
                .log().all()
                .spec(ReqSpecification.requestAuthBody(AdminRequestBuilderConstants.GET_USER_PATH + id + AdminRequestBuilderConstants.SUSPEND_USER,body,accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response unsuspendUser(String id, String accessToken ) {

        return RestAssured
                .given()
                .log().all()
                .spec(ReqSpecification.requestAuthNoBody(AdminRequestBuilderConstants.GET_USER_PATH + id + AdminRequestBuilderConstants.UNSUSPEND_USER,accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response banUser(String id, UserRestrictionRequest body, String accessToken ) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(AdminRequestBuilderConstants.GET_USER_PATH + id + AdminRequestBuilderConstants.BAN_USER,body,accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response unbanUser(String id, String accessToken ) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(AdminRequestBuilderConstants.GET_USER_PATH + id + AdminRequestBuilderConstants.UNBAN_USER,accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response approveSeller(String sellerId, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(AdminRequestBuilderConstants.SELLERS_PATH + sellerId + AdminRequestBuilderConstants.APPROVE_SELLER, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response rejectSeller(String sellerId, UserRestrictionRequest body, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(AdminRequestBuilderConstants.SELLERS_PATH + sellerId + AdminRequestBuilderConstants.REJECT_SELLER, body, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response getPendingSellers(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(AdminRequestBuilderConstants.PENDING_SELLERS_PATH, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }
}
