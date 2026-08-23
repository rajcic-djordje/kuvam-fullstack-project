package tests.location.constants;

public class LocationTestConstants {

    public static final int STATUS_OK = 200;
    public static final int STATUS_FORBIDDEN = 403;

    public static final String buyerSuccessfullyUpdatesLocationTest_STREET =
            "Knez Mihailova";

    public static final String buyerSuccessfullyUpdatesLocationTest_STREET_NUMBER =
            "12";

    public static final String buyerSuccessfullyUpdatesLocationTest_ADDITIONAL_INFO =
            "Second floor";

    public static final String buyerSuccessfullyUpdatesLocationTest_MESSAGE =
            "User location updated successfully.";


    public static final String sellerCannotUseBuyerLocationEndpointTest_STREET =
            "Knez Mihailova";

    public static final String sellerCannotUseBuyerLocationEndpointTest_STREET_NUMBER =
            "15";

    public static final String sellerCannotUseBuyerLocationEndpointTest_ADDITIONAL_INFO =
            "";

    public static final String sellerCannotUseBuyerLocationEndpointTest_ERROR_CODE =
            "BUYER_LOCATION_UPDATE_ONLY";

    public static final String sellerCannotUseBuyerLocationEndpointTest_ERROR_MESSAGE =
            "Location can only be updated through this endpoint by buyers.";
}