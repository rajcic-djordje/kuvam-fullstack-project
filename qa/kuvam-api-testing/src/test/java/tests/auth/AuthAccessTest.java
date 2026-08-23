package tests.auth;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.MessageResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.auth.constants.AuthAccessTestConstants;

public class AuthAccessTest extends BaseTest {


    @Test
    public void unauthenticatedUnsuccessfulAccessToProtectedRoutes() {

        Response protectedRouteResponse =
                AuthRequestBuilder.protectedRouteAccess();

        Assert.assertEquals(
                protectedRouteResponse.statusCode(),
                AuthAccessTestConstants.STATUS_UNAUTHORIZED
        );

        ErrorResponse errorResponse =
                protectedRouteResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                AuthAccessTestConstants.AUTHENTICATION_REQUIRED_MESSAGE
        );

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                AuthAccessTestConstants.AUTHENTICATION_REQUIRED_CODE
        );
    }


    @Test
    public void logoutTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        String refreshToken =
                loginResponse.getCookie("refreshToken");

        Response logoutResponse =
                AuthRequestBuilder.logout(refreshToken);

        Assert.assertEquals(
                logoutResponse.statusCode(),
                AuthAccessTestConstants.STATUS_OK
        );

        MessageResponse messageResponse =
                logoutResponse.as(MessageResponse.class);

        Assert.assertEquals(
                messageResponse.getMessage(),
                AuthAccessTestConstants.LOGOUT_SUCCESS_MESSAGE
        );
    }
}