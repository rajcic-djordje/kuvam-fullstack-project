package tests.profile.constants;

public class ProfileTestConstants {

    public static final String userCanDeactivateOwnAccountTest_EMAIL =
            "profile.deactivate@test.com";

    public static final String userCanDeactivateOwnAccountTest_FIRST_NAME =
            "Deactivate";

    public static final String userCanDeactivateOwnAccountTest_LAST_NAME =
            "Buyer";

    public static final String userCanDeactivateOwnAccountTest_PASSWORD =
            "Test1234";

    public static final String userCanDeactivateOwnAccountTest_ROLE =
            "buyer";

    public static final String userCanDeactivateOwnAccountTest_MESSAGE =
            "Account deactivated successfully.";

    public static final String userCanDeactivateOwnAccountTest_STATUS =
            "deactivated";

    public static final String userCanDeactivateOwnAccountTest_LOGIN_ERROR_CODE =
            "ACCOUNT_DEACTIVATED";
    public static final int STATUS_CREATED = 201 ;
    public static final int STATUS_OK = 200;
    public static final int STATUS_FORBIDDEN = 403 ;

    public static final int STATUS_UNAUTHORIZED = 401;

    public static final String changePasswordTest_WRONG_CURRENT_PASSWORD =
            "WrongPassword123";

    public static final String changePasswordTest_INVALID_CURRENT_PASSWORD_CODE =
            "INVALID_CURRENT_PASSWORD";

    public static final String changePasswordTest_INVALID_CURRENT_PASSWORD_MESSAGE =
            "Current password is incorrect.";


    public static final String userCanChangePasswordTest_NEW_PASSWORD =
            "NewTest1234";

    public static final String userCanChangePasswordTest_WRONG_CURRENT_PASSWORD =
            "WrongPassword123";

    public static final String userCanChangePasswordTest_SUCCESS_MESSAGE =
            "Password changed successfully.";

    public static final String userCanChangePasswordTest_INVALID_CURRENT_PASSWORD_CODE =
            "INVALID_CURRENT_PASSWORD";

    public static final String userCanChangePasswordTest_INVALID_CURRENT_PASSWORD_MESSAGE =
            "Current password is incorrect.";
}
