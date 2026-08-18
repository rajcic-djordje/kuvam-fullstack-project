package tests.auth.constants;

public class RegisterTestConstants {

    public static final String successfulBuyerRegisterTest_EMAIL = "jovan.doe@kuvam.rs";
    public static final String successfulBuyerRegisterTest_PASSWORD = "jovandoe1234";
    public static final String successfulBuyerRegisterTest_FIRSTNAME = "Jovan";
    public static final String successfulBuyerRegisterTest_LASTNAME = "Doe";
    public static final String successfulBuyerRegisterTest_ROLE = "buyer";

    public static final String successfulSellerRegisterTest_EMAIL = "jovana.doe@kuvam.rs";
    public static final String successfulSellerRegisterTest_PASSWORD = "jovanadoe1234";
    public static final String successfulSellerRegisterTest_FIRSTNAME = "Jovana";
    public static final String successfulSellerRegisterTest_LASTNAME = "Doe";
    public static final String successfulSellerRegisterTest_ROLE = "seller";
    public static final String successfulSellerRegisterTest_BUSINESSNAME = "Coco Loco";
    public static final String successfulSellerRegisterTest_DESCRIPTION = "Prva firma ovakvog tipa.";


    public static final String alreadyExistingBuyerRegisterTest_FIRSTNAME = "Jovana";
    public static final String alreadyExistingBuyerRegisterTest_LASTNAME = "Doe";
    public static final String alreadyExistingBuyerRegisterTest_ROLE = "buyer";


    public static final String malformedEmailBuyerRegisterTest_EMAIL = "aaaa";
    public static final String malformedEmailBuyerRegisterTest_FIRSTNAME = "Jovana";
    public static final String malformedEmailBuyerRegisterTest_LASTNAME = "Doe";
    public static final String malformedEmailBuyerRegisterTest_PASSWORD = "asdasdsads";
    public static final String malformedEmailBuyerRegisterTest_ROLE = "buyer";


    public static final String missingRequiredSellerFieldsRegisterTest_EMAIL = "jovana.doe@kuvam.rs";
    public static final String missingRequiredSellerFieldsRegisterTest_PASSWORD = "jovanadoe1234";
    public static final String missingRequiredSellerFieldsRegisterTest_FIRSTNAME = "Jovana";
    public static final String missingRequiredSellerFieldsRegisterTest_LASTNAME = "Doe";
    public static final String missingRequiredSellerFieldsRegisterTest_ROLE = "seller";
    public static final String missingRequiredSellerFieldsRegisterTest_BUSINESSNAME = "";
    public static final String missingRequiredSellerFieldsRegisterTest_DESCRIPTION = "";

}
