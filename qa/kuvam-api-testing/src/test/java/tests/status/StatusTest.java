package tests.status;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.OfferRequest;
import com.rajcic.dto.request.SellerRegisterRequest;
import com.rajcic.dto.request.UserRestrictionRequest;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.OfferResponse;
import com.rajcic.requestbuilder.admin.AdminRequestBuilder;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import com.rajcic.requestbuilder.orders.OrdersRequestBuilder;
import com.rajcic.requestbuilder.sellers.SellersRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.status.constants.StatusTestConstants;

import java.util.List;

public class StatusTest extends BaseTest {


    @Test
    public void pendingSellerCannotCreateOfferTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("pendingSellerEmail"),
                ConfigReader.get("pendingSellerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        Assert.assertNotNull(loginData.getUser());


        OfferRequest offerRequest = new OfferRequest(
                StatusTestConstants.pendingSellerCannotCreateOfferTest_NAME,
                StatusTestConstants.pendingSellerCannotCreateOfferTest_DESCRIPTION,
                StatusTestConstants.pendingSellerCannotCreateOfferTest_CATEGORY,
                StatusTestConstants.pendingSellerCannotCreateOfferTest_PRICE,
                StatusTestConstants.pendingSellerCannotCreateOfferTest_AVAILABLE_QUANTITY,
                StatusTestConstants.pendingSellerCannotCreateOfferTest_UNIT
        );

        Response offerResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                offerResponse.statusCode(),
                StatusTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                offerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                StatusTestConstants.pendingSellerCannotCreateOfferTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                StatusTestConstants.pendingSellerCannotCreateOfferTest_ERROR_MESSAGE
        );
    }


    @Test
    public void rejectedSellerCannotCreateOfferTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("rejectedUserEmail"),
                ConfigReader.get("rejectedUserPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        Assert.assertNotNull(loginData.getUser());


        OfferRequest offerRequest = new OfferRequest(
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_NAME,
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_DESCRIPTION,
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_CATEGORY,
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_PRICE,
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_AVAILABLE_QUANTITY,
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_UNIT
        );

        Response offerResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                offerResponse.statusCode(),
                StatusTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                offerResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                StatusTestConstants.rejectedSellerCannotCreateOfferTest_ERROR_MESSAGE
        );
    }


    @Test
    public void approvedSellerCanCreateOfferTest() {

        LoginRequest loginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response loginResponse =
                AuthRequestBuilder.login(loginRequest);

        Assert.assertEquals(
                loginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse loginData =
                loginResponse.as(LoginResponse.class);

        Assert.assertNotNull(loginData.getUser());


        OfferRequest offerRequest = new OfferRequest(
                StatusTestConstants.approvedSellerCanCreateOfferTest_NAME,
                StatusTestConstants.approvedSellerCanCreateOfferTest_DESCRIPTION,
                StatusTestConstants.approvedSellerCanCreateOfferTest_CATEGORY,
                StatusTestConstants.approvedSellerCanCreateOfferTest_PRICE,
                StatusTestConstants.approvedSellerCanCreateOfferTest_AVAILABLE_QUANTITY,
                StatusTestConstants.approvedSellerCanCreateOfferTest_UNIT
        );

        Response offerResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        loginData.getAccessToken()
                );

        Assert.assertEquals(
                offerResponse.statusCode(),
                StatusTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                offerResponse.as(OfferResponse.class);

        Assert.assertEquals(
                offerData.getMessage(),
                StatusTestConstants.approvedSellerCanCreateOfferTest_MESSAGE
        );

        Assert.assertNotNull(offerData.getOffer());
    }


    @Test
    public void suspendedUserCannotAccessProtectedEndpointTest() {

        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);

        Assert.assertNotNull(buyerLoginData.getUser());

        String accessToken =
                buyerLoginData.getAccessToken();

        String userId =
                buyerLoginData.getUser().getId();


        LoginRequest adminLoginRequest = new LoginRequest(
                ConfigReader.get("adminEmail"),
                ConfigReader.get("adminPassword")
        );

        Response adminLoginResponse =
                AuthRequestBuilder.adminLogin(adminLoginRequest);

        Assert.assertEquals(
                adminLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse adminLoginData =
                adminLoginResponse.as(LoginResponse.class);

        Assert.assertNotNull(adminLoginData.getUser());


        UserRestrictionRequest restrictionRequest =
                new UserRestrictionRequest(
                        StatusTestConstants.suspendedUserCannotAccessProtectedEndpointTest_REASON
                );

        Response suspendResponse =
                AdminRequestBuilder.suspendUser(
                        userId,
                        restrictionRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                suspendResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );


        Response ordersResponse =
                OrdersRequestBuilder.getMyOrders(accessToken);

        Assert.assertEquals(
                ordersResponse.statusCode(),
                StatusTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                ordersResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                StatusTestConstants.suspendedUserCannotAccessProtectedEndpointTest_ERROR_CODE
        );

        Assert.assertEquals(
                errorResponse.getError().getMessage(),
                StatusTestConstants.suspendedUserCannotAccessProtectedEndpointTest_ERROR_MESSAGE
        );


        Response unsuspendResponse =
                AdminRequestBuilder.unsuspendUser(
                        userId,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                unsuspendResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );
    }


    @Test
    public void previouslySuspendedUserCanAccessProtectedEndpointAfterUnsuspensionTest() {

        LoginRequest buyerLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response buyerLoginResponse =
                AuthRequestBuilder.login(buyerLoginRequest);

        Assert.assertEquals(
                buyerLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse buyerLoginData =
                buyerLoginResponse.as(LoginResponse.class);

        Assert.assertNotNull(buyerLoginData.getUser());

        String accessToken =
                buyerLoginData.getAccessToken();

        String userId =
                buyerLoginData.getUser().getId();


        LoginRequest adminLoginRequest = new LoginRequest(
                ConfigReader.get("adminEmail"),
                ConfigReader.get("adminPassword")
        );

        Response adminLoginResponse =
                AuthRequestBuilder.adminLogin(adminLoginRequest);

        Assert.assertEquals(
                adminLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse adminLoginData =
                adminLoginResponse.as(LoginResponse.class);

        Assert.assertNotNull(adminLoginData.getUser());


        UserRestrictionRequest restrictionRequest =
                new UserRestrictionRequest(
                        StatusTestConstants.previouslySuspendedUserCanAccessProtectedEndpointAfterUnsuspensionTest_REASON
                );

        Response suspendResponse =
                AdminRequestBuilder.suspendUser(
                        userId,
                        restrictionRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                suspendResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );


        LoginRequest suspendedUserLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response suspendedUserLoginResponse =
                AuthRequestBuilder.login(suspendedUserLoginRequest);

        Assert.assertEquals(
                suspendedUserLoginResponse.statusCode(),
                StatusTestConstants.STATUS_FORBIDDEN
        );

        ErrorResponse errorResponse =
                suspendedUserLoginResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                errorResponse.getError().getCode(),
                StatusTestConstants.previouslySuspendedUserCanAccessProtectedEndpointAfterUnsuspensionTest_ERROR_CODE
        );

        Assert.assertTrue(
                errorResponse.getError()
                        .getMessage()
                        .matches(
                                StatusTestConstants.previouslySuspendedUserCanAccessProtectedEndpointAfterUnsuspensionTest_MESSAGE_REGEX
                        )
        );


        Response unsuspendResponse =
                AdminRequestBuilder.unsuspendUser(
                        userId,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                unsuspendResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );


        LoginRequest restoredUserLoginRequest = new LoginRequest(
                ConfigReader.get("buyerEmail"),
                ConfigReader.get("buyerPassword")
        );

        Response restoredUserLoginResponse =
                AuthRequestBuilder.login(restoredUserLoginRequest);

        Assert.assertEquals(
                restoredUserLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse restoredUserLoginData =
                restoredUserLoginResponse.as(LoginResponse.class);

        Assert.assertNotNull(restoredUserLoginData.getUser());
    }

    @Test
    public void suspendedSellerOffersAreNotPubliclyAvailableTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        OfferRequest offerRequest = new OfferRequest(
                StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_NAME,
                StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_DESCRIPTION,
                StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_CATEGORY,
                StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_PRICE,
                StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_AVAILABLE_QUANTITY,
                StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                StatusTestConstants.STATUS_CREATED
        );


        Response sellerProfileResponse =
                SellersRequestBuilder.getMySellerProfile(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                sellerProfileResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        String sellerId =
                sellerProfileResponse.jsonPath().getString("seller.id");


        LoginRequest adminLoginRequest = new LoginRequest(
                ConfigReader.get("adminEmail"),
                ConfigReader.get("adminPassword")
        );

        Response adminLoginResponse =
                AuthRequestBuilder.adminLogin(adminLoginRequest);

        Assert.assertEquals(
                adminLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse adminLoginData =
                adminLoginResponse.as(LoginResponse.class);


        UserRestrictionRequest restrictionRequest =
                new UserRestrictionRequest(
                        StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_SUSPENSION_REASON
                );

        Response suspendResponse =
                AdminRequestBuilder.suspendUser(
                        sellerLoginData.getUser().getId(),
                        restrictionRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                suspendResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        try {

            Response publicSellersResponse =
                    SellersRequestBuilder.getPublicSellers();

            Assert.assertEquals(
                    publicSellersResponse.statusCode(),
                    StatusTestConstants.STATUS_OK
            );

            Assert.assertEquals(
                    publicSellersResponse.jsonPath().getString("message"),
                    StatusTestConstants.suspendedSellerOffersAreNotPubliclyAvailableTest_SELLERS_MESSAGE
            );

            List<String> publicSellerIds =
                    publicSellersResponse.jsonPath().getList("sellers.id");

            Assert.assertFalse(
                    publicSellerIds.contains(sellerId)
            );

        } finally {

            Response unsuspendResponse =
                    AdminRequestBuilder.unsuspendUser(
                            sellerLoginData.getUser().getId(),
                            adminLoginData.getAccessToken()
                    );

            Assert.assertEquals(
                    unsuspendResponse.statusCode(),
                    StatusTestConstants.STATUS_OK
            );
        }
    }

    @Test
    public void adminSuccessfullyApprovesPendingSellerTest() {

        SellerRegisterRequest registerRequest =
                new SellerRegisterRequest(
                        StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_EMAIL,
                        StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_FIRST_NAME,
                        StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_LAST_NAME,
                        StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_PASSWORD,
                        StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_ROLE,
                        StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_BUSINESS_NAME,
                        StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_DESCRIPTION
                );

        Response registerResponse =
                AuthRequestBuilder.sellerRegister(registerRequest);

        Assert.assertEquals(
                registerResponse.statusCode(),
                StatusTestConstants.STATUS_CREATED
        );


        LoginRequest adminLoginRequest =
                new LoginRequest(
                        ConfigReader.get("adminEmail"),
                        ConfigReader.get("adminPassword")
                );

        Response adminLoginResponse =
                AuthRequestBuilder.adminLogin(adminLoginRequest);

        Assert.assertEquals(
                adminLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse adminLoginData =
                adminLoginResponse.as(LoginResponse.class);


        Response pendingSellersResponse =
                AdminRequestBuilder.getPendingSellers(
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                pendingSellersResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        String sellerId =
                pendingSellersResponse.jsonPath().getString(
                        "sellers.find { it.user.email == '" +
                                StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_EMAIL +
                                "' }._id"
                );

        Assert.assertNotNull(sellerId);


        Response approveResponse =
                AdminRequestBuilder.approveSeller(
                        sellerId,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                approveResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                approveResponse.jsonPath().getString("message"),
                StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_MESSAGE
        );

        Assert.assertEquals(
                approveResponse.jsonPath().getString("seller.approvalStatus"),
                StatusTestConstants.adminSuccessfullyApprovesPendingSellerTest_APPROVED_STATUS
        );

        Assert.assertNull(
                approveResponse.jsonPath().get("seller.rejectionReason")
        );
    }


    @Test
    public void adminCannotProcessAlreadyProcessedSellerApplicationTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        Response sellerProfileResponse =
                SellersRequestBuilder.getMySellerProfile(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                sellerProfileResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        String sellerId =
                sellerProfileResponse.jsonPath().getString("seller.id");


        LoginRequest adminLoginRequest = new LoginRequest(
                ConfigReader.get("adminEmail"),
                ConfigReader.get("adminPassword")
        );

        Response adminLoginResponse =
                AuthRequestBuilder.adminLogin(adminLoginRequest);

        Assert.assertEquals(
                adminLoginResponse.statusCode(),
                StatusTestConstants.STATUS_OK
        );

        LoginResponse adminLoginData =
                adminLoginResponse.as(LoginResponse.class);


        Response approveResponse =
                AdminRequestBuilder.approveSeller(
                        sellerId,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                approveResponse.statusCode(),
                StatusTestConstants.STATUS_CONFLICT
        );

        ErrorResponse approveError =
                approveResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                approveError.getError().getCode(),
                StatusTestConstants.adminCannotProcessAlreadyProcessedSellerApplicationTest_ERROR_CODE
        );

        Assert.assertEquals(
                approveError.getError().getMessage(),
                StatusTestConstants.adminCannotProcessAlreadyProcessedSellerApplicationTest_ERROR_MESSAGE
        );


        UserRestrictionRequest rejectRequest =
                new UserRestrictionRequest(
                        StatusTestConstants.adminCannotProcessAlreadyProcessedSellerApplicationTest_REASON
                );

        Response rejectResponse =
                AdminRequestBuilder.rejectSeller(
                        sellerId,
                        rejectRequest,
                        adminLoginData.getAccessToken()
                );

        Assert.assertEquals(
                rejectResponse.statusCode(),
                StatusTestConstants.STATUS_CONFLICT
        );

        ErrorResponse rejectError =
                rejectResponse.as(ErrorResponse.class);

        Assert.assertEquals(
                rejectError.getError().getCode(),
                StatusTestConstants.adminCannotProcessAlreadyProcessedSellerApplicationTest_ERROR_CODE
        );

        Assert.assertEquals(
                rejectError.getError().getMessage(),
                StatusTestConstants.adminCannotProcessAlreadyProcessedSellerApplicationTest_ERROR_MESSAGE
        );
    }
}