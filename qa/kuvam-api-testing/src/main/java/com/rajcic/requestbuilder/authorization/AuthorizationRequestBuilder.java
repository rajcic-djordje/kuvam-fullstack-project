package com.rajcic.requestbuilder.authorization;

import com.rajcic.requestbuilder.authorization.constants.AuthorizationRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class AuthorizationRequestBuilder {


    public static Response adminGetUsers(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(AuthorizationRequestBuilderConstants.ADMIN_GET_USERS_PATH,accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }
}
