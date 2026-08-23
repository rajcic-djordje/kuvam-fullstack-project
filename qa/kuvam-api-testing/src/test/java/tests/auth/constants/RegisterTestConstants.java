package tests.auth.constants;

public class RegisterTestConstants {

    public static final int STATUS_CREATED = 201;
    public static final int STATUS_BAD_REQUEST = 400;
    public static final int STATUS_CONFLICT = 409;

    public static final String REGISTER_SUCCESS_MESSAGE =
            "User registered successfully.";

    public static final String USER_ALREADY_REGISTERED_MESSAGE =
            "User already registered.";
    public static final String EMAIL_ALREADY_IN_USE_CODE =
            "EMAIL_ALREADY_IN_USE";

    public static final String INVALID_REQUEST_DATA_MESSAGE =
            "Invalid request data.";
    public static final String VALIDATION_ERROR_CODE =
            "VALIDATION_ERROR";


    public static final String successfulBuyerRegisterTest_EMAIL =
            "jovan.doe@kuvam.rs";
    public static final String successfulBuyerRegisterTest_PASSWORD =
            "jovandoe1234";
    public static final String successfulBuyerRegisterTest_FIRSTNAME =
            "Jovan";
    public static final String successfulBuyerRegisterTest_LASTNAME =
            "Doe";
    public static final String successfulBuyerRegisterTest_ROLE =
            "buyer";


    public static final String successfulSellerRegisterTest_EMAIL =
            "jovana.doe@kuvam.rs";
    public static final String successfulSellerRegisterTest_PASSWORD =
            "jovanadoe1234";
    public static final String successfulSellerRegisterTest_FIRSTNAME =
            "Jovana";
    public static final String successfulSellerRegisterTest_LASTNAME =
            "Doe";
    public static final String successfulSellerRegisterTest_ROLE =
            "seller";
    public static final String successfulSellerRegisterTest_BUSINESSNAME =
            "Coco Loco";
    public static final String successfulSellerRegisterTest_DESCRIPTION =
            "Prva firma ovakvog tipa.";


    public static final String alreadyExistingBuyerRegisterTest_FIRSTNAME =
            "Jovana";
    public static final String alreadyExistingBuyerRegisterTest_LASTNAME =
            "Doe";
    public static final String alreadyExistingBuyerRegisterTest_ROLE =
            "buyer";


    public static final String emptyRequiredFieldsBuyerRegisterTest_VALID_EMAIL =
            "email@kuvam.rs";
    public static final String emptyRequiredFieldsBuyerRegisterTest_FIRSTNAME =
            "John";
    public static final String emptyRequiredFieldsBuyerRegisterTest_LASTNAME =
            "Doe";
    public static final String emptyRequiredFieldsBuyerRegisterTest_PASSWORD =
            "ValidPassword123";
    public static final String emptyRequiredFieldsBuyerRegisterTest_ROLE =
            "buyer";
    public static final String emptyRequiredFieldsBuyerRegisterTest_EMPTY_VALUE =
            "";


    public static final String malformedEmailBuyerRegisterTest_EMAIL =
            "aaaa";
    public static final String malformedEmailBuyerRegisterTest_FIRSTNAME =
            "Jovana";
    public static final String malformedEmailBuyerRegisterTest_LASTNAME =
            "Doe";
    public static final String malformedEmailBuyerRegisterTest_PASSWORD =
            "asdasdsads";
    public static final String malformedEmailBuyerRegisterTest_ROLE =
            "buyer";


    public static final String missingRequiredSellerFieldsRegisterTest_EMAIL =
            "jovana.doe@kuvam.rs";
    public static final String missingRequiredSellerFieldsRegisterTest_PASSWORD =
            "jovanadoe1234";
    public static final String missingRequiredSellerFieldsRegisterTest_FIRSTNAME =
            "Jovana";
    public static final String missingRequiredSellerFieldsRegisterTest_LASTNAME =
            "Doe";
    public static final String missingRequiredSellerFieldsRegisterTest_ROLE =
            "seller";
    public static final String missingRequiredSellerFieldsRegisterTest_BUSINESSNAME =
            "";
    public static final String missingRequiredSellerFieldsRegisterTest_DESCRIPTION =
            "";
}