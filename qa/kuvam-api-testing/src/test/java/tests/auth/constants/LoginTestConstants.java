package tests.auth.constants;

public class LoginTestConstants {

    public static final int STATUS_OK = 200;
    public static final int STATUS_BAD_REQUEST = 400;
    public static final int STATUS_UNAUTHORIZED = 401;
    public static final int STATUS_FORBIDDEN = 403;

    public static final String LOGIN_SUCCESS_MESSAGE =
            "User logged in successfully.";

    public static final String BUYER_ROLE =
            "buyer";

    public static final String ACTIVE_STATUS =
            "active";

    public static final String INVALID_CREDENTIALS_CODE =
            "INVALID_CREDENTIALS";

    public static final String INVALID_CREDENTIALS_MESSAGE =
            "Invalid email or password.";

    public static final String VALIDATION_ERROR_CODE =
            "VALIDATION_ERROR";

    public static final String INVALID_REQUEST_DATA_MESSAGE =
            "Invalid request data.";

    public static final String ACCOUNT_DEACTIVATED_CODE =
            "ACCOUNT_DEACTIVATED";

    public static final String ACCOUNT_DEACTIVATED_MESSAGE =
            "Account deactivated.";

    public static final String ACCOUNT_SUSPENDED_CODE =
            "ACCOUNT_SUSPENDED";

    public static final String suspendedAccountLoginTest_MESSAGE_REGEX =
            "^Account suspended\\. Reason: \\S.{3,}$";

    public static final String ACCOUNT_BANNED_CODE =
            "ACCOUNT_BANNED";

    public static final String bannedAccountLoginTest_MESSAGE_REGEX =
            "^Account banned\\. Reason: \\S.{3,}$";


    public static final String nonExistentEmailLoginTest_EMAIL =
            "xyz.xyz@kuvam.rs";

    public static final String nonExistentEmailLoginTest_PASSWORD =
            "xyzxyzrs";


    public static final String wrongPasswordLoginTest_PASSWORD =
            "asdsaddasdsad";


    public static final String malformedEmailLoginTest_EMAIL =
            "abc";

    public static final String malformedEmailLoginTest_PASSWORD =
            "abcdfghjkl";


    public static final String emptyRequiredFieldsLoginTest_EMPTY_VALUE =
            "";

    public static final String emptyRequiredFieldsLoginTest_VALID_EMAIL =
            "buyer@example.com";

    public static final String emptyRequiredFieldsLoginTest_VALID_PASSWORD =
            "ValidPassword123";


    public static final String unsuspendedUserSuccessfulLoginTest_EMAIL =
            "unsuspend.test@kuvam.rs";

    public static final String unsuspendedUserSuccessfulLoginTest_FIRSTNAME =
            "Marko";

    public static final String unsuspendedUserSuccessfulLoginTest_LASTNAME =
            "Markovic";

    public static final String unsuspendedUserSuccessfulLoginTest_PASSWORD =
            "MarkoTest123";

    public static final String unsuspendedUserSuccessfulLoginTest_ROLE =
            "buyer";
    public static final int STATUS_CREATED = 201;

    public static final String unsuspendedUserSuccessfulLoginTest_REASON =
            "Temporary suspension for testing.";

    public static final String afterChangingPasswordSuccessfulLoginTest_NEW_PASSWORD =
            "NewTestPassword123";

    public static final String afterChangingPasswordSuccessfulLoginTest_CHANGE_PASSWORD_MESSAGE =
            "Password changed successfully.";

    public static final String afterChangingPasswordSuccessfulLoginTest_LOGIN_MESSAGE =
            "User logged in successfully.";


}