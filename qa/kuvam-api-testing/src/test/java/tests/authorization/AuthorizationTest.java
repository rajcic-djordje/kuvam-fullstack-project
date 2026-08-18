package tests.authorization;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.OfferRequest;
import com.rajcic.dto.response.AdminGetUsersResponse;
import com.rajcic.dto.response.ErrorResponse;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.authorization.AuthorizationRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.auth.constants.AuthAccessTestConstants;
import tests.authorization.constants.AuthorizationTestConstants;


public class AuthorizationTest extends BaseTest {




    @Test
    public void nonAdminAccessAdminEndpointTest() {

        LoginRequest lr = new LoginRequest(ConfigReader.get("buyerEmail"), ConfigReader.get("buyerPassword"));

        Response r = AuthRequestBuilder.login(lr);

        Assert.assertEquals(r.statusCode(), 200);
        Assert.assertNotNull(r.getCookie("refreshToken"));

        LoginResponse lRes = r.as(LoginResponse.class);

        Response ar = AuthorizationRequestBuilder.adminGetUsers(lRes.getAccessToken());

        Assert.assertEquals(ar.statusCode(), 403);

        ErrorResponse er = ar.as(ErrorResponse.class);

        Assert.assertEquals(er.getError().getCode(), "FORBIDDEN");
        Assert.assertEquals(er.getError().getMessage(), "You do not have permission to perform this action.");
    }


    @Test
    public void adminAccessAdminEndpointTest() {
        LoginRequest lr = new LoginRequest(ConfigReader.get("adminEmail"), ConfigReader.get("adminPassword"));

        Response r = AuthRequestBuilder.adminLogin(lr);

        Assert.assertEquals(r.statusCode(), 200);

        LoginResponse lRes = r.as(LoginResponse.class);

        Response ar = AuthorizationRequestBuilder.adminGetUsers(lRes.getAccessToken());

        Assert.assertEquals(ar.statusCode(), 200);

        AdminGetUsersResponse agr = ar.as(AdminGetUsersResponse.class);

        Assert.assertFalse(agr.getUsers().isEmpty());
    }

    @Test
    public void buyerCannotCreateSellerOfferTest() {

        LoginRequest lr = new LoginRequest(ConfigReader.get("buyerEmail"), ConfigReader.get("buyerPassword"));

        Response r = AuthRequestBuilder.login(lr);

        Assert.assertEquals(r.statusCode(), 200);
        Assert.assertNotNull(r.getCookie("refreshToken"));

        LoginResponse lRes = r.as(LoginResponse.class);

        OfferRequest or = new OfferRequest(
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_NAME,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_DESCRIPTION,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_CATEGORY,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_PRICE,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_AVAILABLE_QUANTITY,
                AuthorizationTestConstants.buyerCannotCreateSellerOfferTest_UNIT
        );

       Response oRes = OffersRequestBuilder.createOffer(or, lRes.getAccessToken());

       Assert.assertEquals(oRes.statusCode(),403);

       ErrorResponse er = oRes.as(ErrorResponse.class);

       Assert.assertEquals(er.getError().getCode(), "FORBIDDEN");
        Assert.assertEquals(er.getError().getMessage(), "You do not have permission to perform this action.");
    }

}
