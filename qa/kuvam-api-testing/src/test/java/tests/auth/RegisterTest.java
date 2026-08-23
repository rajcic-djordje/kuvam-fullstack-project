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

        BuyerRegisterRequest registerRequest = new BuyerRegisterRequest(
                RegisterTestConstants.successfulBuyerRegisterTest_EMAIL,
                RegisterTestConstants.successfulBuyerRegisterTest_FIRSTNAME,
                RegisterTestConstants.successfulBuyerRegisterTest_LASTNAME,
                RegisterTestConstants.successfulBuyerRegisterTest_PASSWORD,
                RegisterTestConstants.successfulBuyerRegisterTest_ROLE
        );

        Response registerResponse =
                AuthRequestBuilder.buyerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                RegisterTestConstants.STATUS_CREATED
        );

        RegisterResponse registerData =
                registerResponse.as(RegisterResponse.class);

        Assert.assertEquals(
                registerData.getMessage(),
                RegisterTestConstants.REGISTER_SUCCESS_MESSAGE
        );
        Assert.assertNotNull(registerData.getUser());
        Assert.assertEquals(
                registerData.getUser().getEmail(),
                RegisterTestConstants.successfulBuyerRegisterTest_EMAIL
        );
        Assert.assertEquals(
                registerData.getUser().getRole(),
                RegisterTestConstants.successfulBuyerRegisterTest_ROLE
        );
        Assert.assertNotNull(registerData.getUser().getId());
    }


    @Test
    public void successfulSellerRegisterTest() {

        SellerRegisterRequest registerRequest = new SellerRegisterRequest(
                RegisterTestConstants.successfulSellerRegisterTest_EMAIL,
                RegisterTestConstants.successfulSellerRegisterTest_FIRSTNAME,
                RegisterTestConstants.successfulSellerRegisterTest_LASTNAME,
                RegisterTestConstants.successfulSellerRegisterTest_PASSWORD,
                RegisterTestConstants.successfulSellerRegisterTest_ROLE,
                RegisterTestConstants.successfulSellerRegisterTest_BUSINESSNAME,
                RegisterTestConstants.successfulSellerRegisterTest_DESCRIPTION
        );

        Response registerResponse =
                AuthRequestBuilder.sellerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                RegisterTestConstants.STATUS_CREATED
        );

        RegisterResponse registerData =
                registerResponse.as(RegisterResponse.class);

        Assert.assertEquals(
                registerData.getMessage(),
                RegisterTestConstants.REGISTER_SUCCESS_MESSAGE
        );
        Assert.assertNotNull(registerData.getUser());
        Assert.assertEquals(
                registerData.getUser().getEmail(),
                RegisterTestConstants.successfulSellerRegisterTest_EMAIL
        );
        Assert.assertEquals(
                registerData.getUser().getRole(),
                RegisterTestConstants.successfulSellerRegisterTest_ROLE
        );
        Assert.assertNotNull(registerData.getUser().getId());
    }


    @Test
    public void alreadyExistingBuyerRegisterTest() {

        BuyerRegisterRequest registerRequest = new BuyerRegisterRequest(
                ConfigReader.get("buyerEmail"),
                RegisterTestConstants.alreadyExistingBuyerRegisterTest_FIRSTNAME,
                RegisterTestConstants.alreadyExistingBuyerRegisterTest_LASTNAME,
                ConfigReader.get("buyerPassword"),
                RegisterTestConstants.alreadyExistingBuyerRegisterTest_ROLE
        );

        Response registerResponse =
                AuthRequestBuilder.buyerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                RegisterTestConstants.STATUS_CONFLICT
        );

        ErrorResponse errorResponse =
                registerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                RegisterTestConstants.USER_ALREADY_REGISTERED_MESSAGE
        );
        Assert.assertNotNull(
                errorResponse.getError().getCode(),
                RegisterTestConstants.EMAIL_ALREADY_IN_USE_CODE
        );
    }


    @DataProvider(name = "emptyRegisterFields")
    public Object[][] emptyRegisterFields() {

        return new Object[][]{
                {
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_EMPTY_VALUE,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_FIRSTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_LASTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_PASSWORD,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_ROLE
                },
                {
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_VALID_EMAIL,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_EMPTY_VALUE,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_LASTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_PASSWORD,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_ROLE
                },
                {
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_VALID_EMAIL,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_FIRSTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_EMPTY_VALUE,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_PASSWORD,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_ROLE
                },
                {
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_VALID_EMAIL,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_FIRSTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_LASTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_EMPTY_VALUE,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_ROLE
                },
                {
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_VALID_EMAIL,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_FIRSTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_LASTNAME,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_PASSWORD,
                        RegisterTestConstants.emptyRequiredFieldsBuyerRegisterTest_EMPTY_VALUE
                }
        };
    }


    @Test(dataProvider = "emptyRegisterFields")
    public void emptyRequiredFieldsBuyerRegisterTest(
            String email,
            String firstName,
            String lastName,
            String password,
            String role
    ) {

        BuyerRegisterRequest registerRequest =
                new BuyerRegisterRequest(
                        email,
                        firstName,
                        lastName,
                        password,
                        role
                );

        Response registerResponse =
                AuthRequestBuilder.buyerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                RegisterTestConstants.STATUS_BAD_REQUEST
        );

        ErrorResponse errorResponse =
                registerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                RegisterTestConstants.INVALID_REQUEST_DATA_MESSAGE
        );
        Assert.assertNotNull(
                errorResponse.getError().getCode(),
                RegisterTestConstants.VALIDATION_ERROR_CODE
        );
    }


    @Test
    public void malformedEmailRegisterTest() {

        BuyerRegisterRequest registerRequest = new BuyerRegisterRequest(
                RegisterTestConstants.malformedEmailBuyerRegisterTest_EMAIL,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_FIRSTNAME,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_LASTNAME,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_PASSWORD,
                RegisterTestConstants.malformedEmailBuyerRegisterTest_ROLE
        );

        Response registerResponse =
                AuthRequestBuilder.buyerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                RegisterTestConstants.STATUS_BAD_REQUEST
        );

        ErrorResponse errorResponse =
                registerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                RegisterTestConstants.INVALID_REQUEST_DATA_MESSAGE
        );
        Assert.assertNotNull(
                errorResponse.getError().getCode(),
                RegisterTestConstants.VALIDATION_ERROR_CODE
        );
    }


    @Test
    public void missingRequiredSellerFieldsRegisterTest() {

        SellerRegisterRequest registerRequest = new SellerRegisterRequest(
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_EMAIL,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_FIRSTNAME,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_LASTNAME,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_PASSWORD,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_ROLE,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_BUSINESSNAME,
                RegisterTestConstants.missingRequiredSellerFieldsRegisterTest_DESCRIPTION
        );

        Response registerResponse =
                AuthRequestBuilder.sellerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                RegisterTestConstants.STATUS_BAD_REQUEST
        );

        ErrorResponse errorResponse =
                registerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                RegisterTestConstants.INVALID_REQUEST_DATA_MESSAGE
        );
        Assert.assertNotNull(
                errorResponse.getError().getCode(),
                RegisterTestConstants.VALIDATION_ERROR_CODE
        );
    }
}