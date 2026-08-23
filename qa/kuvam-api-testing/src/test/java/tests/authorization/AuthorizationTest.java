package tests.authorization;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.*;
import com.rajcic.dto.response.*;
import com.rajcic.requestbuilder.admin.AdminRequestBuilder;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import com.rajcic.requestbuilder.orders.OrdersRequestBuilder;
import com.rajcic.requestbuilder.profile.ProfileRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.authorization.constants.AuthorizationTestConstants;

import java.util.ArrayList;
import java.util.List;


public class AuthorizationTest extends BaseTest {


    @Test
    public void nonAdminAccessAdminEndpointTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response loginResponse = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData = loginResponse.as(LoginResponse.class);

        Response adminResponse =
                AdminRequestBuilder.getUsers(loginData.getAccessToken());

        Assert.assertEquals(
                adminResponse.statusCode(),
                AuthorizationTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse = adminResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                AuthorizationTestConstants.FORBIDDEN_CODE
        );
        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                AuthorizationTestConstants.FORBIDDEN_MESSAGE
        );
    }


    @Test
    public void adminAccessAdminEndpointTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("adminEmail"),
                ConfigReader.get("adminPassword")
        );

        Response loginResponse = AuthRequestBuilder.adminLogin(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        LoginResponse loginData = loginResponse.as(LoginResponse.class);

        Response adminResponse =
                AdminRequestBuilder.getUsers(loginData.getAccessToken());

        Assert.assertEquals(
                adminResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        AdminGetUsersResponse usersResponse =
                adminResponse.as(AdminGetUsersResponse.class);

        Assert.assertFalse(usersResponse.getUsers().isEmpty());
    }


    @Test
    public void buyerCannotCreateSellerOfferTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response loginResponse = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData = loginResponse.as(LoginResponse.class);

        OfferRequest offerRequest = new OfferRequest(
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_NAME,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_DESCRIPTION,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_CATEGORY,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_PRICE,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_AVAILABLE_QUANTITY,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_UNIT
        );

        Response offerResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                offerResponse.statusCode(),
                AuthorizationTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse = offerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                AuthorizationTestConstants.FORBIDDEN_CODE
        );
        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                AuthorizationTestConstants.FORBIDDEN_MESSAGE
        );
    }


    @Test
    public void sellerCannotAccessBuyerOrdersTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse = AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData = loginResponse.as(LoginResponse.class);

        Response ordersResponse =
                OrdersRequestBuilder.getMyOrders(loginData.getAccessToken());

        Assert.assertEquals(
                ordersResponse.statusCode(),
                AuthorizationTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse = ordersResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                AuthorizationTestConstants.FORBIDDEN_CODE
        );
        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                AuthorizationTestConstants.FORBIDDEN_MESSAGE
        );
    }


    @Test
    public void adminCannotAccessBuyerOrSellerEndpointsTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("adminEmail"),
                ConfigReader.get("adminPassword")
        );

        Response loginResponse = AuthRequestBuilder.adminLogin(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        LoginResponse loginData = loginResponse.as(LoginResponse.class);


        Response ordersResponse =
                OrdersRequestBuilder.getMyOrders(loginData.getAccessToken());

        ErrorResponse ordersError = ordersResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                ordersError.getError().getCode(),
                AuthorizationTestConstants.FORBIDDEN_CODE
        );
        Assert.assertEquals(
                ordersError.getError().getMessage(),
                AuthorizationTestConstants.FORBIDDEN_MESSAGE
        );


        Response offersResponse =
                OffersRequestBuilder.getMyOffers(loginData.getAccessToken());

        ErrorResponse offersError = offersResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                offersError.getError().getCode(),
                AuthorizationTestConstants.FORBIDDEN_CODE
        );
        Assert.assertEquals(
                offersError.getError().getMessage(),
                AuthorizationTestConstants.FORBIDDEN_MESSAGE
        );
    }


    @Test
    public void buyerCannotAccessAnotherBuyersOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(sellerLoginResponse.getCookie("refreshToken"));

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);

        Response offersResponse =
                OffersRequestBuilder.getMyOffers(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                offersResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        OffersResponse offersData =
                offersResponse.as(OffersResponse.class);

        Assert.assertNotNull(offersData.getOffers());
        Assert.assertFalse(offersData.getOffers().isEmpty());

        String offerId = offersData.getOffers().getFirst().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(buyerLoginResponse.getCookie("refreshToken"));

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);

        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                AuthorizationTestConstants.ORDER_ITEM_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();

        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                AuthorizationTestConstants.EMPTY_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                AuthorizationTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        Assert.assertNotNull(orderData.getOrder());
        Assert.assertEquals(
                orderData.getMessage(),
                AuthorizationTestConstants.ORDER_CREATED_MESSAGE
        );

        String orderId = orderData.getOrder().getId();


        LoginRequest secondBuyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyer2Email"),
                ConfigReader.get("buyer2Password")
        );

        Response secondBuyerLoginResponse =
                AuthRequestBuilder.login(secondBuyerLoginRequest);

        Assert.assertEquals(
                secondBuyerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(
                secondBuyerLoginResponse.getCookie("refreshToken")
        );

        LoginResponse secondBuyerLoginData =
                secondBuyerLoginResponse.as(LoginResponse.class);

        Response orderResponse =
                OrdersRequestBuilder.getMyOrder(
                        orderId,
                        secondBuyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                orderResponse.statusCode(),
                AuthorizationTestConstants.STATUS_NOT_FOUND
        );

        ErrorResponse errorResponse =
                orderResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                AuthorizationTestConstants.ORDER_NOT_FOUND_CODE
        );
        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                AuthorizationTestConstants.ORDER_NOT_FOUND_MESSAGE
        );
    }


    @Test
    public void sellerCannotModifyAnotherSellersOfferTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(sellerLoginResponse.getCookie("refreshToken"));

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);

        Response offersResponse =
                OffersRequestBuilder.getMyOffers(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                offersResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        OffersResponse offersData =
                offersResponse.as(OffersResponse.class);

        Assert.assertNotNull(offersData.getOffers());
        Assert.assertFalse(offersData.getOffers().isEmpty());

        String offerId = offersData.getOffers().getFirst().getId();


        LoginRequest otherSellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSeller2Email"),
                ConfigReader.get("approvedSeller2Password")
        );

        Response otherSellerLoginResponse =
                AuthRequestBuilder.login(otherSellerLoginRequest);

        Assert.assertEquals(
                otherSellerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(
                otherSellerLoginResponse.getCookie("refreshToken")
        );

        LoginResponse otherSellerLoginData =
                otherSellerLoginResponse.as(LoginResponse.class);

        OfferUpdateRequest updateRequest = new OfferUpdateRequest();

        updateRequest.setName(
                AuthorizationTestConstants.sellerCannotModifyAnotherSellersOfferTest_NAME
        );

        Response updateResponse =
                OffersRequestBuilder.updateOffer(
                        offerId,
                        updateRequest,
                        otherSellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                updateResponse.statusCode(),
                AuthorizationTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                updateResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                AuthorizationTestConstants.sellerCannotModifyAnotherSellersOfferTest_ERROR_CODE
        );
        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                AuthorizationTestConstants.sellerCannotModifyAnotherSellersOfferTest_ERROR_MESSAGE
        );
    }


    @Test
    public void sellerCannotAccessAnotherSellersReceivedOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(sellerLoginResponse.getCookie("refreshToken"));

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);

        Response offersResponse =
                OffersRequestBuilder.getMyOffers(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                offersResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        OffersResponse offersData =
                offersResponse.as(OffersResponse.class);

        Assert.assertNotNull(offersData.getOffers());
        Assert.assertFalse(offersData.getOffers().isEmpty());

        String offerId = offersData.getOffers().getFirst().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(buyerLoginResponse.getCookie("refreshToken"));

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);

        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                AuthorizationTestConstants.ORDER_ITEM_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();

        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                AuthorizationTestConstants.EMPTY_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                AuthorizationTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        Assert.assertNotNull(orderData.getOrder());
        Assert.assertEquals(
                orderData.getMessage(),
                AuthorizationTestConstants.ORDER_CREATED_MESSAGE
        );

        String orderId = orderData.getOrder().getId();


        LoginRequest otherSellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSeller2Email"),
                ConfigReader.get("approvedSeller2Password")
        );

        Response otherSellerLoginResponse =
                AuthRequestBuilder.login(otherSellerLoginRequest);

        Assert.assertEquals(
                otherSellerLoginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(
                otherSellerLoginResponse.getCookie("refreshToken")
        );

        LoginResponse otherSellerLoginData =
                otherSellerLoginResponse.as(LoginResponse.class);

        Response orderResponse =
                OrdersRequestBuilder.getMyRecievedOrder(
                        orderId,
                        otherSellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                orderResponse.statusCode(),
                AuthorizationTestConstants.STATUS_NOT_FOUND
        );

        ErrorResponse errorResponse =
                orderResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                AuthorizationTestConstants.ORDER_NOT_FOUND_CODE
        );
        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                AuthorizationTestConstants.ORDER_NOT_FOUND_MESSAGE
        );
    }


    @Test
    public void authenticatedUserProfileUpdateIsSelfScopedTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        UpdateProfileRequest updateRequest =
                new UpdateProfileRequest();

        updateRequest.setFirstName(
                AuthorizationTestConstants.authenticatedUserProfileUpdateIsSelfScopedTest_NAME
        );

        Response profileResponse =
                ProfileRequestBuilder.updateMyProfile(
                        updateRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                profileResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        UpdateProfileResponse profileData =
                profileResponse.as(UpdateProfileResponse.class);

        Assert.assertEquals(
                profileData.getMessage(),
                AuthorizationTestConstants.authenticatedUserProfileUpdateIsSelfScopedTest_MESSAGE
        );
        Assert.assertNotNull(profileData.getUser());
        Assert.assertEquals(
                profileData.getUser().getFirstName(),
                AuthorizationTestConstants.authenticatedUserProfileUpdateIsSelfScopedTest_NAME
        );
    }


    @Test
    public void buyerCanAccessOwnOrdersTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        Response ordersResponse =
                OrdersRequestBuilder.getMyOrders(
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                ordersResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        OrdersResponse ordersData =
                ordersResponse.as(OrdersResponse.class);

        Assert.assertEquals(
                ordersData.getMessage(),
                AuthorizationTestConstants.buyerCanAccessOwnOrdersTest_MESSAGE
        );
        Assert.assertNotNull(ordersData.getOrders());
    }


    @Test
    public void sellerCanAccessOwnOffersTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        Response offersResponse =
                OffersRequestBuilder.getMyOffers(
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                offersResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        SellerOffersResponse offersData =
                offersResponse.as(SellerOffersResponse.class);

        Assert.assertEquals(
                offersData.getMessage(),
                AuthorizationTestConstants.sellerCanAccessOwnOffersTest_MESSAGE
        );
        Assert.assertNotNull(offersData.getOffers());
    }


    @Test
    public void sellerCanAccessOwnReceivedOrdersTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );
        Assert.assertNotNull(loginResponse.getCookie("refreshToken"));

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        Response ordersResponse =
                OrdersRequestBuilder.getMyRecievedOrders(
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                loginResponse.statusCode(),
                AuthorizationTestConstants.STATUS_OK
        );

        SellerOrdersResponse ordersData =
                ordersResponse.as(SellerOrdersResponse.class);

        Assert.assertEquals(
                ordersData.getMessage(),
                AuthorizationTestConstants.sellerCanAccessOwnReceivedOrdersTest_MESSAGE
        );
        Assert.assertNotNull(ordersData.getOrders());
    }
}