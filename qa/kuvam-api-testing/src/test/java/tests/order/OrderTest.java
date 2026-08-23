package tests.order;

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
import tests.order.constants.OrderTestConstants;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class OrderTest extends BaseTest {


    @Test
    public void sellerAcceptsPendingOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                sellerLoginResponse.getCookie("refreshToken")
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.sellerAcceptsPendingOrderTest_OFFER_NAME,
                OrderTestConstants.sellerAcceptsPendingOrderTest_OFFER_DESCRIPTION,
                OrderTestConstants.sellerAcceptsPendingOrderTest_OFFER_CATEGORY,
                OrderTestConstants.sellerAcceptsPendingOrderTest_OFFER_PRICE,
                OrderTestConstants.sellerAcceptsPendingOrderTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.sellerAcceptsPendingOrderTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse createdOfferData =
                createOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                createdOfferData.getMessage(),
                OrderTestConstants.sellerAcceptsPendingOrderTest_OFFER_CREATED_MESSAGE
        );

        Assert.assertNotNull(
                createdOfferData.getOffer()
        );

        String offerId =
                createdOfferData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                buyerLoginResponse.getCookie("refreshToken")
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.sellerAcceptsPendingOrderTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.sellerAcceptsPendingOrderTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse createdOrderData =
                createOrderResponse.as(OrderResponse.class);

        Assert.assertEquals(
                createdOrderData.getMessage(),
                OrderTestConstants.sellerAcceptsPendingOrderTest_ORDER_CREATED_MESSAGE
        );

        Assert.assertNotNull(
                createdOrderData.getOrder()
        );

        String orderId =
                createdOrderData.getOrder().getId();


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptOrderRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response acceptOrderResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptOrderRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );



        SellerOrderResponse acceptedOrderData =
                acceptOrderResponse.as(SellerOrderResponse.class);

        Assert.assertEquals(
                acceptedOrderData.getMessage(),
                OrderTestConstants.sellerAcceptsPendingOrderTest_ACCEPT_MESSAGE
        );

        Assert.assertNotNull(
                acceptedOrderData.getOrder()
        );

        Assert.assertEquals(
                acceptedOrderData.getOrder().getStatus(),
                OrderTestConstants.sellerAcceptsPendingOrderTest_ACCEPTED_STATUS
        );

        Assert.assertNotNull(
                acceptedOrderData.getOrder().getEstimatedPickupAt()
        );
    }

    @Test
    public void sellerRejectsPendingOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                sellerLoginResponse.getCookie("refreshToken")
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.sellerRejectsPendingOrderTest_OFFER_NAME,
                OrderTestConstants.sellerRejectsPendingOrderTest_OFFER_DESCRIPTION,
                OrderTestConstants.sellerRejectsPendingOrderTest_OFFER_CATEGORY,
                OrderTestConstants.sellerRejectsPendingOrderTest_OFFER_PRICE,
                OrderTestConstants.sellerRejectsPendingOrderTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.sellerRejectsPendingOrderTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse createdOfferData =
                createOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                createdOfferData.getMessage(),
                OrderTestConstants.sellerRejectsPendingOrderTest_OFFER_CREATED_MESSAGE
        );

        Assert.assertNotNull(
                createdOfferData.getOffer()
        );

        String offerId =
                createdOfferData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.sellerRejectsPendingOrderTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.sellerRejectsPendingOrderTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse createdOrderData =
                createOrderResponse.as(OrderResponse.class);

        Assert.assertEquals(
                createdOrderData.getMessage(),
                OrderTestConstants.sellerRejectsPendingOrderTest_ORDER_CREATED_MESSAGE
        );

        Assert.assertNotNull(
                createdOrderData.getOrder()
        );

        String orderId =
                createdOrderData.getOrder().getId();


        RejectOrderRequest rejectOrderRequest =
                new RejectOrderRequest(
                        OrderTestConstants.sellerRejectsPendingOrderTest_REJECTION_REASON
                );

        Response rejectOrderResponse =
                OrdersRequestBuilder.rejectOrder(
                        orderId,
                        rejectOrderRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                rejectOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        SellerOrderResponse rejectedOrderData =
                rejectOrderResponse.as(SellerOrderResponse.class);

        Assert.assertEquals(
                rejectedOrderData.getMessage(),
                OrderTestConstants.sellerRejectsPendingOrderTest_REJECT_MESSAGE
        );

        Assert.assertNotNull(
                rejectedOrderData.getOrder()
        );

        Assert.assertEquals(
                rejectedOrderData.getOrder().getStatus(),
                OrderTestConstants.sellerRejectsPendingOrderTest_REJECTED_STATUS
        );

        Assert.assertEquals(
                rejectedOrderData.getOrder().getRejectionReason(),
                OrderTestConstants.sellerRejectsPendingOrderTest_REJECTION_REASON
        );
    }


    @Test
    public void sellerCannotAcceptOrRejectNonPendingOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_OFFER_NAME,
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_OFFER_DESCRIPTION,
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_OFFER_CATEGORY,
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_OFFER_PRICE,
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response firstAcceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                firstAcceptResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response secondAcceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                secondAcceptResponse.statusCode(),
                OrderTestConstants.STATUS_CONFLICT
        );

        ErrorResponse acceptError =
                secondAcceptResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                acceptError.getError().getCode(),
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_ACCEPT_ERROR_CODE
        );

        Assert.assertEquals(
                acceptError.getError().getMessage(),
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_ACCEPT_ERROR_MESSAGE
        );


        RejectOrderRequest rejectRequest =
                new RejectOrderRequest(
                        OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_REJECTION_REASON
                );

        Response rejectResponse =
                OrdersRequestBuilder.rejectOrder(
                        orderId,
                        rejectRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                rejectResponse.statusCode(),
                OrderTestConstants.STATUS_CONFLICT
        );

        ErrorResponse rejectError =
                rejectResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                rejectError.getError().getCode(),
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_REJECT_ERROR_CODE
        );

        Assert.assertEquals(
                rejectError.getError().getMessage(),
                OrderTestConstants.sellerCannotAcceptOrRejectNonPendingOrderTest_REJECT_ERROR_MESSAGE
        );
    }

    @Test
    public void buyerCancelsPendingOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.buyerCancelsPendingOrderTest_OFFER_NAME,
                OrderTestConstants.buyerCancelsPendingOrderTest_OFFER_DESCRIPTION,
                OrderTestConstants.buyerCancelsPendingOrderTest_OFFER_CATEGORY,
                OrderTestConstants.buyerCancelsPendingOrderTest_OFFER_PRICE,
                OrderTestConstants.buyerCancelsPendingOrderTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.buyerCancelsPendingOrderTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        Assert.assertEquals(
                offerData.getMessage(),
                OrderTestConstants.buyerCancelsPendingOrderTest_OFFER_CREATED_MESSAGE
        );

        Assert.assertNotNull(
                offerData.getOffer()
        );

        String offerId =
                offerData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.buyerCancelsPendingOrderTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.buyerCancelsPendingOrderTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        Assert.assertEquals(
                orderData.getMessage(),
                OrderTestConstants.buyerCancelsPendingOrderTest_ORDER_CREATED_MESSAGE
        );

        Assert.assertNotNull(
                orderData.getOrder()
        );

        String orderId =
                orderData.getOrder().getId();


        Response cancelOrderResponse =
                OrdersRequestBuilder.cancelMyOrder(
                        orderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                cancelOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        OrderResponse cancelledOrderData =
                cancelOrderResponse.as(OrderResponse.class);

        Assert.assertEquals(
                cancelledOrderData.getMessage(),
                OrderTestConstants.buyerCancelsPendingOrderTest_CANCEL_MESSAGE
        );

        Assert.assertNotNull(
                cancelledOrderData.getOrder()
        );

        Assert.assertEquals(
                cancelledOrderData.getOrder().getStatus(),
                OrderTestConstants.buyerCancelsPendingOrderTest_CANCELLED_STATUS
        );
    }

    @Test
    public void sellerMarksAcceptedOrderAsReadyTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_OFFER_NAME,
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_OFFER_DESCRIPTION,
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_OFFER_CATEGORY,
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_OFFER_PRICE,
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem =
                new OrderItemRequest(
                        offerId,
                        OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_ORDER_QUANTITY
                );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response acceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response readyResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        orderId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        SellerOrderResponse readyOrderData =
                readyResponse.as(SellerOrderResponse.class);

        Assert.assertEquals(
                readyOrderData.getMessage(),
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_READY_MESSAGE
        );

        Assert.assertNotNull(
                readyOrderData.getOrder()
        );

        Assert.assertEquals(
                readyOrderData.getOrder().getStatus(),
                OrderTestConstants.sellerMarksAcceptedOrderAsReadyTest_READY_STATUS
        );
    }

    @Test
    public void buyerMarksReadyOrderAsOnTheWayTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_OFFER_NAME,
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_OFFER_DESCRIPTION,
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_OFFER_CATEGORY,
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_OFFER_PRICE,
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response acceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response readyResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        orderId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response onTheWayResponse =
                OrdersRequestBuilder.markMyOrderAsOnTheWay(
                        orderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                onTheWayResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                onTheWayResponse.jsonPath().getString("message"),
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_MESSAGE
        );

        Assert.assertEquals(
                onTheWayResponse.jsonPath().getString("order.status"),
                OrderTestConstants.buyerMarksReadyOrderAsOnTheWayTest_READY_STATUS
        );

        Assert.assertNotNull(
                onTheWayResponse.jsonPath().getString("order.buyerOnTheWayAt")
        );
    }

    @Test
    public void sellerCompletesReadyOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.sellerCompletesReadyOrderTest_OFFER_NAME,
                OrderTestConstants.sellerCompletesReadyOrderTest_OFFER_DESCRIPTION,
                OrderTestConstants.sellerCompletesReadyOrderTest_OFFER_CATEGORY,
                OrderTestConstants.sellerCompletesReadyOrderTest_OFFER_PRICE,
                OrderTestConstants.sellerCompletesReadyOrderTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.sellerCompletesReadyOrderTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.sellerCompletesReadyOrderTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.sellerCompletesReadyOrderTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response acceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response readyResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        orderId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response buyerOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        orderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                buyerOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        String pickupCode =
                buyerOrderResponse.jsonPath().getString("order.pickupCode");

        Assert.assertNotNull(pickupCode);

        Assert.assertEquals(
                pickupCode.length(),
                6
        );


        CompleteOrderRequest completeOrderRequest =
                new CompleteOrderRequest(pickupCode);

        Response completeResponse =
                OrdersRequestBuilder.completeOrder(
                        orderId,
                        completeOrderRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                completeResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                completeResponse.jsonPath().getString("message"),
                OrderTestConstants.sellerCompletesReadyOrderTest_COMPLETE_MESSAGE
        );

        Assert.assertEquals(
                completeResponse.jsonPath().getString("order.status"),
                OrderTestConstants.sellerCompletesReadyOrderTest_COMPLETED_STATUS
        );
    }


    @Test
    public void sellerEntersIncorrectPickupCodeTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_OFFER_NAME,
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_OFFER_DESCRIPTION,
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_OFFER_CATEGORY,
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_OFFER_PRICE,
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response acceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response readyResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        orderId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        CompleteOrderRequest completeOrderRequest =
                new CompleteOrderRequest(
                        OrderTestConstants.sellerEntersIncorrectPickupCodeTest_INVALID_PICKUP_CODE
                );

        Response completeResponse =
                OrdersRequestBuilder.completeOrder(
                        orderId,
                        completeOrderRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                completeResponse.statusCode(),
                OrderTestConstants.STATUS_UNPROCESSABLE_ENTITY
        );

        ErrorResponse errorData =
                completeResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorData.getError().getCode(),
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorData.getError().getMessage(),
                OrderTestConstants.sellerEntersIncorrectPickupCodeTest_ERROR_MESSAGE
        );
    }

    @Test
    public void pickupCodeGetsTemporarilyBlockedTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_OFFER_NAME,
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_OFFER_DESCRIPTION,
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_OFFER_CATEGORY,
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_OFFER_PRICE,
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response acceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response readyResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        orderId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        CompleteOrderRequest invalidCodeRequest =
                new CompleteOrderRequest(
                        OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_INVALID_PICKUP_CODE
                );


        for (int attempt = 1; attempt <= 4; attempt++) {

            Response invalidCodeResponse =
                    OrdersRequestBuilder.completeOrder(
                            orderId,
                            invalidCodeRequest,
                            sellerLoginData.getAccessToken()
                    );

            Assert.assertEquals(
                    invalidCodeResponse.statusCode(),
                    OrderTestConstants.STATUS_UNPROCESSABLE_ENTITY
            );

            ErrorResponse errorData =
                    invalidCodeResponse.as(ErrorResponse.class);

            Assert.assertEquals(
                    errorData.getError().getCode(),
                    OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_INVALID_CODE
            );

            Assert.assertEquals(
                    errorData.getError().getMessage(),
                    "Pickup code is not correct. Remaining attempts: " + (5 - attempt) + "."
            );
        }


        Response fifthAttemptResponse =
                OrdersRequestBuilder.completeOrder(
                        orderId,
                        invalidCodeRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                fifthAttemptResponse.statusCode(),
                OrderTestConstants.STATUS_TOO_MANY_REQUESTS
        );

        ErrorResponse fifthAttemptError =
                fifthAttemptResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                fifthAttemptError.getError().getCode(),
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_BLOCKED_CODE
        );

        Assert.assertEquals(
                fifthAttemptError.getError().getMessage(),
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_BLOCKED_MESSAGE
        );


        Response blockedAttemptResponse =
                OrdersRequestBuilder.completeOrder(
                        orderId,
                        invalidCodeRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                blockedAttemptResponse.statusCode(),
                OrderTestConstants.STATUS_TOO_MANY_REQUESTS
        );

        ErrorResponse blockedAttemptError =
                blockedAttemptResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                blockedAttemptError.getError().getCode(),
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_BLOCKED_CODE
        );

        Assert.assertEquals(
                blockedAttemptError.getError().getMessage(),
                OrderTestConstants.pickupCodeGetsTemporarilyBlockedTest_ALREADY_BLOCKED_MESSAGE
        );
    }

    @Test
    public void buyerReceivesPickupInformationOnlyInAllowedStatesTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_OFFER_NAME,
                OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_OFFER_DESCRIPTION,
                OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_OFFER_CATEGORY,
                OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_OFFER_PRICE,
                OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_OFFER_AVAILABLE_QUANTITY,
                OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        OrderRequest firstOrderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        offerId,
                                        OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_ORDER_QUANTITY
                                )
                        ),
                        OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_BUYER_NOTE
                );

        Response firstOrderResponse =
                OrdersRequestBuilder.createOrder(
                        firstOrderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                firstOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        String firstOrderId =
                firstOrderResponse.as(OrderResponse.class)
                        .getOrder()
                        .getId();


        Response pendingOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        firstOrderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                pendingOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNull(
                pendingOrderResponse.jsonPath().get("order.seller.pickupAddress")
        );

        Assert.assertNull(
                pendingOrderResponse.jsonPath().get("order.pickupCode")
        );


        String estimatedPickupAt =
                Instant.now()
                        .plus(2, ChronoUnit.HOURS)
                        .toString();

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(estimatedPickupAt);

        Response acceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        firstOrderId,
                        acceptRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response acceptedOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        firstOrderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                acceptedOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                acceptedOrderResponse.jsonPath().get("order.seller.pickupAddress")
        );

        Assert.assertNull(
                acceptedOrderResponse.jsonPath().get("order.pickupCode")
        );


        Response readyResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        firstOrderId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response readyOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        firstOrderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                readyOrderResponse.jsonPath().get("order.seller.pickupAddress")
        );

        String pickupCode =
                readyOrderResponse.jsonPath().getString("order.pickupCode");

        Assert.assertNotNull(
                pickupCode
        );

        Assert.assertEquals(
                pickupCode.length(),
                6
        );

        Assert.assertNull(
                readyOrderResponse.jsonPath().get("order.pickupCodeAttempts")
        );

        Assert.assertNull(
                readyOrderResponse.jsonPath().get("order.pickupCodeBlockedUntil")
        );


        CompleteOrderRequest completeOrderRequest =
                new CompleteOrderRequest(pickupCode);

        Response completeResponse =
                OrdersRequestBuilder.completeOrder(
                        firstOrderId,
                        completeOrderRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                completeResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response completedOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        firstOrderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                completedOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                completedOrderResponse.jsonPath().get("order.seller.pickupAddress")
        );

        Assert.assertNull(
                completedOrderResponse.jsonPath().get("order.pickupCode")
        );


        OrderRequest secondOrderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        offerId,
                                        OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_ORDER_QUANTITY
                                )
                        ),
                        OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_BUYER_NOTE
                );

        Response secondOrderResponse =
                OrdersRequestBuilder.createOrder(
                        secondOrderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                secondOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        String secondOrderId =
                secondOrderResponse.as(OrderResponse.class)
                        .getOrder()
                        .getId();

        RejectOrderRequest rejectRequest =
                new RejectOrderRequest(
                        OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_REJECTION_REASON
                );

        Response rejectResponse =
                OrdersRequestBuilder.rejectOrder(
                        secondOrderId,
                        rejectRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                rejectResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response rejectedOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        secondOrderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                rejectedOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNull(
                rejectedOrderResponse.jsonPath().get("order.seller.pickupAddress")
        );

        Assert.assertNull(
                rejectedOrderResponse.jsonPath().get("order.pickupCode")
        );


        OrderRequest thirdOrderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        offerId,
                                        OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_ORDER_QUANTITY
                                )
                        ),
                        OrderTestConstants.buyerReceivesPickupInformationOnlyInAllowedStatesTest_BUYER_NOTE
                );

        Response thirdOrderResponse =
                OrdersRequestBuilder.createOrder(
                        thirdOrderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                thirdOrderResponse.statusCode(),
                OrderTestConstants.STATUS_CREATED
        );

        String thirdOrderId =
                thirdOrderResponse.as(OrderResponse.class)
                        .getOrder()
                        .getId();


        Response cancelResponse =
                OrdersRequestBuilder.cancelMyOrder(
                        thirdOrderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                cancelResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );


        Response cancelledOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        thirdOrderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                cancelledOrderResponse.statusCode(),
                OrderTestConstants.STATUS_OK
        );

        Assert.assertNull(
                cancelledOrderResponse.jsonPath().get("order.seller.pickupAddress")
        );

        Assert.assertNull(
                cancelledOrderResponse.jsonPath().get("order.pickupCode")
        );
    }
}
