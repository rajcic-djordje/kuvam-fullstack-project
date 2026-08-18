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

public class AuthAccessTest extends BaseTest {

    @Test
    public void unauthenticatedUnsuccessfulAccessToProtectedRoutes() {

        Response r = AuthRequestBuilder.protectedRouteAccess();

        Assert.assertEquals(r.statusCode(),401);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getMessage(), "Authentication required.");
        Assert.assertEquals(er.getError().getCode(), "AUTHENTICATION_REQUIRED");

    }


    @Test
    public void logoutTest() {

        LoginRequest lr = new LoginRequest(ConfigReader.get("buyerEmail"), ConfigReader.get("buyerPassword"));

        Response lRes = AuthRequestBuilder.login(lr);

        String refreshToken = lRes.getCookie("refreshToken");

        lRes = AuthRequestBuilder.logout(refreshToken);

        Assert.assertEquals(lRes.statusCode(),200);

        MessageResponse mr = lRes.as(MessageResponse.class);

        Assert.assertEquals(mr.getMessage(), "User logged out successfully.");




    }


}
