package tests.location;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.UpdateLocationRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.city.CityRequestBuilder;
import com.rajcic.requestbuilder.profile.ProfileRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.location.constants.LocationTestConstants;

public class LocationTest extends BaseTest {


    @Test
    public void buyerSuccessfullyUpdatesLocationTest() {

        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                LocationTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        Response citiesResponse =
                CityRequestBuilder.getCities();

        Assert.assertEquals(
                citiesResponse.statusCode(),
                LocationTestConstants.STATUS_OK
        );

        String cityId =
                citiesResponse.jsonPath().getString("cities[0].id");;

        Assert.assertNotNull(
                cityId
        );


        UpdateLocationRequest locationRequest =
                new UpdateLocationRequest(
                        cityId,
                        LocationTestConstants.buyerSuccessfullyUpdatesLocationTest_STREET,
                        LocationTestConstants.buyerSuccessfullyUpdatesLocationTest_STREET_NUMBER,
                        LocationTestConstants.buyerSuccessfullyUpdatesLocationTest_ADDITIONAL_INFO
                );

        Response locationResponse =
                ProfileRequestBuilder.updateMyLocation(
                        locationRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                locationResponse.statusCode(),
                LocationTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                locationResponse.jsonPath().getString("message"),
                LocationTestConstants.buyerSuccessfullyUpdatesLocationTest_MESSAGE
        );

        Assert.assertEquals(
                locationResponse.jsonPath().getString("user.city.id"),
                cityId
        );

        Assert.assertEquals(
                locationResponse.jsonPath().getString("user.address.street"),
                LocationTestConstants.buyerSuccessfullyUpdatesLocationTest_STREET
        );

        Assert.assertEquals(
                locationResponse.jsonPath().getString("user.address.streetNumber"),
                LocationTestConstants.buyerSuccessfullyUpdatesLocationTest_STREET_NUMBER
        );

        Assert.assertEquals(
                locationResponse.jsonPath().getString("user.address.additionalInfo"),
                LocationTestConstants.buyerSuccessfullyUpdatesLocationTest_ADDITIONAL_INFO
        );

        Assert.assertNotNull(
                locationResponse.jsonPath().get("user.address.latitude")
        );

        Assert.assertNotNull(
                locationResponse.jsonPath().get("user.address.longitude")
        );

        Assert.assertTrue(
                locationResponse.jsonPath().getBoolean("user.hasLocation")
        );
    }


    @Test
    public void sellerCannotUseBuyerLocationEndpointTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                LocationTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        Response citiesResponse =
                CityRequestBuilder.getCities();

        Assert.assertEquals(
                citiesResponse.statusCode(),
                LocationTestConstants.STATUS_OK
        );

        String cityId =
                citiesResponse.jsonPath().getString("cities[0].id");;

        Assert.assertNotNull(
                cityId
        );


        UpdateLocationRequest locationRequest =
                new UpdateLocationRequest(
                        cityId,
                        LocationTestConstants.sellerCannotUseBuyerLocationEndpointTest_STREET,
                        LocationTestConstants.sellerCannotUseBuyerLocationEndpointTest_STREET_NUMBER,
                        LocationTestConstants.sellerCannotUseBuyerLocationEndpointTest_ADDITIONAL_INFO
                );

        Response locationResponse =
                ProfileRequestBuilder.updateMyLocation(
                        locationRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                locationResponse.statusCode(),
                LocationTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorData =
                locationResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorData.getError().getCode(),
                LocationTestConstants.sellerCannotUseBuyerLocationEndpointTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorData.getError().getMessage(),
                LocationTestConstants.sellerCannotUseBuyerLocationEndpointTest_ERROR_MESSAGE
        );
    }
}