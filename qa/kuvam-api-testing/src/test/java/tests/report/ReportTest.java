package tests.report;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.AcceptOrderRequest;
import com.rajcic.dto.request.BuyerRegisterRequest;
import com.rajcic.dto.request.CompleteOrderRequest;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.OfferRequest;
import com.rajcic.dto.request.OrderItemRequest;
import com.rajcic.dto.request.OrderRequest;
import com.rajcic.dto.request.ReportRequest;
import com.rajcic.dto.request.ReportReviewRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.OfferResponse;
import com.rajcic.dto.response.OrderResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import com.rajcic.requestbuilder.orders.OrdersRequestBuilder;
import com.rajcic.requestbuilder.report.ReportRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.report.constants.ReportTestConstants;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class ReportTest extends BaseTest {

    @Test
    public void buyerAndSellerCanReportCompletedOrderTest() {

        LoginResponse sellerLoginData =
                login(
                        ConfigReader.get("approvedSellerEmail"),
                        ConfigReader.get("approvedSellerPassword")
                );

        LoginResponse buyerLoginData =
                login(
                        ConfigReader.get("buyerEmail"),
                        ConfigReader.get("buyerPassword")
                );

        String orderId =
                createCompletedOrder(
                        ReportTestConstants.buyerAndSellerCanReportCompletedOrderTest_OFFER_NAME,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );

        ReportRequest buyerReportRequest =
                new ReportRequest(
                        orderId,
                        ReportTestConstants.REPORT_REASON,
                        ReportTestConstants.buyerAndSellerCanReportCompletedOrderTest_DESCRIPTION
                );

        Response buyerReportResponse =
                ReportRequestBuilder.createReport(
                        buyerReportRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                buyerReportResponse.statusCode(),
                ReportTestConstants.STATUS_CREATED
        );

        Assert.assertEquals(
                buyerReportResponse.jsonPath().getString("message"),
                ReportTestConstants.buyerAndSellerCanReportCompletedOrderTest_MESSAGE
        );

        Assert.assertEquals(
                buyerReportResponse.jsonPath().getString("report.status"),
                ReportTestConstants.buyerAndSellerCanReportCompletedOrderTest_PENDING_STATUS
        );

        Assert.assertEquals(
                buyerReportResponse.jsonPath().getString("report.reporter"),
                buyerLoginData.getUser().getId()
        );

        Assert.assertEquals(
                buyerReportResponse.jsonPath().getString("report.reportedUser"),
                sellerLoginData.getUser().getId()
        );

        Assert.assertEquals(
                buyerReportResponse.jsonPath().getString("report.order"),
                orderId
        );


        ReportRequest sellerReportRequest =
                new ReportRequest(
                        orderId,
                        ReportTestConstants.REPORT_REASON,
                        ReportTestConstants.buyerAndSellerCanReportCompletedOrderTest_DESCRIPTION
                );

        Response sellerReportResponse =
                ReportRequestBuilder.createReport(
                        sellerReportRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                sellerReportResponse.statusCode(),
                ReportTestConstants.STATUS_CREATED
        );

        Assert.assertEquals(
                sellerReportResponse.jsonPath().getString("message"),
                ReportTestConstants.buyerAndSellerCanReportCompletedOrderTest_MESSAGE
        );

        Assert.assertEquals(
                sellerReportResponse.jsonPath().getString("report.status"),
                ReportTestConstants.buyerAndSellerCanReportCompletedOrderTest_PENDING_STATUS
        );

        Assert.assertEquals(
                sellerReportResponse.jsonPath().getString("report.reporter"),
                sellerLoginData.getUser().getId()
        );

        Assert.assertEquals(
                sellerReportResponse.jsonPath().getString("report.reportedUser"),
                buyerLoginData.getUser().getId()
        );

        Assert.assertEquals(
                sellerReportResponse.jsonPath().getString("report.order"),
                orderId
        );
    }


    @Test
    public void invalidOrderCannotBeReportedTest() {

        LoginResponse sellerLoginData =
                login(
                        ConfigReader.get("approvedSellerEmail"),
                        ConfigReader.get("approvedSellerPassword")
                );

        LoginResponse seller2LoginData =
                login(
                        ConfigReader.get("approvedSeller2Email"),
                        ConfigReader.get("approvedSeller2Password")
                );

        LoginResponse buyerLoginData =
                login(
                        ConfigReader.get("buyerEmail"),
                        ConfigReader.get("buyerPassword")
                );

        LoginResponse buyer2LoginData =
                login(
                        ConfigReader.get("buyer2Email"),
                        ConfigReader.get("buyer2Password")
                );


        String pendingOrderId =
                createPendingOrder(
                        ReportTestConstants.invalidOrderCannotBeReportedTest_PENDING_OFFER_NAME,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );

        ReportRequest pendingReportRequest =
                new ReportRequest(
                        pendingOrderId,
                        ReportTestConstants.REPORT_REASON,
                        ReportTestConstants.invalidOrderCannotBeReportedTest_DESCRIPTION
                );

        Response pendingReportResponse =
                ReportRequestBuilder.createReport(
                        pendingReportRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                pendingReportResponse.statusCode(),
                ReportTestConstants.STATUS_CONFLICT
        );

        ErrorResponse pendingError =
                pendingReportResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                pendingError.getError().getCode(),
                ReportTestConstants.invalidOrderCannotBeReportedTest_NOT_COMPLETED_CODE
        );

        Assert.assertEquals(
                pendingError.getError().getMessage(),
                ReportTestConstants.invalidOrderCannotBeReportedTest_NOT_COMPLETED_MESSAGE
        );


        ReportRequest nonExistingReportRequest =
                new ReportRequest(
                        ReportTestConstants.invalidOrderCannotBeReportedTest_NON_EXISTING_ORDER_ID,
                        ReportTestConstants.REPORT_REASON,
                        ReportTestConstants.invalidOrderCannotBeReportedTest_DESCRIPTION
                );

        Response nonExistingResponse =
                ReportRequestBuilder.createReport(
                        nonExistingReportRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                nonExistingResponse.statusCode(),
                ReportTestConstants.STATUS_NOT_FOUND
        );

        ErrorResponse nonExistingError =
                nonExistingResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                nonExistingError.getError().getCode(),
                ReportTestConstants.invalidOrderCannotBeReportedTest_NOT_FOUND_CODE
        );

        Assert.assertEquals(
                nonExistingError.getError().getMessage(),
                ReportTestConstants.invalidOrderCannotBeReportedTest_NOT_FOUND_MESSAGE
        );


        String buyer2OrderId =
                createCompletedOrder(
                        ReportTestConstants.invalidOrderCannotBeReportedTest_OTHER_BUYER_OFFER_NAME,
                        sellerLoginData.getAccessToken(),
                        buyer2LoginData.getAccessToken()
                );

        ReportRequest otherBuyerReportRequest =
                new ReportRequest(
                        buyer2OrderId,
                        ReportTestConstants.REPORT_REASON,
                        ReportTestConstants.invalidOrderCannotBeReportedTest_DESCRIPTION
                );

        Response otherBuyerResponse =
                ReportRequestBuilder.createReport(
                        otherBuyerReportRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                otherBuyerResponse.statusCode(),
                ReportTestConstants.STATUS_NOT_FOUND
        );

        ErrorResponse otherBuyerError =
                otherBuyerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                otherBuyerError.getError().getCode(),
                ReportTestConstants.invalidOrderCannotBeReportedTest_NOT_FOUND_CODE
        );


        String seller2OrderId =
                createCompletedOrder(
                        ReportTestConstants.invalidOrderCannotBeReportedTest_OTHER_SELLER_OFFER_NAME,
                        seller2LoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );

        ReportRequest otherSellerReportRequest =
                new ReportRequest(
                        seller2OrderId,
                        ReportTestConstants.REPORT_REASON,
                        ReportTestConstants.invalidOrderCannotBeReportedTest_DESCRIPTION
                );

        Response otherSellerResponse =
                ReportRequestBuilder.createReport(
                        otherSellerReportRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                otherSellerResponse.statusCode(),
                ReportTestConstants.STATUS_NOT_FOUND
        );

        ErrorResponse otherSellerError =
                otherSellerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                otherSellerError.getError().getCode(),
                ReportTestConstants.invalidOrderCannotBeReportedTest_NOT_FOUND_CODE
        );
    }


    @Test
    public void duplicateReportIsRejectedTest() {

        LoginResponse sellerLoginData =
                login(
                        ConfigReader.get("approvedSellerEmail"),
                        ConfigReader.get("approvedSellerPassword")
                );

        LoginResponse buyerLoginData =
                login(
                        ConfigReader.get("buyerEmail"),
                        ConfigReader.get("buyerPassword")
                );

        String orderId =
                createCompletedOrder(
                        ReportTestConstants.duplicateReportIsRejectedTest_OFFER_NAME,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );

        ReportRequest reportRequest =
                new ReportRequest(
                        orderId,
                        ReportTestConstants.REPORT_REASON,
                        ReportTestConstants.duplicateReportIsRejectedTest_DESCRIPTION
                );

        Response firstReportResponse =
                ReportRequestBuilder.createReport(
                        reportRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                firstReportResponse.statusCode(),
                ReportTestConstants.STATUS_CREATED
        );


        Response duplicateReportResponse =
                ReportRequestBuilder.createReport(
                        reportRequest,
                        buyerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                duplicateReportResponse.statusCode(),
                ReportTestConstants.STATUS_CONFLICT
        );

        ErrorResponse duplicateError =
                duplicateReportResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                duplicateError.getError().getCode(),
                ReportTestConstants.duplicateReportIsRejectedTest_ERROR_CODE
        );

        Assert.assertEquals(
                duplicateError.getError().getMessage(),
                ReportTestConstants.duplicateReportIsRejectedTest_ERROR_MESSAGE
        );
    }


    @Test
    public void adminCanListApproveAndRejectReportsTest() {

        LoginResponse sellerLoginData =
                login(
                        ConfigReader.get("approvedSellerEmail"),
                        ConfigReader.get("approvedSellerPassword")
                );

        LoginResponse buyerLoginData =
                login(
                        ConfigReader.get("buyerEmail"),
                        ConfigReader.get("buyerPassword")
                );

        LoginResponse adminLoginData =
                adminLogin();


        String firstOrderId =
                createCompletedOrder(
                        ReportTestConstants.adminCanListApproveAndRejectReportsTest_FIRST_OFFER_NAME,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );

        String secondOrderId =
                createCompletedOrder(
                        ReportTestConstants.adminCanListApproveAndRejectReportsTest_SECOND_OFFER_NAME,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );


        String firstReportId =
                createReport(
                        firstOrderId,
                        ReportTestConstants.adminCanListApproveAndRejectReportsTest_DESCRIPTION,
                        buyerLoginData.getAccessToken()
                );

        String secondReportId =
                createReport(
                        secondOrderId,
                        ReportTestConstants.adminCanListApproveAndRejectReportsTest_DESCRIPTION,
                        buyerLoginData.getAccessToken()
                );


        Response adminReportsResponse =
                ReportRequestBuilder.getAdminReports(
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                adminReportsResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                adminReportsResponse.jsonPath().getString("message"),
                ReportTestConstants.adminCanListApproveAndRejectReportsTest_LIST_MESSAGE
        );

        List<String> adminReportIds =
                adminReportsResponse.jsonPath().getList("reports._id");

        Assert.assertTrue(adminReportIds.contains(firstReportId));
        Assert.assertTrue(adminReportIds.contains(secondReportId));


        Response pendingReportsResponse =
                ReportRequestBuilder.getPendingReports(
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                pendingReportsResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                pendingReportsResponse.jsonPath().getString("message"),
                ReportTestConstants.adminCanListApproveAndRejectReportsTest_PENDING_MESSAGE
        );

        List<String> pendingReportIds =
                pendingReportsResponse.jsonPath().getList("reports._id");

        Assert.assertTrue(pendingReportIds.contains(firstReportId));
        Assert.assertTrue(pendingReportIds.contains(secondReportId));


        ReportReviewRequest approveRequest =
                new ReportReviewRequest(
                        ReportTestConstants.adminCanListApproveAndRejectReportsTest_APPROVE_NOTE
                );

        Response approveResponse =
                ReportRequestBuilder.approveReport(
                        firstReportId,
                        approveRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                approveResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                approveResponse.jsonPath().getString("message"),
                ReportTestConstants.adminCanListApproveAndRejectReportsTest_APPROVE_MESSAGE
        );

        Assert.assertEquals(
                approveResponse.jsonPath().getString("report.status"),
                ReportTestConstants.adminCanListApproveAndRejectReportsTest_APPROVED_STATUS
        );

        Assert.assertNotNull(
                approveResponse.jsonPath().get("report.reviewedBy")
        );

        Assert.assertNotNull(
                approveResponse.jsonPath().get("report.reviewedAt")
        );


        ReportReviewRequest rejectRequest =
                new ReportReviewRequest(
                        ReportTestConstants.adminCanListApproveAndRejectReportsTest_REJECT_NOTE
                );

        Response rejectResponse =
                ReportRequestBuilder.rejectReport(
                        secondReportId,
                        rejectRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                rejectResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                rejectResponse.jsonPath().getString("message"),
                ReportTestConstants.adminCanListApproveAndRejectReportsTest_REJECT_MESSAGE
        );

        Assert.assertEquals(
                rejectResponse.jsonPath().getString("report.status"),
                ReportTestConstants.adminCanListApproveAndRejectReportsTest_REJECTED_STATUS
        );

        Assert.assertNotNull(
                rejectResponse.jsonPath().get("report.reviewedBy")
        );

        Assert.assertNotNull(
                rejectResponse.jsonPath().get("report.reviewedAt")
        );
    }


    @Test
    public void userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest() {

        BuyerRegisterRequest registerRequest =
                new BuyerRegisterRequest(
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_EMAIL,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_FIRST_NAME,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_LAST_NAME,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_PASSWORD,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_ROLE
                );

        Response registerResponse =
                AuthRequestBuilder.buyerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                ReportTestConstants.STATUS_CREATED
        );


        LoginResponse buyerLoginData =
                login(
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_EMAIL,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_PASSWORD
                );

        LoginResponse sellerLoginData =
                login(
                        ConfigReader.get("approvedSeller2Email"),
                        ConfigReader.get("approvedSeller2Password")
                );

        LoginResponse adminLoginData =
                adminLogin();


        String firstOrderId =
                createCompletedOrder(
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_FIRST_OFFER,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );

        String secondOrderId =
                createCompletedOrder(
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_SECOND_OFFER,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );

        String thirdOrderId =
                createCompletedOrder(
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_THIRD_OFFER,
                        sellerLoginData.getAccessToken(),
                        buyerLoginData.getAccessToken()
                );


        String firstReportId =
                createReport(
                        firstOrderId,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_DESCRIPTION,
                        sellerLoginData.getAccessToken()
                );

        String secondReportId =
                createReport(
                        secondOrderId,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_DESCRIPTION,
                        sellerLoginData.getAccessToken()
                );

        String thirdReportId =
                createReport(
                        thirdOrderId,
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_DESCRIPTION,
                        sellerLoginData.getAccessToken()
                );


        ReportReviewRequest reviewRequest =
                new ReportReviewRequest(
                        ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_ADMIN_NOTE
                );


        Response firstApproveResponse =
                ReportRequestBuilder.approveReport(
                        firstReportId,
                        reviewRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                firstApproveResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                firstApproveResponse.jsonPath().getInt(
                        "reportedUser.offencesSinceLastBan"
                ),
                1
        );

        Assert.assertEquals(
                firstApproveResponse.jsonPath().getString(
                        "reportedUser.status"
                ),
                "active"
        );


        Response secondApproveResponse =
                ReportRequestBuilder.approveReport(
                        secondReportId,
                        reviewRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                secondApproveResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                secondApproveResponse.jsonPath().getInt(
                        "reportedUser.offencesSinceLastBan"
                ),
                2
        );

        Assert.assertEquals(
                secondApproveResponse.jsonPath().getString(
                        "reportedUser.status"
                ),
                "active"
        );


        Response thirdApproveResponse =
                ReportRequestBuilder.approveReport(
                        thirdReportId,
                        reviewRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                thirdApproveResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                thirdApproveResponse.jsonPath().getInt(
                        "reportedUser.offencesSinceLastBan"
                ),
                3
        );

        Assert.assertEquals(
                thirdApproveResponse.jsonPath().getInt(
                        "reportedUser.offences"
                ),
                3
        );

        Assert.assertEquals(
                thirdApproveResponse.jsonPath().getString(
                        "reportedUser.status"
                ),
                ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_BANNED_STATUS
        );

        Assert.assertEquals(
                thirdApproveResponse.jsonPath().getString(
                        "reportedUser.banReason"
                ),
                ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_BAN_REASON
        );


        Response bannedUserLoginResponse =
                AuthRequestBuilder.login(
                        new LoginRequest(
                                ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_EMAIL,
                                ReportTestConstants.userIsAutomaticallyBannedAfterThreeConfirmedOffencesTest_PASSWORD
                        )
                );

        Assert.assertEquals(
                bannedUserLoginResponse.statusCode(),
                ReportTestConstants.STATUS_FORBIDDEN
        );
    }


    private LoginResponse login(String email, String password) {

        Response response =
                AuthRequestBuilder.login(
                        new LoginRequest(email, password)
                );

        Assert.assertEquals(
                response.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        return response.as(LoginResponse.class);
    }


    private LoginResponse adminLogin() {

        Response response =
                AuthRequestBuilder.adminLogin(
                        new LoginRequest(
                                ConfigReader.get("adminEmail"),
                                ConfigReader.get("adminPassword")
                        )
                );

        Assert.assertEquals(
                response.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        return response.as(LoginResponse.class);
    }


    private String createPendingOrder(
            String offerName,
            String sellerToken,
            String buyerToken
    ) {

        String offerId =
                createOffer(
                        offerName,
                        sellerToken
                );

        OrderRequest orderRequest =
                new OrderRequest(
                        List.of(
                                new OrderItemRequest(
                                        offerId,
                                        ReportTestConstants.ORDER_QUANTITY
                                )
                        ),
                        ReportTestConstants.ORDER_NOTE
                );

        Response orderResponse =
                OrdersRequestBuilder.createOrder(
                        orderRequest,
                        buyerToken
                );

        Assert.assertEquals(
                orderResponse.statusCode(),
                ReportTestConstants.STATUS_CREATED
        );

        return orderResponse.as(OrderResponse.class)
                .getOrder()
                .getId();
    }


    private String createCompletedOrder(
            String offerName,
            String sellerToken,
            String buyerToken
    ) {

        String orderId =
                createPendingOrder(
                        offerName,
                        sellerToken,
                        buyerToken
                );

        AcceptOrderRequest acceptRequest =
                new AcceptOrderRequest(
                        Instant.now()
                                .plus(2, ChronoUnit.HOURS)
                                .toString()
                );

        Response acceptResponse =
                OrdersRequestBuilder.acceptOrder(
                        orderId,
                        acceptRequest,
                        sellerToken
                );

        Assert.assertEquals(
                acceptResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );


        Response readyResponse =
                OrdersRequestBuilder.markOrderAsReady(
                        orderId,
                        sellerToken
                );

        Assert.assertEquals(
                readyResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );


        Response buyerOrderResponse =
                OrdersRequestBuilder.getMyOrder(
                        orderId,
                        buyerToken
                );

        Assert.assertEquals(
                buyerOrderResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        String pickupCode =
                buyerOrderResponse.jsonPath()
                        .getString("order.pickupCode");

        Assert.assertNotNull(pickupCode);


        CompleteOrderRequest completeRequest =
                new CompleteOrderRequest(pickupCode);

        Response completeResponse =
                OrdersRequestBuilder.completeOrder(
                        orderId,
                        completeRequest,
                        sellerToken
                );

        Assert.assertEquals(
                completeResponse.statusCode(),
                ReportTestConstants.STATUS_OK
        );

        return orderId;
    }


    private String createOffer(
            String offerName,
            String sellerToken
    ) {

        OfferRequest offerRequest =
                new OfferRequest(
                        offerName,
                        "Offer created for report automation testing.",
                        ReportTestConstants.OFFER_CATEGORY,
                        ReportTestConstants.OFFER_PRICE,
                        ReportTestConstants.OFFER_AVAILABLE_QUANTITY,
                        ReportTestConstants.OFFER_UNIT
                );

        Response offerResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerToken
                );

        Assert.assertEquals(
                offerResponse.statusCode(),
                ReportTestConstants.STATUS_CREATED
        );

        return offerResponse.as(OfferResponse.class)
                .getOffer()
                .getId();
    }


    private String createReport(
            String orderId,
            String description,
            String reporterToken
    ) {

        ReportRequest request =
                new ReportRequest(
                        orderId,
                        ReportTestConstants.REPORT_REASON,
                        description
                );

        Response response =
                ReportRequestBuilder.createReport(
                        request,
                        reporterToken
                );

        Assert.assertEquals(
                response.statusCode(),
                ReportTestConstants.STATUS_CREATED
        );

        return response.jsonPath()
                .getString("report._id");
    }
}