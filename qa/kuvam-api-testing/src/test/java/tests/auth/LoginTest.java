package tests.auth;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.BuyerRegisterRequest;
import com.rajcic.dto.request.ChangePasswordRequest;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.UserRestrictionRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.MessageResponse;
import com.rajcic.dto.response.RegisterResponse;
import com.rajcic.requestbuilder.admin.AdminRequestBuilder;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.profile.ProfileRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.auth.constants.LoginTestConstants;
import tests.auth.constants.RegisterTestConstants;

public class LoginTest extends BaseTest {


    @Test
    public void successfulLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        Assert.assertEquals(
                loginData.getMessage(),
                LoginTestConstants.LOGIN_SUCCESS_MESSAGE
        );

        Assert.assertEquals(
                loginData.getUser().getEmail(),
                ConfigReader.get("buyerEmail")
        );

        Assert.assertEquals(
                loginData.getUser().getRole(),
                LoginTestConstants.BUYER_ROLE
        );

        Assert.assertEquals(
                loginData.getUser().getStatus(),
                LoginTestConstants.ACTIVE_STATUS
        );

        Assert.assertNotNull(loginData.getUser().getId());

        Assert.assertNotNull(loginData.getAccessToken());

        Assert.assertNotNull(
                loginResponse.getCookie("refreshToken")
        );
    }


    @Test
    public void nonExistentEmailLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                LoginTestConstants.nonExistentEmailLoginTest_EMAIL,
                LoginTestConstants.nonExistentEmailLoginTest_PASSWORD
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_UNAUTHORIZED
        );

        ErrorResponse errorResponse =
                loginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.INVALID_CREDENTIALS_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                LoginTestConstants.INVALID_CREDENTIALS_MESSAGE
        );
    }


    @Test
    public void wrongPasswordLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                LoginTestConstants.wrongPasswordLoginTest_PASSWORD
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_UNAUTHORIZED
        );

        ErrorResponse errorResponse =
                loginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.INVALID_CREDENTIALS_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                LoginTestConstants.INVALID_CREDENTIALS_MESSAGE
        );
    }


    @Test
    public void malformedEmailLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                LoginTestConstants.malformedEmailLoginTest_EMAIL,
                LoginTestConstants.malformedEmailLoginTest_PASSWORD
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_BAD_REQUEST
        );

        ErrorResponse errorResponse =
                loginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.VALIDATION_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                LoginTestConstants.INVALID_REQUEST_DATA_MESSAGE
        );
    }


    @DataProvider(name = "emptyLoginFields")
    public Object[][] emptyLoginFields() {

        return new Object[][]{
                {
                        LoginTestConstants.emptyRequiredFieldsLoginTest_EMPTY_VALUE,
                        LoginTestConstants.emptyRequiredFieldsLoginTest_VALID_PASSWORD
                },
                {
                        LoginTestConstants.emptyRequiredFieldsLoginTest_VALID_EMAIL,
                        LoginTestConstants.emptyRequiredFieldsLoginTest_EMPTY_VALUE
                },
                {
                        LoginTestConstants.emptyRequiredFieldsLoginTest_EMPTY_VALUE,
                        LoginTestConstants.emptyRequiredFieldsLoginTest_EMPTY_VALUE
                }
        };
    }


    @Test(dataProvider = "emptyLoginFields")
    public void emptyRequiredFieldsLoginTest(
            String email,
            String password
    ) {

        LoginRequest loginRequest =
                new LoginRequest(email, password);

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_BAD_REQUEST
        );

        ErrorResponse errorResponse =
                loginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.VALIDATION_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                LoginTestConstants.INVALID_REQUEST_DATA_MESSAGE
        );
    }


    @Test
    public void deactivatedAccountLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("deactivatedUserEmail"),
                ConfigReader.get("deactivatedUserPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                loginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.ACCOUNT_DEACTIVATED_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                LoginTestConstants.ACCOUNT_DEACTIVATED_MESSAGE
        );
    }


    @Test
    public void suspendedAccountLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("suspendedUserEmail"),
                ConfigReader.get("suspendedUserPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                loginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.ACCOUNT_SUSPENDED_CODE
        );

        Assert.assertTrue(
                errorResponse.getError()
                        .getMessage()
                        .matches(
                                LoginTestConstants.suspendedAccountLoginTest_MESSAGE_REGEX
                        )
        );
    }


    @Test
    public void bannedAccountLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("bannedUserEmail"),
                ConfigReader.get("bannedUserPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                loginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.ACCOUNT_BANNED_CODE
        );

        Assert.assertTrue(
                errorResponse.getError()
                        .getMessage()
                        .matches(
                                LoginTestConstants.bannedAccountLoginTest_MESSAGE_REGEX
                        )
        );
    }


    @Test
    public void unsuspendedUserSuccessfulLoginTest() {

        BuyerRegisterRequest registerRequest = new BuyerRegisterRequest(
                LoginTestConstants.unsuspendedUserSuccessfulLoginTest_EMAIL,
                LoginTestConstants.unsuspendedUserSuccessfulLoginTest_FIRSTNAME,
                LoginTestConstants.unsuspendedUserSuccessfulLoginTest_LASTNAME,
                LoginTestConstants.unsuspendedUserSuccessfulLoginTest_PASSWORD,
                LoginTestConstants.unsuspendedUserSuccessfulLoginTest_ROLE
        );

        Response r = AuthRequestBuilder.buyerRegister(registerRequest);

        Assert.assertEquals(r.statusCode(), LoginTestConstants.STATUS_CREATED);

        String userId = (r.as(RegisterResponse.class)).getUser().getId();

        LoginRequest adminLoginRequest1 = new LoginRequest(ConfigReader.get("adminEmail"),
                ConfigReader.get("adminPassword")
        );

        Response alr1 = AuthRequestBuilder.adminLogin(adminLoginRequest1);

        Assert.assertEquals(alr1.statusCode(), LoginTestConstants.STATUS_OK);

        LoginResponse alRes1 = alr1.as(LoginResponse.class);

        UserRestrictionRequest ur = new UserRestrictionRequest(LoginTestConstants.unsuspendedUserSuccessfulLoginTest_REASON);

        Response ar = AdminRequestBuilder.suspendUser(userId,ur,alRes1.getAccessToken());

        Assert.assertEquals(ar.statusCode(), LoginTestConstants.STATUS_OK);

        LoginRequest loginRequest = new LoginRequest(LoginTestConstants.unsuspendedUserSuccessfulLoginTest_EMAIL,
                LoginTestConstants.unsuspendedUserSuccessfulLoginTest_PASSWORD
                );

        Response lr = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(lr.statusCode(), LoginTestConstants.STATUS_FORBIDDEN);


        Response ar2 = AdminRequestBuilder.unsuspendUser(userId,alRes1.getAccessToken());

        Assert.assertEquals(ar.statusCode(), LoginTestConstants.STATUS_OK);

        LoginRequest loginRequest2 = new LoginRequest(LoginTestConstants.unsuspendedUserSuccessfulLoginTest_EMAIL,
                LoginTestConstants.unsuspendedUserSuccessfulLoginTest_PASSWORD
        );

        Response lr2 = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(lr2.statusCode(), LoginTestConstants.STATUS_OK);



    }


    @Test
    public void afterChangingPasswordSuccessfulLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("userPasswordChangeEmail"),
                ConfigReader.get("userPasswordChangePassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest(
                ConfigReader.get("userPasswordChangePassword"),
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_NEW_PASSWORD
        );

        Response changePasswordResponse =
                ProfileRequestBuilder.changeMyPassword(
                        changePasswordRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                changePasswordResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );

        MessageResponse changePasswordData =
                changePasswordResponse.as(MessageResponse.class);

        Assert.assertNotNull(changePasswordData);

        Assert.assertEquals(
                changePasswordData.getMessage(),
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_CHANGE_PASSWORD_MESSAGE
        );


        LoginRequest newPasswordLoginRequest = new LoginRequest(
                ConfigReader.get("userPasswordChangeEmail"),
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_NEW_PASSWORD
        );

        Response newPasswordLoginResponse =
                AuthRequestBuilder.login(newPasswordLoginRequest);

        Assert.assertEquals(
                newPasswordLoginResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );


        LoginResponse newPasswordLoginData =
                newPasswordLoginResponse.as(LoginResponse.class);

        ChangePasswordRequest restorePasswordRequest = new ChangePasswordRequest(
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_NEW_PASSWORD,
                ConfigReader.get("userPasswordChangePassword")
        );

        Response restorePasswordResponse =
                ProfileRequestBuilder.changeMyPassword(
                        restorePasswordRequest,
                        newPasswordLoginData.getAccessToken()
                );

        Assert.assertEquals(
                restorePasswordResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );
    }


    @Test
    public void oldPasswordUnsuccessfulLoginTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("userPasswordChangeEmail"),
                ConfigReader.get("userPasswordChangePassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        ChangePasswordRequest changePasswordRequest = new ChangePasswordRequest(
                ConfigReader.get("userPasswordChangePassword"),
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_NEW_PASSWORD
        );

        Response changePasswordResponse =
                ProfileRequestBuilder.changeMyPassword(
                        changePasswordRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                changePasswordResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );

        MessageResponse changePasswordData =
                changePasswordResponse.as(MessageResponse.class);

        Assert.assertNotNull(changePasswordData);

        Assert.assertEquals(
                changePasswordData.getMessage(),
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_CHANGE_PASSWORD_MESSAGE
        );


        LoginRequest oldPasswordLoginRequest = new LoginRequest(
                ConfigReader.get("userPasswordChangeEmail"),
                ConfigReader.get("userPasswordChangePassword")
        );

        Response oldPasswordLoginResponse =
                AuthRequestBuilder.login(oldPasswordLoginRequest);

        Assert.assertEquals(
                oldPasswordLoginResponse.statusCode(),
                LoginTestConstants.STATUS_UNAUTHORIZED
        );

        ErrorResponse errorResponse =
                oldPasswordLoginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                LoginTestConstants.INVALID_CREDENTIALS_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                LoginTestConstants.INVALID_CREDENTIALS_MESSAGE
        );


        LoginRequest newPasswordLoginRequest = new LoginRequest(
                ConfigReader.get("userPasswordChangeEmail"),
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_NEW_PASSWORD
        );

        Response newPasswordLoginResponse =
                AuthRequestBuilder.login(newPasswordLoginRequest);

        Assert.assertEquals(
                newPasswordLoginResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );

        LoginResponse newPasswordLoginData =
                newPasswordLoginResponse.as(LoginResponse.class);

        ChangePasswordRequest restorePasswordRequest = new ChangePasswordRequest(
                LoginTestConstants.afterChangingPasswordSuccessfulLoginTest_NEW_PASSWORD,
                ConfigReader.get("userPasswordChangePassword")
        );

        Response restorePasswordResponse =
                ProfileRequestBuilder.changeMyPassword(
                        restorePasswordRequest,
                        newPasswordLoginData.getAccessToken()
                );

        Assert.assertEquals(
                restorePasswordResponse.statusCode(),
                LoginTestConstants.STATUS_OK
        );
    }
}