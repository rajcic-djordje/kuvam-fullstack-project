package com.rajcic.requestbuilder.offers;

import com.rajcic.dto.request.OfferRequest;
import com.rajcic.dto.request.OfferUpdateRequest;
import com.rajcic.requestbuilder.offers.constants.OffersRequestBuilderConstants;
import com.rajcic.requestbuilder.orders.constants.OrdersRequestBuilderConstants;
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

    public static Response getMyOffers(String accessToken) {

        return RestAssured
                .given()
                .log().all()
                .spec(ReqSpecification.requestAuthNoBody(OffersRequestBuilderConstants.MY_OFFERS_PATH,accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response updateOffer(String id, OfferUpdateRequest body, String accessToken) {

        return RestAssured
                .given()
                .log().all()
                .spec(ReqSpecification.requestAuthBody(OffersRequestBuilderConstants.UPDATE_OFFER_PATH + id,body,accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response deleteOffer(String id,String accessToken) {

        return RestAssured
                .given()
                .log().all()
                .spec(ReqSpecification.requestAuthNoBody(OffersRequestBuilderConstants.DELETE_OFFER_PATH + id,accessToken))
                .when()
                .delete()
                .then()
                .extract()
                .response();
    }

    public static Response deactivateOffer(String offerId, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OffersRequestBuilderConstants.OFFER_PATH+offerId+ OffersRequestBuilderConstants.DEACTIVATE_OFFER_PATH, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response activateOffer(String offerId, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OffersRequestBuilderConstants.OFFER_PATH+offerId+ OffersRequestBuilderConstants.ACTIVATE_OFFER_PATH, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response getOffer(String id) {

        return RestAssured
                .given()
                .log().all()
                .spec(ReqSpecification.requestNoAuthNoBody(OffersRequestBuilderConstants.OFFER_PATH+id))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }
}
