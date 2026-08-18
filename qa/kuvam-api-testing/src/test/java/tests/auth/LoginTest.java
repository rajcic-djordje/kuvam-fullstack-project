package tests.auth;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.BuyerRegisterRequest;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.SellerRegisterRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.RegisterResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.auth.constants.LoginTestConstants;

public class LoginTest extends BaseTest {



    @Test
    public void successfulLoginTest() {


        LoginRequest login = new LoginRequest(ConfigReader.get("buyerEmail"), ConfigReader.get("buyerPassword"));

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 200);

        LoginResponse lr = r.as(LoginResponse.class);

        Assert.assertEquals(lr.getMessage(), "User logged in successfully.");

        Assert.assertEquals(lr.getUser().getEmail(), ConfigReader.get("buyerEmail"));
        Assert.assertEquals(lr.getUser().getRole(), "buyer");
        Assert.assertEquals(lr.getUser().getStatus(), "active");


        Assert.assertNotNull(lr.getUser().getId());

        Assert.assertNotNull(lr.getAccessToken());

        Assert.assertNotNull(r.getCookie("refreshToken"));


    }

    @Test
    public void nonExistentEmailLoginTest() {


        LoginRequest login = new LoginRequest(LoginTestConstants.nonExistentEmailLoginTest_EMAIL, LoginTestConstants.nonExistentEmailLoginTest_PASSWORD);

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 401);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "INVALID_CREDENTIALS");

        Assert.assertEquals(er.getError().getMessage(), "Invalid email or password.");



    }


    @Test
    public void wrongPasswordLoginTest() {


        LoginRequest login = new LoginRequest(ConfigReader.get("buyerEmail"), LoginTestConstants.wrongPasswordLoginTest_PASSWORD);

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 401);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "INVALID_CREDENTIALS");

        Assert.assertEquals(er.getError().getMessage(), "Invalid email or password.");



    }

    @Test
    public void malformedEmailLoginTest() {


        LoginRequest login = new LoginRequest(LoginTestConstants.malformedEmailLoginTest_EMAIL, LoginTestConstants.malformedEmailLoginTest_PASSWORD);

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 400);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "VALIDATION_ERROR");

        Assert.assertEquals(er.getError().getMessage(), "Invalid request data.");



    }

    @DataProvider(name = "emptyLoginFields")
    public Object[][] emptyLoginFields() {
        return new Object[][]{
                {"", "ValidPassword123"},
                {"buyer@example.com", ""},
                {"", ""}
        };
    }

    @Test(dataProvider = "emptyLoginFields")
    public void emptyRequiredFieldsLoginTest(String email, String password) {

        LoginRequest login = new LoginRequest(email, password);

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 400);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "VALIDATION_ERROR");
        Assert.assertEquals(er.getError().getMessage(), "Invalid request data.");
    }

    @Test
    public void deactivatedAccountLoginTest() {


        LoginRequest login = new LoginRequest(ConfigReader.get("deactivatedUserEmail"), ConfigReader.get("deactivatedUserPassword"));

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 403);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "ACCOUNT_DEACTIVATED");

        Assert.assertEquals(er.getError().getMessage(), "Account deactivated.");



    }

    @Test
    public void suspendedAccountLoginTest() {


        LoginRequest login = new LoginRequest(ConfigReader.get("suspendedUserEmail"), ConfigReader.get("suspendedUserPassword"));

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 403);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "ACCOUNT_SUSPENDED");

        Assert.assertTrue(er.getError().getMessage().matches("^Account suspended\\. Reason: \\S.{3,}$"));




    }

    @Test
    public void bannedAccountLoginTest() {


        LoginRequest login = new LoginRequest(ConfigReader.get("bannedUserEmail"), ConfigReader.get("bannedUserPassword"));

        Response r = AuthRequestBuilder.login(login);

        Assert.assertEquals(r.statusCode(), 403);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "ACCOUNT_BANNED");

        Assert.assertTrue(er.getError().getMessage().matches("^Account banned\\. Reason: \\S.{3,}$"));



    }


    @Test
    public void unsuspendedUserSuccessfulLoginTest() {
        //TODO

    }

    @Test
    public void afterChangingPasswordSuccessfulLoginTest() {
        //TODO
    }

    @Test
    public void oldPasswordUnsuccessfulLoginTest() {
        //TODO
    }






}
