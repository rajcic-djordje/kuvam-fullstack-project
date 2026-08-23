package com.rajcic.requestbuilder.city;

import com.rajcic.requestbuilder.city.constants.CityRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;



public class CityRequestBuilder {

    public static Response getCities() {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestNoAuthNoBody(CityRequestBuilderConstants.CITIES_PATH))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }
}