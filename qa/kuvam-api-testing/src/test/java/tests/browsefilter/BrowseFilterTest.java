package tests.browsefilter;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.OfferRequest;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.OfferResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import com.rajcic.requestbuilder.sellers.SellersRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.browsefilter.constants.BrowseFilterTestConstants;

import java.util.List;

public class BrowseFilterTest extends BaseTest {

    @Test
    public void publicSellerListingAppliesSearchAndCategoryFiltersTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSellerEmail"),
                ConfigReader.get("approvedSellerPassword")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        Response sellerProfileResponse =
                SellersRequestBuilder.getMySellerProfile(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                sellerProfileResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        String sellerId =
                sellerProfileResponse.jsonPath().getString("seller.id");

        String businessName =
                sellerProfileResponse.jsonPath().getString("seller.businessName");


        OfferRequest offerRequest = new OfferRequest(
                BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_NAME,
                BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_DESCRIPTION,
                BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_CATEGORY,
                BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_PRICE,
                BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_AVAILABLE_QUANTITY,
                BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_CREATED
        );


        Response offerNameSearchResponse =
                SellersRequestBuilder.getPublicSellersBySearch(
                        BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_NAME_SEARCH
                );

        Assert.assertEquals(
                offerNameSearchResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                offerNameSearchResponse.jsonPath().getString("message"),
                BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_MESSAGE
        );

        List<String> offerNameSellerIds =
                offerNameSearchResponse.jsonPath().getList("sellers.id");

        Assert.assertTrue(
                offerNameSellerIds.contains(sellerId)
        );


        Response descriptionSearchResponse =
                SellersRequestBuilder.getPublicSellersBySearch(
                        BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_DESCRIPTION_SEARCH
                );

        Assert.assertEquals(
                descriptionSearchResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        List<String> descriptionSellerIds =
                descriptionSearchResponse.jsonPath().getList("sellers.id");

        Assert.assertTrue(
                descriptionSellerIds.contains(sellerId)
        );


        Response businessNameSearchResponse =
                SellersRequestBuilder.getPublicSellersBySearch(
                        businessName
                );

        Assert.assertEquals(
                businessNameSearchResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        List<String> businessNameSellerIds =
                businessNameSearchResponse.jsonPath().getList("sellers.id");

        Assert.assertTrue(
                businessNameSellerIds.contains(sellerId)
        );


        Response combinedFilterResponse =
                SellersRequestBuilder.getPublicSellers(
                        BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_NAME_SEARCH,
                        BrowseFilterTestConstants.publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_CATEGORY
                );

        Assert.assertEquals(
                combinedFilterResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        List<String> combinedSellerIds =
                combinedFilterResponse.jsonPath().getList("sellers.id");

        Assert.assertTrue(
                combinedSellerIds.contains(sellerId)
        );

        List<String> returnedCategories =
                combinedFilterResponse.jsonPath().getList(
                        "sellers.offers.flatten().category"
                );

        Assert.assertTrue(
                returnedCategories.stream()
                        .allMatch(
                                BrowseFilterTestConstants
                                        .publicSellerListingAppliesSearchAndCategoryFiltersTest_OFFER_CATEGORY::equals
                        )
        );
    }


    @Test
    public void unavailableSellerIsExcludedFromPublicBrowsingTest() {

        LoginRequest sellerLoginRequest = new LoginRequest(
                ConfigReader.get("approvedSeller2Email"),
                ConfigReader.get("approvedSeller2Password")
        );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        Response sellerProfileResponse =
                SellersRequestBuilder.getMySellerProfile(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                sellerProfileResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        String sellerId =
                sellerProfileResponse.jsonPath().getString("seller.id");


        OfferRequest offerRequest = new OfferRequest(
                BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_OFFER_NAME,
                BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_OFFER_DESCRIPTION,
                BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_OFFER_CATEGORY,
                BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_OFFER_PRICE,
                BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_OFFER_AVAILABLE_QUANTITY,
                BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_OFFER_UNIT
        );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        Response deactivateOfferResponse =
                OffersRequestBuilder.deactivateOffer(
                        offerId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                deactivateOfferResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );


        Response publicSellersResponse =
                SellersRequestBuilder.getPublicSellersBySearch(
                        BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_OFFER_NAME
                );

        Assert.assertEquals(
                publicSellersResponse.statusCode(),
                BrowseFilterTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                publicSellersResponse.jsonPath().getString("message"),
                BrowseFilterTestConstants.unavailableSellerIsExcludedFromPublicBrowsingTest_MESSAGE
        );

        List<String> sellerIds =
                publicSellersResponse.jsonPath().getList("sellers.id");

        Assert.assertFalse(
                sellerIds.contains(sellerId)
        );
    }
}
