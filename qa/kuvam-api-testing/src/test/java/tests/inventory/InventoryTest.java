package tests.inventory;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.*;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.OfferResponse;
import com.rajcic.dto.response.OrderResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import com.rajcic.requestbuilder.orders.OrdersRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.inventory.constants.InventoryTestConstants;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class InventoryTest extends BaseTest {

    @Test
    public void buyerSuccessfullyCreatesOrderTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_OFFER_NAME,
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_OFFER_DESCRIPTION,
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_OFFER_CATEGORY,
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_OFFER_PRICE,
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_OFFER_AVAILABLE_QUANTITY,
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

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
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_ORDER_QUANTITY
        );

        List<OrderItemRequest> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderRequest orderRequest = new OrderRequest(
                orderItems,
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        Assert.assertEquals(
                orderData.getMessage(),
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_MESSAGE
        );

        Assert.assertNotNull(
                orderData.getOrder()
        );

        Assert.assertEquals(
                orderData.getOrder().getStatus(),
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_PENDING_STATUS
        );

        Assert.assertEquals(
                orderData.getOrder().getBuyer(),
                buyerLoginData.getUser().getId()
        );

        Assert.assertNotNull(
                orderData.getOrder().getSeller()
        );

        Assert.assertEquals(
                orderData.getOrder().getItems().size(),
                1
        );

        Assert.assertEquals(
                orderData.getOrder().getItems().get(0).getOffer(),
                offerId
        );

        Assert.assertEquals(
                orderData.getOrder().getItems().get(0).getQuantity(),
                InventoryTestConstants.buyerSuccessfullyCreatesOrderTest_ORDER_QUANTITY
        );
    }

    @Test
    public void orderCreationIsRejectedWhenBusinessRulesAreNotSatisfiedTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        LoginRequest secondSellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSeller2Email"),
                ConfigReader.get("approvedSeller2Password")
        );

        Response secondSellerLoginResponse =
                AuthRequestBuilder.login(secondSellerLoginRequest);

        Assert.assertEquals(
                secondSellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse secondSellerLoginData =
                secondSellerLoginResponse.as(LoginResponse.class);


        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OrderItemRequest missingOfferItem =
                new OrderItemRequest(
                        InventoryTestConstants.orderCreationBusinessRulesTest_NON_EXISTING_OFFER_ID,
                        InventoryTestConstants.orderCreationBusinessRulesTest_VALID_QUANTITY
                );

        OrderRequest missingOfferRequest =
                new OrderRequest(
                        List.of(missingOfferItem),
                        InventoryTestConstants.orderCreationBusinessRulesTest_BUYER_NOTE
                );

        Response missingOfferResponse =
                OrdersRequestBuilder.createOrder(
                        missingOfferRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                missingOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_NOT_FOUND
        );

        ErrorResponse missingOfferError =
                missingOfferResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                missingOfferError.getError().getCode(),
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_NOT_FOUND_CODE
        );

        Assert.assertEquals(
                missingOfferError.getError().getMessage(),
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_NOT_FOUND_MESSAGE
        );


        OfferRequest firstOfferRequest = new OfferRequest(
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_NAME,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_DESCRIPTION,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_CATEGORY,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_PRICE,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_AVAILABLE_QUANTITY,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_UNIT
        );

        Response firstOfferResponse =
                OffersRequestBuilder.createOffer(
                        firstOfferRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                firstOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OfferResponse firstOfferData =
                firstOfferResponse.as(OfferResponse.class);

        Assert.assertNotNull(
                firstOfferData.getOffer()
        );

        String firstOfferId =
                firstOfferData.getOffer().getId();


        OrderItemRequest excessiveQuantityItem =
                new OrderItemRequest(
                        firstOfferId,
                        InventoryTestConstants.orderCreationBusinessRulesTest_EXCESS_QUANTITY
                );

        OrderRequest excessiveQuantityRequest =
                new OrderRequest(
                        List.of(excessiveQuantityItem),
                        InventoryTestConstants.orderCreationBusinessRulesTest_BUYER_NOTE
                );

        Response excessiveQuantityResponse =
                OrdersRequestBuilder.createOrder(
                        excessiveQuantityRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                excessiveQuantityResponse.statusCode(),
                InventoryTestConstants.STATUS_CONFLICT
        );

        ErrorResponse excessiveQuantityError =
                excessiveQuantityResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                excessiveQuantityError.getError().getCode(),
                InventoryTestConstants.orderCreationBusinessRulesTest_INSUFFICIENT_QUANTITY_CODE
        );

        Assert.assertEquals(
                excessiveQuantityError.getError().getMessage(),
                "Requested quantity is not available for offer \"" +
                        InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_NAME +
                        "\"."
        );


        OfferRequest secondOfferRequest = new OfferRequest(
                InventoryTestConstants.orderCreationBusinessRulesTest_SECOND_OFFER_NAME,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_DESCRIPTION,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_CATEGORY,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_PRICE,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_AVAILABLE_QUANTITY,
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_UNIT
        );

        Response secondOfferResponse =
                OffersRequestBuilder.createOffer(
                        secondOfferRequest,
                        secondSellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                secondOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OfferResponse secondOfferData =
                secondOfferResponse.as(OfferResponse.class);

        Assert.assertNotNull(
                secondOfferData.getOffer()
        );

        String secondOfferId =
                secondOfferData.getOffer().getId();


        OrderRequest multipleSellersRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        firstOfferId,
                                        InventoryTestConstants.orderCreationBusinessRulesTest_VALID_QUANTITY
                                ),
                                new OrderItemRequest(
                                        secondOfferId,
                                        InventoryTestConstants.orderCreationBusinessRulesTest_VALID_QUANTITY
                                )
                        ),
                        InventoryTestConstants.orderCreationBusinessRulesTest_BUYER_NOTE
                );

        Response multipleSellersResponse =
                OrdersRequestBuilder.createOrder(
                        multipleSellersRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                multipleSellersResponse.statusCode(),
                InventoryTestConstants.STATUS_CONFLICT
        );

        ErrorResponse multipleSellersError =
                multipleSellersResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                multipleSellersError.getError().getCode(),
                InventoryTestConstants.orderCreationBusinessRulesTest_MULTIPLE_SELLERS_CODE
        );

        Assert.assertEquals(
                multipleSellersError.getError().getMessage(),
                InventoryTestConstants.orderCreationBusinessRulesTest_MULTIPLE_SELLERS_MESSAGE
        );


        Response deactivateOfferResponse =
                OffersRequestBuilder.deactivateOffer(
                        firstOfferId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                deactivateOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        OrderRequest inactiveOfferRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        firstOfferId,
                                        InventoryTestConstants.orderCreationBusinessRulesTest_VALID_QUANTITY
                                )
                        ),
                        InventoryTestConstants.orderCreationBusinessRulesTest_BUYER_NOTE
                );

        Response inactiveOfferResponse =
                OrdersRequestBuilder.createOrder(
                        inactiveOfferRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                inactiveOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CONFLICT
        );

        ErrorResponse inactiveOfferError =
                inactiveOfferResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                inactiveOfferError.getError().getCode(),
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_NOT_AVAILABLE_CODE
        );

        Assert.assertEquals(
                inactiveOfferError.getError().getMessage(),
                InventoryTestConstants.orderCreationBusinessRulesTest_OFFER_NOT_AVAILABLE_MESSAGE
        );
    }


    @Test
    public void orderCreationUpdatesQuantityAndPriceSnapshotTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
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
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_NAME,
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_DESCRIPTION,
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_CATEGORY,
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_PRICE,
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_INITIAL_QUANTITY,
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        OrderItemRequest orderItem = new OrderItemRequest(
                offerId,
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_ORDER_QUANTITY
        );

        OrderRequest orderRequest = new OrderRequest(
                List.of(orderItem),
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_BUYER_NOTE
        );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();

        double expectedItemTotal =
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_PRICE
                        * InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_ORDER_QUANTITY;

        int expectedRemainingQuantity =
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_INITIAL_QUANTITY
                        - InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_ORDER_QUANTITY;


        Assert.assertEquals(
                orderData.getOrder().getItems().get(0).getUnitPrice(),
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_PRICE
        );

        Assert.assertEquals(
                orderData.getOrder().getItems().get(0).getTotalPrice(),
                expectedItemTotal
        );

        Assert.assertEquals(
                orderData.getOrder().getTotalPrice(),
                expectedItemTotal
        );


        Response offerAfterOrderResponse =
                OffersRequestBuilder.getOffer(offerId);

        Assert.assertEquals(
                offerAfterOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                offerAfterOrderResponse.jsonPath().getInt("offer.availableQuantity"),
                expectedRemainingQuantity
        );


        OfferUpdateRequest updateOfferRequest =
                new OfferUpdateRequest();

        updateOfferRequest.setPrice(
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_UPDATED_OFFER_PRICE
        );

        Response updateOfferResponse =
                OffersRequestBuilder.updateOffer(
                        offerId,
                        updateOfferRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                updateOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );


        Response orderAfterPriceChangeResponse =
                OrdersRequestBuilder.getMyOrder(
                        orderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                orderAfterPriceChangeResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                orderAfterPriceChangeResponse.jsonPath().getDouble("order.items[0].unitPrice"),
                InventoryTestConstants.orderCreationUpdatesQuantityAndPriceSnapshotTest_OFFER_PRICE
        );

        Assert.assertEquals(
                orderAfterPriceChangeResponse.jsonPath().getDouble("order.items[0].totalPrice"),
                expectedItemTotal
        );

        Assert.assertEquals(
                orderAfterPriceChangeResponse.jsonPath().getDouble("order.totalPrice"),
                expectedItemTotal
        );
    }


    @Test
    public void orderCreationRollsBackQuantitiesTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
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
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OfferRequest firstOfferRequest = new OfferRequest(
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_FIRST_OFFER_NAME,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_DESCRIPTION,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_CATEGORY,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_PRICE,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_FIRST_OFFER_QUANTITY,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_UNIT
        );

        Response firstOfferResponse =
                OffersRequestBuilder.createOffer(
                        firstOfferRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                firstOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OfferResponse firstOfferData =
                firstOfferResponse.as(OfferResponse.class);

        String firstOfferId =
                firstOfferData.getOffer().getId();


        OfferRequest secondOfferRequest = new OfferRequest(
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_SECOND_OFFER_NAME,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_DESCRIPTION,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_CATEGORY,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_PRICE,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_SECOND_OFFER_QUANTITY,
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_OFFER_UNIT
        );

        Response secondOfferResponse =
                OffersRequestBuilder.createOffer(
                        secondOfferRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                secondOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OfferResponse secondOfferData =
                secondOfferResponse.as(OfferResponse.class);

        String secondOfferId =
                secondOfferData.getOffer().getId();


        OrderRequest orderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        firstOfferId,
                                        InventoryTestConstants.orderCreationRollsBackQuantitiesTest_FIRST_ORDER_QUANTITY
                                ),
                                new OrderItemRequest(
                                        secondOfferId,
                                        InventoryTestConstants.orderCreationRollsBackQuantitiesTest_SECOND_ORDER_QUANTITY
                                )
                        ),
                        InventoryTestConstants.orderCreationRollsBackQuantitiesTest_BUYER_NOTE
                );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_CONFLICT
        );

        ErrorResponse errorData =
                createOrderResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorData.getError().getCode(),
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorData.getError().getMessage(),
                "Requested quantity is not available for offer \"" +
                        InventoryTestConstants.orderCreationRollsBackQuantitiesTest_SECOND_OFFER_NAME +
                        "\"."
        );


        Response firstOfferAfterFailureResponse =
                OffersRequestBuilder.getOffer(firstOfferId);

        Assert.assertEquals(
                firstOfferAfterFailureResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                firstOfferAfterFailureResponse.jsonPath().getInt("offer.availableQuantity"),
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_FIRST_OFFER_QUANTITY
        );


        Response secondOfferAfterFailureResponse =
                OffersRequestBuilder.getOffer(secondOfferId);

        Assert.assertEquals(
                secondOfferAfterFailureResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                secondOfferAfterFailureResponse.jsonPath().getInt("offer.availableQuantity"),
                InventoryTestConstants.orderCreationRollsBackQuantitiesTest_SECOND_OFFER_QUANTITY
        );
    }

    @Test
    public void cancellingPendingOrderRestoresQuantityTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
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
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_OFFER_NAME,
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_OFFER_DESCRIPTION,
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_OFFER_CATEGORY,
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_OFFER_PRICE,
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY,
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
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
                                        InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_ORDER_QUANTITY
                                )
                        ),
                        InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_BUYER_NOTE
                );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        Response offerAfterOrderResponse =
                OffersRequestBuilder.getOffer(offerId);

        Assert.assertEquals(
                offerAfterOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                offerAfterOrderResponse.jsonPath().getInt("offer.availableQuantity"),
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY
                        - InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_ORDER_QUANTITY
        );


        Response cancelOrderResponse =
                OrdersRequestBuilder.cancelMyOrder(
                        orderId,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                cancelOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                cancelOrderResponse.jsonPath().getString("message"),
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_CANCEL_MESSAGE
        );

        Assert.assertEquals(
                cancelOrderResponse.jsonPath().getString("order.status"),
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_CANCELLED_STATUS
        );


        Response offerAfterCancelResponse =
                OffersRequestBuilder.getOffer(offerId);

        Assert.assertEquals(
                offerAfterCancelResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                offerAfterCancelResponse.jsonPath().getInt("offer.availableQuantity"),
                InventoryTestConstants.cancellingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY
        );
    }

    @Test
    public void rejectingPendingOrderRestoresQuantityTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
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
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_OFFER_NAME,
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_OFFER_DESCRIPTION,
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_OFFER_CATEGORY,
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_OFFER_PRICE,
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY,
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
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
                                        InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_ORDER_QUANTITY
                                )
                        ),
                        InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_BUYER_NOTE
                );

        Response createOrderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
        );

        OrderResponse orderData =
                createOrderResponse.as(OrderResponse.class);

        String orderId =
                orderData.getOrder().getId();


        Response offerAfterOrderResponse =
                OffersRequestBuilder.getOffer(offerId);

        Assert.assertEquals(
                offerAfterOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                offerAfterOrderResponse.jsonPath().getInt("offer.availableQuantity"),
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY
                        - InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_ORDER_QUANTITY
        );


        RejectOrderRequest rejectOrderRequest =
                new RejectOrderRequest(
                        InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_REJECTION_REASON
                );

        Response rejectOrderResponse =
                OrdersRequestBuilder.rejectOrder(
                        orderId,
                        rejectOrderRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                rejectOrderResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                rejectOrderResponse.jsonPath().getString("message"),
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_REJECT_MESSAGE
        );

        Assert.assertEquals(
                rejectOrderResponse.jsonPath().getString("order.status"),
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_REJECTED_STATUS
        );

        Assert.assertEquals(
                rejectOrderResponse.jsonPath().getString("order.rejectionReason"),
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_REJECTION_REASON
        );


        Response offerAfterRejectResponse =
                OffersRequestBuilder.getOffer(offerId);

        Assert.assertEquals(
                offerAfterRejectResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                offerAfterRejectResponse.jsonPath().getInt("offer.availableQuantity"),
                InventoryTestConstants.rejectingPendingOrderRestoresQuantityTest_INITIAL_QUANTITY
        );
    }


    @Test
    public void concurrentOrdersCannotReduceQuantityBelowZeroTest() throws Exception {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        LoginRequest firstBuyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response firstBuyerLoginResponse =
                AuthRequestBuilder.login(firstBuyerLoginRequest);

        Assert.assertEquals(
                firstBuyerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse firstBuyerLoginData =
                firstBuyerLoginResponse.as(LoginResponse.class);


        LoginRequest secondBuyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyer2Email"),
                ConfigReader.get("buyer2Password")
        );

        Response secondBuyerLoginResponse =
                AuthRequestBuilder.login(secondBuyerLoginRequest);

        Assert.assertEquals(
                secondBuyerLoginResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        LoginResponse secondBuyerLoginData =
                secondBuyerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_NAME,
                InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_DESCRIPTION,
                InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_CATEGORY,
                InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_PRICE,
                InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_INITIAL_QUANTITY,
                InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                InventoryTestConstants.STATUS_CREATED
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
                                        InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_ORDER_QUANTITY
                                )
                        ),
                        InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_BUYER_NOTE
                );

        OrderRequest secondOrderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        offerId,
                                        InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_ORDER_QUANTITY
                                )
                        ),
                        InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_BUYER_NOTE
                );


        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch startLatch = new CountDownLatch(1);

        Future<Response> firstOrderFuture = executor.submit(() -> {
            startLatch.await();

            return OrdersRequestBuilder.createOrder(
                    firstOrderRequest,
                    firstBuyerLoginData.getAccessToken()
            );
        });

        Future<Response> secondOrderFuture = executor.submit(() -> {
            startLatch.await();

            return OrdersRequestBuilder.createOrder(
                    secondOrderRequest,
                    secondBuyerLoginData.getAccessToken()
            );
        });

        startLatch.countDown();

        Response firstOrderResponse = firstOrderFuture.get();
        Response secondOrderResponse = secondOrderFuture.get();

        executor.shutdown();


        int successfulOrders = 0;
        int rejectedOrders = 0;

        if (firstOrderResponse.statusCode() == InventoryTestConstants.STATUS_CREATED) {
            successfulOrders++;
        } else if (firstOrderResponse.statusCode() == InventoryTestConstants.STATUS_CONFLICT) {
            rejectedOrders++;

            ErrorResponse errorData =
                    firstOrderResponse.as(ErrorResponse.class);

            Assert.assertEquals(
                    errorData.getError().getCode(),
                    InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_ERROR_CODE
            );
        }

        if (secondOrderResponse.statusCode() == InventoryTestConstants.STATUS_CREATED) {
            successfulOrders++;
        } else if (secondOrderResponse.statusCode() == InventoryTestConstants.STATUS_CONFLICT) {
            rejectedOrders++;

            ErrorResponse errorData =
                    secondOrderResponse.as(ErrorResponse.class);

            Assert.assertEquals(
                    errorData.getError().getCode(),
                    InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_ERROR_CODE
            );
        }

        Assert.assertEquals(
                successfulOrders,
                1
        );

        Assert.assertEquals(
                rejectedOrders,
                1
        );


        Response offerAfterOrdersResponse =
                OffersRequestBuilder.getOffer(offerId);

        Assert.assertEquals(
                offerAfterOrdersResponse.statusCode(),
                InventoryTestConstants.STATUS_OK
        );

        int finalQuantity =
                offerAfterOrdersResponse.jsonPath().getInt("offer.availableQuantity");

        Assert.assertEquals(
                finalQuantity,
                InventoryTestConstants.concurrentOrdersCannotReduceQuantityBelowZeroTest_EXPECTED_REMAINING_QUANTITY
        );

        Assert.assertTrue(
                finalQuantity >= 0
        );
    }
}
