package tests.profile;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.BuyerRegisterRequest;
import com.rajcic.dto.request.ChangePasswordRequest;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.profile.ProfileRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.profile.constants.ProfileTestConstants;

public class ProfileTest extends BaseTest {

    @Test
    public void userCanDeactivateOwnAccountTest() {

        BuyerRegisterRequest registerRequest =
                new BuyerRegisterRequest(
                        ProfileTestConstants.userCanDeactivateOwnAccountTest_EMAIL,
                        ProfileTestConstants.userCanDeactivateOwnAccountTest_FIRST_NAME,
                        ProfileTestConstants.userCanDeactivateOwnAccountTest_LAST_NAME,
                        ProfileTestConstants.userCanDeactivateOwnAccountTest_PASSWORD,
                        ProfileTestConstants.userCanDeactivateOwnAccountTest_ROLE
                );

        Response registerResponse =
                AuthRequestBuilder.buyerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                ProfileTestConstants.STATUS_CREATED
        );


        LoginRequest loginRequest =
                new LoginRequest(
                        ProfileTestConstants.userCanDeactivateOwnAccountTest_EMAIL,
                        ProfileTestConstants.userCanDeactivateOwnAccountTest_PASSWORD
                );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                ProfileTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);


        Response deactivateResponse =
                ProfileRequestBuilder.deactivateMyAccount(
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                deactivateResponse.statusCode(),
                ProfileTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                deactivateResponse.jsonPath().getString("message"),
                ProfileTestConstants.userCanDeactivateOwnAccountTest_MESSAGE
        );

        Assert.assertEquals(
                deactivateResponse.jsonPath().getString("user.status"),
                ProfileTestConstants.userCanDeactivateOwnAccountTest_STATUS
        );


        Response loginAfterDeactivationResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginAfterDeactivationResponse.statusCode(),
                ProfileTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorData =
                loginAfterDeactivationResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorData.getError().getCode(),
                ProfileTestConstants.userCanDeactivateOwnAccountTest_LOGIN_ERROR_CODE
        );
    }

    @Test
    public void userCanChangePasswordTest() {

        String oldPassword =
                ConfigReader.get("userPasswordChangePassword");

        LoginRequest loginRequest =
                new LoginRequest(
                        ConfigReader.get("userPasswordChangeEmail"),
                        oldPassword
                );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                ProfileTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);


        ChangePasswordRequest wrongPasswordRequest =
                new ChangePasswordRequest(
                        ProfileTestConstants.userCanChangePasswordTest_WRONG_CURRENT_PASSWORD,
                        ProfileTestConstants.userCanChangePasswordTest_NEW_PASSWORD
                );

        Response wrongPasswordResponse =
                ProfileRequestBuilder.changeMyPassword(
                        wrongPasswordRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                wrongPasswordResponse.statusCode(),
                ProfileTestConstants.STATUS_UNAUTHORIZED
        );

        ErrorResponse wrongPasswordError =
                wrongPasswordResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                wrongPasswordError.getError().getCode(),
                ProfileTestConstants.userCanChangePasswordTest_INVALID_CURRENT_PASSWORD_CODE
        );

        Assert.assertEquals(
                wrongPasswordError.getError().getMessage(),
                ProfileTestConstants.userCanChangePasswordTest_INVALID_CURRENT_PASSWORD_MESSAGE
        );


        ChangePasswordRequest changePasswordRequest =
                new ChangePasswordRequest(
                        oldPassword,
                        ProfileTestConstants.userCanChangePasswordTest_NEW_PASSWORD
                );

        Response changePasswordResponse =
                ProfileRequestBuilder.changeMyPassword(
                        changePasswordRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                changePasswordResponse.statusCode(),
                ProfileTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                changePasswordResponse.jsonPath().getString("message"),
                ProfileTestConstants.userCanChangePasswordTest_SUCCESS_MESSAGE
        );


        Response oldPasswordLoginResponse =
                AuthRequestBuilder.login(
                        new LoginRequest(
                                ConfigReader.get("userPasswordChangeEmail"),
                                oldPassword
                        )
                );

        Assert.assertEquals(
                oldPasswordLoginResponse.statusCode(),
                ProfileTestConstants.STATUS_UNAUTHORIZED
        );


        Response newPasswordLoginResponse =
                AuthRequestBuilder.login(
                        new LoginRequest(
                                ConfigReader.get("userPasswordChangeEmail"),
                                ProfileTestConstants.userCanChangePasswordTest_NEW_PASSWORD
                        )
                );

        Assert.assertEquals(
                newPasswordLoginResponse.statusCode(),
                ProfileTestConstants.STATUS_OK
        );
    }
}
