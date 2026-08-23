package tests.offer;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.*;
import com.rajcic.dto.response.*;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import com.rajcic.requestbuilder.orders.OrdersRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.offer.constants.OfferTestConstants;

import java.util.ArrayList;
import java.util.List;

public class OfferTest extends BaseTest {


    @Test
    public void sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest(){

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData = loginResponse.as(LoginResponse.class);

        OfferRequest offerRequest = new OfferRequest(
                OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_NAME,
                OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_DESCRIPTION,
                OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_CATEGORY,
                OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_PRICE,
                OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_AVAILABLE_QUANTITY,
                OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_UNIT
        );

        Response response = OffersRequestBuilder.createOffer(offerRequest, loginData.getAccessToken());

        Assert.assertEquals(
                response.statusCode(),
                OfferTestConstants.STATUS_CREATED
        );


        OfferResponse offerResponse = response.as(OfferResponse.class);

        Assert.assertEquals(offerResponse.getMessage(), OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_CREATE_MESSAGE);


        String offerId = offerResponse.getOffer().getId();

        Response deleteResponse = OffersRequestBuilder.deleteOffer(offerId, loginData.getAccessToken());


        Assert.assertEquals(deleteResponse.statusCode(), OfferTestConstants.STATUS_OK);

        MessageResponse deleteOfferResponse = deleteResponse.as(MessageResponse.class);
        Assert.assertEquals(deleteOfferResponse.getMessage(), OfferTestConstants.sellerSuccessfullyDeletesOwnOfferWithoutExistingOrdersTest_DELETE_MESSAGE);
    }

    @Test
    public void sellerCannotDeleteOwnOfferWithExistingOrdersTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData = loginResponse.as(LoginResponse.class);

        OfferRequest offerRequest = new OfferRequest(
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_NAME,
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_DESCRIPTION,
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_CATEGORY,
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_PRICE,
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_AVAILABLE_QUANTITY,
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_UNIT
        );

        Response response = OffersRequestBuilder.createOffer(
                offerRequest,
                loginData.getAccessToken()
        );

        Assert.assertEquals(
                response.statusCode(),
                OfferTestConstants.STATUS_CREATED
        );

        OfferResponse offerResponse = response.as(OfferResponse.class);

        Assert.assertEquals(
                offerResponse.getMessage(),
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_CREATE_MESSAGE
        );

        String offerId = offerResponse.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);

        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OfferTestConstants.STATUS_CREATED
        );

        OrderResponse orderResponse =
                createOrderResponse.as(OrderResponse.class);

        Assert.assertEquals(
                orderResponse.getMessage(),
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_ORDER_CREATED_MESSAGE
        );

        Assert.assertNotNull(orderResponse.getOrder());

        String orderId = orderResponse.getOrder().getId();


        Response deleteResponse = OffersRequestBuilder.deleteOffer(
                offerId,
                loginData.getAccessToken()
        );

        Assert.assertEquals(
                deleteResponse.statusCode(),
                OfferTestConstants.STATUS_CONFLICT
        );

        ErrorResponse errorResponse =
                deleteResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                OfferTestConstants.sellerCannotDeleteOwnOfferWithExistingOrdersTest_ERROR_MESSAGE
        );


        Response cancelOrderResponse =
                OrdersRequestBuilder.cancelMyOrder(
                        orderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                cancelOrderResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );
    }


    @Test
    public void sellerSuccessfullyDeactivatesOwnOfferTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                loginResponse.getCookie("refreshToken")
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_NAME,
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_DESCRIPTION,
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_CATEGORY,
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_PRICE,
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_AVAILABLE_QUANTITY,
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OfferTestConstants.STATUS_CREATED
        );

        OfferResponse createdOfferData =
                createOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                createdOfferData.getMessage(),
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_CREATE_MESSAGE
        );

        Assert.assertNotNull(
                createdOfferData.getOffer()
        );

        String offerId =
                createdOfferData.getOffer().getId();


        Response deactivateResponse =
                OffersRequestBuilder.deactivateOffer(
                        offerId,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                deactivateResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        OfferResponse deactivatedOfferData =
                deactivateResponse.as(OfferResponse.class);

        Assert.assertEquals(
                deactivatedOfferData.getMessage(),
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_DEACTIVATE_MESSAGE
        );

        Assert.assertNotNull(
                deactivatedOfferData.getOffer()
        );

        Assert.assertEquals(
                deactivatedOfferData.getOffer().isActive(),
                OfferTestConstants.sellerSuccessfullyDeactivatesOwnOfferTest_ACTIVE
        );
    }

    @Test
    public void sellerSuccessfullyUpdatesOwnOfferTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                loginResponse.getCookie("refreshToken")
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_CREATE_NAME,
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_DESCRIPTION,
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_CATEGORY,
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_PRICE,
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_AVAILABLE_QUANTITY,
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OfferTestConstants.STATUS_CREATED
        );

        OfferResponse createdOfferData =
                createOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                createdOfferData.getMessage(),
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_CREATE_MESSAGE
        );

        Assert.assertNotNull(
                createdOfferData.getOffer()
        );

        String offerId =
                createdOfferData.getOffer().getId();


        OfferUpdateRequest updateRequest =
                new OfferUpdateRequest();

        updateRequest.setName(
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_NAME
        );

        Response updateOfferResponse =
                OffersRequestBuilder.updateOffer(
                        offerId,
                        updateRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                updateOfferResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        OfferResponse updatedOfferData =
                updateOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                updatedOfferData.getMessage(),
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_UPDATE_MESSAGE
        );

        Assert.assertNotNull(
                updatedOfferData.getOffer()
        );

        Assert.assertEquals(
                updatedOfferData.getOffer().getName(),
                OfferTestConstants.sellerSuccessfullyUpdatesOwnOfferTest_NAME
        );
    }

    @Test
    public void sellerCannotCreateOfferWithInvalidPayloadTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                loginResponse.getCookie("refreshToken")
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_NAME,
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_DESCRIPTION,
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_CATEGORY,
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_PRICE,
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_AVAILABLE_QUANTITY,
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OfferTestConstants.STATUS_BAD_REQUEST
        );

        ErrorResponse errorResponse =
                createOfferResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                OfferTestConstants.sellerCannotCreateOfferWithInvalidPayloadTest_ERROR_MESSAGE
        );
    }

    @Test
    public void sellerCannotUpdateOwnOfferWithInvalidPayloadTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                loginResponse.getCookie("refreshToken")
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_CREATE_NAME,
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_DESCRIPTION,
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_CATEGORY,
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_PRICE,
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_AVAILABLE_QUANTITY,
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OfferTestConstants.STATUS_CREATED
        );

        OfferResponse createdOfferData =
                createOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                createdOfferData.getMessage(),
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_CREATE_MESSAGE
        );

        Assert.assertNotNull(
                createdOfferData.getOffer()
        );

        String offerId =
                createdOfferData.getOffer().getId();


        OfferUpdateRequest updateRequest =
                new OfferUpdateRequest();

        updateRequest.setName(
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_INVALID_NAME
        );

        Response updateOfferResponse =
                OffersRequestBuilder.updateOffer(
                        offerId,
                        updateRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                updateOfferResponse.statusCode(),
                OfferTestConstants.STATUS_BAD_REQUEST
        );

        ErrorResponse errorResponse =
                updateOfferResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                OfferTestConstants.sellerCannotUpdateOwnOfferWithInvalidPayloadTest_ERROR_MESSAGE
        );
    }


    @Test
    public void sellerSuccessfullyReactivatesOwnInactiveOfferTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                loginResponse.getCookie("refreshToken")
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_NAME,
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_DESCRIPTION,
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_CATEGORY,
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_PRICE,
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_AVAILABLE_QUANTITY,
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OfferTestConstants.STATUS_CREATED
        );

        OfferResponse createdOfferData =
                createOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                createdOfferData.getMessage(),
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_CREATE_MESSAGE
        );

        Assert.assertNotNull(
                createdOfferData.getOffer()
        );

        String offerId =
                createdOfferData.getOffer().getId();


        Response deactivateResponse =
                OffersRequestBuilder.deactivateOffer(
                        offerId,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                deactivateResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        OfferResponse deactivatedOfferData =
                deactivateResponse.as(OfferResponse.class);

        Assert.assertEquals(
                deactivatedOfferData.getMessage(),
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_DEACTIVATE_MESSAGE
        );

        Assert.assertEquals(
                deactivatedOfferData.getOffer().isActive(),
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_INACTIVE
        );


        Response activateResponse =
                OffersRequestBuilder.activateOffer(
                        offerId,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                activateResponse.statusCode(),
                OfferTestConstants.STATUS_OK
        );

        OfferResponse activatedOfferData =
                activateResponse.as(OfferResponse.class);



        Assert.assertEquals(
                activatedOfferData.getMessage(),
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_ACTIVATE_MESSAGE
        );

        Assert.assertNotNull(
                activatedOfferData.getOffer()
        );

        Assert.assertEquals(
                activatedOfferData.getOffer().isActive(),
                OfferTestConstants.sellerSuccessfullyReactivatesOwnInactiveOfferTest_ACTIVE
        );
    }
}
