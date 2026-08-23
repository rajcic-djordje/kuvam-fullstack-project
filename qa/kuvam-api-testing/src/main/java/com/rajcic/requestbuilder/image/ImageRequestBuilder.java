package com.rajcic.requestbuilder.image;

import com.rajcic.requestbuilder.image.constants.ImageRequestBuilderConstants;
import com.rajcic.requestbuilder.offers.constants.OffersRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;

import java.io.File;


public class ImageRequestBuilder {

    public static Response uploadSellerProfileImage(File image, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthMultipart(ImageRequestBuilderConstants.PROFILE_IMAGE_PATH, accessToken))
                .multiPart("image", image, "image/png")
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response uploadSellerCoverImage(File image, String accessToken) {

        return RestAssured.
                given()
                .spec(ReqSpecification.requestAuthMultipart(ImageRequestBuilderConstants.SELLER_COVER_IMAGE_PATH, accessToken))
                .multiPart("image", image, "image/png")
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response uploadOfferImage(String offerId, File image, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthMultipart(OffersRequestBuilderConstants.OFFER_PATH + offerId + ImageRequestBuilderConstants.IMAGE_PATH, accessToken))
                .multiPart("image", image, "image/png")
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response removeSellerProfileImage(String accessToken) {

        return RestAssured.given().spec(ReqSpecification.requestAuthNoBody(ImageRequestBuilderConstants.SELLER_PROFILE_IMAGE_PATH, accessToken)
                )
                .when()
                .delete()
                .then()
                .extract()
                .response();
    }

    public static Response removeSellerCoverImage(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(ImageRequestBuilderConstants.SELLER_COVER_IMAGE_PATH, accessToken))
                .when()
                .delete()
                .then()
                .extract()
                .response();
    }

    public static Response removeOfferImage(String offerId, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(OffersRequestBuilderConstants.OFFER_PATH + offerId + ImageRequestBuilderConstants.IMAGE_PATH, accessToken))
                .when()
                .delete()
                .then()
                .extract()
                .response();
    }
}