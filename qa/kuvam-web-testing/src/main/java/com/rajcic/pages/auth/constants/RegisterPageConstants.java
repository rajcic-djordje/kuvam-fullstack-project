package com.rajcic.pages.auth.constants;

public final class RegisterPageConstants {

    public static final String REGISTER_URL = "http://localhost:4200/register";
    public static final String LOGIN_URL_PART = "/login";

    public static final String FIRST_NAME_INPUT_ID = "firstName";
    public static final String LAST_NAME_INPUT_ID = "lastName";
    public static final String EMAIL_INPUT_ID = "email";
    public static final String PASSWORD_INPUT_ID = "password";
    public static final String CONFIRM_PASSWORD_INPUT_ID = "confirmPassword";
    public static final String BUSINESS_NAME_INPUT_ID = "businessName";
    public static final String DESCRIPTION_INPUT_ID = "description";

    public static final String SUBMIT_BUTTON_SELECTOR = "form.auth-form button[type='submit']";

    public static final String SELLER_ROLE_BUTTON_XPATH =
            "//button[contains(@class,'role-button')][.//span[normalize-space()='Domaćin']]";

    public static final String PHONE_NUMBER_INPUT_ID = "phoneNumber";

    private RegisterPageConstants() {
    }
}