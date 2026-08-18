package com.rajcic.requestbuilder.offers;

import com.rajcic.dto.request.OfferRequest;
import com.rajcic.requestbuilder.offers.constants.OffersRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class OffersRequestBuilder {

    public static Response createOffer(OfferRequest body, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(OffersRequestBuilderConstants.CREATE_OFFER_PATH,body,accessToken))
                .when()
                .post()
                .then()
                .extract()
                .response();
    }
}
