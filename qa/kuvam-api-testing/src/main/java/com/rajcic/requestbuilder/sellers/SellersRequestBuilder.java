package com.rajcic.requestbuilder.sellers;


import com.rajcic.requestbuilder.sellers.constants.SellersRequestBuilderConstants;
import io.restassured.RestAssured;
import io.restassured.response.Response;

import static com.rajcic.specification.ReqSpecification.requestAuthNoBody;
import static com.rajcic.specification.ReqSpecification.requestNoAuthNoBody;

public class SellersRequestBuilder {


        public static Response getMySellerProfile(String accessToken) {

            return RestAssured
                    .given()
                    .spec(requestAuthNoBody(SellersRequestBuilderConstants.MY_SELLER_PROFILE_PATH, accessToken))
                    .when()
                    .get()
                    .then()
                    .extract()
                    .response();
        }

    public static Response getPublicSellers() {

        return RestAssured
                .given()
                .spec(requestNoAuthNoBody(SellersRequestBuilderConstants.SELLERS_PATH))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response getPublicSellers(String search, String category) {

        return RestAssured
                .given()
                .queryParam("search", search)
                .queryParam("category", category)
                .spec(requestNoAuthNoBody(SellersRequestBuilderConstants.SELLERS_PATH))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response getPublicSellersBySearch(String search) {

        return RestAssured
                .given()
                .queryParam("search", search)
                .spec(requestNoAuthNoBody(SellersRequestBuilderConstants.SELLERS_PATH))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }
}
