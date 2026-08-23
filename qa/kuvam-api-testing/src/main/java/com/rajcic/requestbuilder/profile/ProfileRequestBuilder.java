package com.rajcic.requestbuilder.profile;

import com.rajcic.dto.request.ChangePasswordRequest;
import com.rajcic.dto.request.UpdateLocationRequest;
import com.rajcic.dto.request.UpdateProfileRequest;
import com.rajcic.requestbuilder.orders.constants.OrdersRequestBuilderConstants;
import com.rajcic.requestbuilder.profile.constants.ProfileRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ProfileRequestBuilder {

    public static Response updateMyProfile(UpdateProfileRequest body, String token) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(ProfileRequestBuilderConstants.UPDATE_MY_PROFILE_PATH,body, token))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response changeMyPassword(ChangePasswordRequest body, String token) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(ProfileRequestBuilderConstants.CHANGE_PASSWORD_PATH,body, token))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response updateMyLocation(UpdateLocationRequest request, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(ProfileRequestBuilderConstants.MY_LOCATION_PATH, request, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response deactivateMyAccount(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(ProfileRequestBuilderConstants.DEACTIVATE, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }


}
