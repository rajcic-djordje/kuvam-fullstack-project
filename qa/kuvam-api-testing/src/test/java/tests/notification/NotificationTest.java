package tests.notification;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.AcceptOrderRequest;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.OfferRequest;
import com.rajcic.dto.request.OrderItemRequest;
import com.rajcic.dto.request.OrderRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.OfferResponse;
import com.rajcic.dto.response.OrderResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.notification.NotificationRequestBuilder;

import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import com.rajcic.requestbuilder.orders.OrdersRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.notification.constants.NotificationTestConstants;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class NotificationTest extends BaseTest {


    @Test
    public void userCanMarkOwnNotificationsAsReadTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
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
                NotificationTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_OFFER_NAME,
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_OFFER_DESCRIPTION,
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_OFFER_CATEGORY,
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_OFFER_PRICE,
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_OFFER_AVAILABLE_QUANTITY,
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                NotificationTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        OrderRequest orderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        offerId,
                                        NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_ORDER_QUANTITY
                                )
                        ),
                        NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_BUYER_NOTE
                );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                NotificationTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


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
                NotificationTestConstants.STATUS_OK
        );


        Response readyOrderResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        orderId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                readyOrderResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );


        Response unreadCountResponse =
                NotificationRequestBuilder.getUnreadCount(
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                unreadCountResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        int unreadCountBefore =
                unreadCountResponse.jsonPath().getInt("unreadCount");

        Assert.assertTrue(
                unreadCountBefore >= 2
        );


        Response notificationsResponse =
                NotificationRequestBuilder.getNotifications(
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                notificationsResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        String notificationId =
                notificationsResponse.jsonPath()
                        .getString("notifications[0]._id");

        Assert.assertNotNull(
                notificationId
        );

        Assert.assertEquals(
                notificationsResponse.jsonPath()
                        .getString("notifications[0].order"),
                orderId
        );

        Assert.assertFalse(
                notificationsResponse.jsonPath()
                        .getBoolean("notifications[0].isRead")
        );


        Response markAsReadResponse =
                NotificationRequestBuilder.markNotificationAsRead(
                        notificationId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                markAsReadResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                markAsReadResponse.jsonPath().getString("message"),
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_READ_MESSAGE
        );

        Assert.assertTrue(
                markAsReadResponse.jsonPath()
                        .getBoolean("notification.isRead")
        );


        Response unreadCountAfterSingleReadResponse =
                NotificationRequestBuilder.getUnreadCount(
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                unreadCountAfterSingleReadResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                unreadCountAfterSingleReadResponse.jsonPath()
                        .getInt("unreadCount"),
                unreadCountBefore - 1
        );


        Response markAllAsReadResponse =
                NotificationRequestBuilder.markAllNotificationsAsRead(
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                markAllAsReadResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                markAllAsReadResponse.jsonPath().getString("message"),
                NotificationTestConstants.userCanMarkOwnNotificationsAsReadTest_READ_ALL_MESSAGE
        );


        Response finalUnreadCountResponse =
                NotificationRequestBuilder.getUnreadCount(
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                finalUnreadCountResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                finalUnreadCountResponse.jsonPath().getInt("unreadCount"),
                0
        );
    }


    @Test
    public void userCannotMarkAnotherUsersNotificationAsReadTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
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
                NotificationTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_OFFER_NAME,
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_OFFER_DESCRIPTION,
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_OFFER_CATEGORY,
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_OFFER_PRICE,
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_OFFER_AVAILABLE_QUANTITY,
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                NotificationTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        OrderRequest orderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        offerId,
                                        NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_ORDER_QUANTITY
                                )
                        ),
                        NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_BUYER_NOTE
                );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                NotificationTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        Response sellerNotificationsResponse =
                NotificationRequestBuilder.getNotifications(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                sellerNotificationsResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        String sellerNotificationId =
                sellerNotificationsResponse.jsonPath()
                        .getString("notifications[0]._id");

        Assert.assertNotNull(
                sellerNotificationId
        );

        Assert.assertEquals(
                sellerNotificationsResponse.jsonPath()
                        .getString("notifications[0].order"),
                orderId
        );

        Assert.assertFalse(
                sellerNotificationsResponse.jsonPath()
                        .getBoolean("notifications[0].isRead")
        );


        Response unauthorizedReadResponse =
                NotificationRequestBuilder.markNotificationAsRead(
                        sellerNotificationId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                unauthorizedReadResponse.statusCode(),
                NotificationTestConstants.STATUS_NOT_FOUND
        );

        ErrorResponse errorData =
                unauthorizedReadResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorData.getError().getCode(),
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorData.getError().getMessage(),
                NotificationTestConstants.userCannotMarkAnotherUsersNotificationAsReadTest_ERROR_MESSAGE
        );


        Response sellerNotificationsAfterAttemptResponse =
                NotificationRequestBuilder.getNotifications(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                sellerNotificationsAfterAttemptResponse.statusCode(),
                NotificationTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                sellerNotificationsAfterAttemptResponse.jsonPath()
                        .getString("notifications[0]._id"),
                sellerNotificationId
        );

        Assert.assertFalse(
                sellerNotificationsAfterAttemptResponse.jsonPath()
                        .getBoolean("notifications[0].isRead")
        );
    }
}