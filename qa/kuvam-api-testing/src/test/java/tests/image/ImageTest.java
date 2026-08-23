package tests.image;

import com.rajcic.config.ConfigReader;
import com.rajcic.dto.request.LoginRequest;
import com.rajcic.dto.request.OfferRequest;
import com.rajcic.dto.response.LoginResponse;
import com.rajcic.dto.response.OfferResponse;
import com.rajcic.requestbuilder.auth.AuthRequestBuilder;
import com.rajcic.requestbuilder.image.ImageRequestBuilder;
import com.rajcic.requestbuilder.offers.OffersRequestBuilder;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.BaseTest;
import tests.image.constants.ImageTestConstants;

import java.io.File;

public class ImageTest extends BaseTest {

    @Test
    public void sellerUploadsSupportedImagesTest() {

        LoginRequest sellerLoginRequest =
                new LoginRequest(
                        ConfigReader.get("approvedSellerEmail"),
                        ConfigReader.get("approvedSellerPassword")
                );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        File image =
                new File(
                        ImageTestConstants.sellerUploadsSupportedImagesTest_IMAGE_PATH
                );

        Assert.assertTrue(image.exists());


        Response profileImageResponse =
                ImageRequestBuilder.uploadSellerProfileImage(
                        image,
                        sellerLoginData.getAccessToken()
                );

        System.out.println(profileImageResponse.asPrettyString());

        Assert.assertEquals(
                profileImageResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                profileImageResponse.jsonPath().getString("message"),
                ImageTestConstants.sellerUploadsSupportedImagesTest_PROFILE_MESSAGE
        );

        Assert.assertNotNull(
                profileImageResponse.jsonPath().getString(
                        "seller.profileImageUrl"
                )
        );


        Response coverImageResponse =
                ImageRequestBuilder.uploadSellerCoverImage(
                        image,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                coverImageResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                coverImageResponse.jsonPath().getString("message"),
                ImageTestConstants.sellerUploadsSupportedImagesTest_COVER_MESSAGE
        );

        Assert.assertNotNull(
                coverImageResponse.jsonPath().getString(
                        "seller.coverImageUrl"
                )
        );


        OfferRequest offerRequest =
                new OfferRequest(
                        ImageTestConstants.sellerUploadsSupportedImagesTest_OFFER_NAME,
                        ImageTestConstants.sellerUploadsSupportedImagesTest_OFFER_DESCRIPTION,
                        ImageTestConstants.sellerUploadsSupportedImagesTest_OFFER_CATEGORY,
                        ImageTestConstants.sellerUploadsSupportedImagesTest_OFFER_PRICE,
                        ImageTestConstants.sellerUploadsSupportedImagesTest_OFFER_AVAILABLE_QUANTITY,
                        ImageTestConstants.sellerUploadsSupportedImagesTest_OFFER_UNIT
                );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                ImageTestConstants.STATUS_CREATED
        );

        OfferResponse offerData =
                createOfferResponse.as(OfferResponse.class);

        String offerId =
                offerData.getOffer().getId();


        Response offerImageResponse =
                ImageRequestBuilder.uploadOfferImage(
                        offerId,
                        image,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                offerImageResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                offerImageResponse.jsonPath().getString("message"),
                ImageTestConstants.sellerUploadsSupportedImagesTest_OFFER_MESSAGE
        );

        Assert.assertNotNull(
                offerImageResponse.jsonPath().getString(
                        "offer.imageUrl"
                )
        );
    }

    @Test
    public void sellerCanRemoveImagesTest() {

        LoginRequest sellerLoginRequest =
                new LoginRequest(
                        ConfigReader.get("approvedSellerEmail"),
                        ConfigReader.get("approvedSellerPassword")
                );

        Response sellerLoginResponse =
                AuthRequestBuilder.login(sellerLoginRequest);

        Assert.assertEquals(
                sellerLoginResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        LoginResponse sellerLoginData =
                sellerLoginResponse.as(LoginResponse.class);


        File image =
                new File(
                        ImageTestConstants.sellerCanRemoveImagesTest_IMAGE_PATH
                );

        Assert.assertTrue(image.exists());


        Response profileImageUploadResponse =
                ImageRequestBuilder.uploadSellerProfileImage(
                        image,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                profileImageUploadResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                profileImageUploadResponse.jsonPath().getString(
                        "seller.profileImageUrl"
                )
        );


        Response coverImageUploadResponse =
                ImageRequestBuilder.uploadSellerCoverImage(
                        image,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                coverImageUploadResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                coverImageUploadResponse.jsonPath().getString(
                        "seller.coverImageUrl"
                )
        );


        OfferRequest offerRequest =
                new OfferRequest(
                        ImageTestConstants.sellerCanRemoveImagesTest_OFFER_NAME,
                        ImageTestConstants.sellerCanRemoveImagesTest_OFFER_DESCRIPTION,
                        ImageTestConstants.sellerCanRemoveImagesTest_OFFER_CATEGORY,
                        ImageTestConstants.sellerCanRemoveImagesTest_OFFER_PRICE,
                        ImageTestConstants.sellerCanRemoveImagesTest_OFFER_AVAILABLE_QUANTITY,
                        ImageTestConstants.sellerCanRemoveImagesTest_OFFER_UNIT
                );

        Response createOfferResponse =
                OffersRequestBuilder.createOffer(
                        offerRequest,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                createOfferResponse.statusCode(),
                ImageTestConstants.STATUS_CREATED
        );

        String offerId =
                createOfferResponse.as(OfferResponse.class)
                        .getOffer()
                        .getId();


        Response offerImageUploadResponse =
                ImageRequestBuilder.uploadOfferImage(
                        offerId,
                        image,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                offerImageUploadResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertNotNull(
                offerImageUploadResponse.jsonPath().getString(
                        "offer.imageUrl"
                )
        );


        Response removeProfileImageResponse =
                ImageRequestBuilder.removeSellerProfileImage(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                removeProfileImageResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                removeProfileImageResponse.jsonPath().getString("message"),
                ImageTestConstants.sellerCanRemoveImagesTest_PROFILE_MESSAGE
        );

        Assert.assertNull(
                removeProfileImageResponse.jsonPath().get(
                        "seller.profileImageUrl"
                )
        );


        Response removeCoverImageResponse =
                ImageRequestBuilder.removeSellerCoverImage(
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                removeCoverImageResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                removeCoverImageResponse.jsonPath().getString("message"),
                ImageTestConstants.sellerCanRemoveImagesTest_COVER_MESSAGE
        );

        Assert.assertNull(
                removeCoverImageResponse.jsonPath().get(
                        "seller.coverImageUrl"
                )
        );


        Response removeOfferImageResponse =
                ImageRequestBuilder.removeOfferImage(
                        offerId,
                        sellerLoginData.getAccessToken()
                );

        Assert.assertEquals(
                removeOfferImageResponse.statusCode(),
                ImageTestConstants.STATUS_OK
        );

        Assert.assertEquals(
                removeOfferImageResponse.jsonPath().getString("message"),
                ImageTestConstants.sellerCanRemoveImagesTest_OFFER_MESSAGE
        );

        Assert.assertNull(
                removeOfferImageResponse.jsonPath().get(
                        "offer.imageUrl"
                )
        );
    }
}
