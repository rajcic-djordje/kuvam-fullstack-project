package com.rajcic.requestbuilder.auth;

import com.rajcic.dto.request.BuyerRegisterRequest;
import com.rajcic.dto.request.ForgotPasswordRequest;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.SellerRegisterRequest;
import com.rajcic.requestbuilder.auth.constants.AuthRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class AuthRequestBuilder {



    public static Response login(LoginRequest body) {

        return RestAssured
                .given()
                .log().all()
                .spec(ReqSpecification.requestNoAuthBody(AuthRequestBuilderConstants.LOGIN_PATH, body))
                .when()
                .post()
                .then()
                .extract()
                .response();

    }


    public static Response adminLogin(LoginRequest body) {
        return RestAssured
                .given()
                .spec(ReqSpecification.requestNoAuthBody(AuthRequestBuilderConstants.ADMIN_LOGIN_PATH, body))
                .when()
                .post()
                .then()
                .extract()
                .response();
    }

    public static Response buyerRegister(BuyerRegisterRequest body) {
        return RestAssured
                .given()
                .spec(ReqSpecification.requestNoAuthBody(AuthRequestBuilderConstants.REGISTER_PATH, body))
                .when()
                .post()
                .then()
                .extract()
                .response();

    }

    public static Response sellerRegister(SellerRegisterRequest body) {
        return RestAssured
                .given()
                .spec(ReqSpecification.requestNoAuthBody(AuthRequestBuilderConstants.REGISTER_PATH, body))
                .when()
                .post()
                .then()
                .extract()
                .response();
    }

    public static Response refreshToken() {
        //TODO

        return null;
    }

    public static Response forgotPassword(ForgotPasswordRequest body) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestNoAuthBody(AuthRequestBuilderConstants.FORGOT_PASSWORD_PATH, body))
                .when()
                .post()
                .then()
                .extract()
                .response();

    }

    public static Response protectedRouteAccess() {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestNoAuthNoBody(AuthRequestBuilderConstants.PROTECTED_PATH))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response logout(String refreshToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(AuthRequestBuilderConstants.LOGOUT_PATH,refreshToken))
                .when()
                .post()
                .then()
                .extract()
                .response();
    }
}
