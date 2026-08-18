package tests.auth;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.BuyerRegisterRequest;
import com.rajcic.dto.request.SellerRegisterRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.RegisterResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import tests.BaseTest;
import tests.auth.constants.RegisterTestConstants;

public class RegisterTest extends BaseTest {


    @Test
    public void successfulBuyerRegisterTest() {

        BuyerRegisterRequest br = new BuyerRegisterRequest(RegisterTestConstants.successfulBuyerRegisterTest_EMAIL,
                RegisterTestConstants.successfulBuyerRegisterTest_FIRSTNAME,
                RegisterTestConstants.successfulBuyerRegisterTest_LASTNAME,
                RegisterTestConstants.successfulBuyerRegisterTest_PASSWORD,
                RegisterTestConstants.successfulBuyerRegisterTest_ROLE);

        Response r = AuthRequestBuilder.buyerRegister(br);

        Assert.assertEquals(r.statusCode(), 201);

        RegisterResponse rr = r.as(RegisterResponse.class);

        Assert.assertEquals(rr.getMessage(), "User registered successfully.");
        Assert.assertNotNull(rr.getUser());
        Assert.assertEquals(rr.getUser().getEmail(), RegisterTestConstants.successfulBuyerRegisterTest_EMAIL);
        Assert.assertEquals(rr.getUser().getRole(), RegisterTestConstants.successfulBuyerRegisterTest_ROLE);
        Assert.assertNotNull(rr.getUser().getId());


    }


    @Test
    public void successfulSellerRegisterTest() {

        SellerRegisterRequest sr = new SellerRegisterRequest(RegisterTestConstants.successfulSellerRegisterTest_EMAIL,
                RegisterTestConstants.successfulSellerRegisterTest_FIRSTNAME,
                RegisterTestConstants.successfulSellerRegisterTest_LASTNAME,
                RegisterTestConstants.successfulSellerRegisterTest_PASSWORD,
                RegisterTestConstants.successfulSellerRegisterTest_ROLE,
                RegisterTestConstants.successfulSellerRegisterTest_BUSINESSNAME,
                RegisterTestConstants.successfulSellerRegisterTest_DESCRIPTION);

        Response r = AuthRequestBuilder.sellerRegister(sr);

        Assert.assertEquals(r.statusCode(), 201);

        RegisterResponse rr = r.as(RegisterResponse.class);

        Assert.assertEquals(rr.getMessage(), "User registered successfully.");
        Assert.assertNotNull(rr.getUser());
        Assert.assertEquals(rr.getUser().getEmail(), RegisterTestConstants.successfulSellerRegisterTest_EMAIL);
        Assert.assertEquals(rr.getUser().getRole(), RegisterTestConstants.successfulSellerRegisterTest_ROLE);
        Assert.assertNotNull(rr.getUser().getId());


    }


    @Test
    public void alreadyExistingBuyerRegisterTest() {

        BuyerRegisterRequest br = new BuyerRegisterRequest(ConfigReader.get("buyerEmail"),
                RegisterTestConstants.alreadyExistingBuyerRegisterTest_FIRSTNAME,
                RegisterTestConstants.alreadyExistingBuyerRegisterTest_LASTNAME,
                ConfigReader.get("buyerPassword"),
                RegisterTestConstants.alreadyExistingBuyerRegisterTest_ROLE);

        Response r = AuthRequestBuilder.buyerRegister(br);

        Assert.assertEquals(r.statusCode(), 409);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getMessage(), "User already registered.");
        Assert.assertNotNull(er.getError().getCode(), "EMAIL_ALREADY_IN_USE");



    }

    @DataProvider(name = "emptyRegisterFields")
    public Object[][] emptyRegisterFields() {
        return new Object[][]{
                {"", "John", "Doe","ValidPassword123", "buyer"},
                {"email@kuvam.rs", "", "Doe","ValidPassword123", "buyer"},
                {"email@kuvam.rs", "John", "","ValidPassword123", "buyer"},
                {"email@kuvam.rs", "John", "Doe","", "buyer"},
                {"email@kuvam.rs", "John", "Doe","ValidPassword123", ""}
        };
    }



    @Test(dataProvider = "emptyRegisterFields")
    public void emptyRequiredFieldsBuyerRegisterTest(String email, String firstName, String lastName, String password, String role) {

        BuyerRegisterRequest br = new BuyerRegisterRequest( email, firstName, lastName, password, role);

        Response r = AuthRequestBuilder.buyerRegister(br);

        Assert.assertEquals(r.statusCode(), 400);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getMessage(), "Invalid request data.");
        Assert.assertNotNull(er.getError().getCode(), "VALIDATION_ERROR");



    }


    @Test
    public void malformedEmailRegisterTest() {

        BuyerRegisterRequest br = new BuyerRegisterRequest(RegisterTestConstants.malformedEmailBuyerRegisterTest_EMAIL,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_FIRSTNAME,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_LASTNAME,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_PASSWORD,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_ROLE);

        Response r = AuthRequestBuilder.buyerRegister(br);

        Assert.assertEquals(r.statusCode(), 400);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getMessage(), "Invalid request data.");
        Assert.assertNotNull(er.getError().getCode(), "VALIDATION_ERROR");



    }


    @Test
    public void missingRequiredSellerFieldsRegisterTest() {

        SellerRegisterRequest sr = new SellerRegisterRequest(RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_EMAIL,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_FIRSTNAME,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_LASTNAME,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_PASSWORD,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_ROLE,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_BUSINESSNAME,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_DESCRIPTION);

        Response r = AuthRequestBuilder.sellerRegister(sr);

        Assert.assertEquals(r.statusCode(), 400);

        ErrorResponse er = r.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getMessage(), "Invalid request data.");
        Assert.assertNotNull(er.getError().getCode(), "VALIDATION_ERROR");



    }
}
