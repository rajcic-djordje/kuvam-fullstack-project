package tests.seller;

import com.rajcic.pages.auth.LoginPage;
import com.rajcic.pages.cart.CartModal;
import com.rajcic.pages.offers.CreateOfferPage;
import com.rajcic.pages.offers.OfferPage;
import com.rajcic.pages.offers.OffersPage;
import com.rajcic.pages.sellers.SellerOffersPage;
import com.rajcic.pages.sellers.SellerOrderDetailPage;
import com.rajcic.pages.sellers.SellerOrdersPage;
import com.rajcic.pages.sellers.SellerPage;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.base.BaseTest;

import static tests.seller.constants.SellerTestConstants.*;

public class SellerTest extends BaseTest {

    @Test
    public void sellerOfferManagementFlowTest() {
        String offerName = OFFER_NAME_PREFIX + System.currentTimeMillis();

        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.open().login(SELLER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        CreateOfferPage createOfferPage = new CreateOfferPage(driver, wait);
        createOfferPage.open().createOffer(offerName, OFFER_DESCRIPTION, OFFER_CATEGORY, OFFER_PRICE, OFFER_QUANTITY, OFFER_UNIT);

        SellerOffersPage sellerOffersPage = new SellerOffersPage(driver, wait);
        sellerOffersPage.open();

        Assert.assertTrue(sellerOffersPage.isOfferDisplayed(offerName), ASSERT_OFFER_DISPLAYED);
        Assert.assertEquals(sellerOffersPage.getOfferPrice(offerName), OFFER_PRICE_DISPLAY, ASSERT_OFFER_PRICE);
        Assert.assertEquals(sellerOffersPage.getOfferQuantity(offerName), OFFER_QUANTITY_DISPLAY, ASSERT_OFFER_QUANTITY);
        Assert.assertEquals(sellerOffersPage.getOfferStatus(offerName), STATUS_ACTIVE, ASSERT_OFFER_ACTIVE);

        sellerOffersPage.deactivateOffer(offerName);

        Assert.assertEquals(sellerOffersPage.getOfferStatus(offerName), STATUS_INACTIVE, ASSERT_OFFER_INACTIVE);

        sellerOffersPage.activateOffer(offerName);

        Assert.assertEquals(sellerOffersPage.getOfferStatus(offerName), STATUS_ACTIVE, ASSERT_OFFER_REACTIVATED);

        sellerOffersPage.deleteOffer(offerName);

        Assert.assertFalse(sellerOffersPage.isOfferDisplayed(offerName), ASSERT_OFFER_DELETED);
    }

    @Test
    public void sellerOrderProcessingFlowTest() {
        String buyerNote = ORDER_NOTE_PREFIX + System.currentTimeMillis();

        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.open().login(BUYER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        OffersPage offersPage = new OffersPage(driver, wait);
        offersPage.open().openSeller(SELLER_NAME);

        SellerPage sellerPage = new SellerPage(driver, wait);
        sellerPage.openOffer(OFFER_NAME);

        OfferPage offerPage = new OfferPage(driver, wait);

        Assert.assertEquals(offerPage.getOfferName(), OFFER_NAME, ASSERT_SELECTED_OFFER);

        offerPage.enterQuantity(ORDER_QUANTITY);

        Assert.assertEquals(offerPage.getTotalPrice(), ORDER_TOTAL, ASSERT_ORDER_TOTAL);

        offerPage.addToCart();

        CartModal cartModal = new CartModal(driver, wait);

        Assert.assertTrue(cartModal.isDisplayed(), ASSERT_CART_OPEN);
        Assert.assertEquals(cartModal.getItemName(), OFFER_NAME, ASSERT_CART_ITEM);
        Assert.assertEquals(cartModal.getQuantity(), ORDER_QUANTITY, ASSERT_CART_QUANTITY);

        cartModal.enterBuyerNote(buyerNote);
        cartModal.confirmOrder();

        clearCurrentSession();

        loginPage = new LoginPage(driver, wait);
        loginPage.open().login(SELLER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        SellerOrdersPage sellerOrdersPage = new SellerOrdersPage(driver, wait);
        sellerOrdersPage.open();

        Assert.assertEquals(sellerOrdersPage.getOrderStatus(buyerNote), STATUS_PENDING, ASSERT_NEW_ORDER_PENDING);

        sellerOrdersPage.openOrderDetails(buyerNote);

        SellerOrderDetailPage orderDetailPage = new SellerOrderDetailPage(driver, wait);

        Assert.assertEquals(orderDetailPage.getStatus(), STATUS_PENDING, ASSERT_DETAIL_PENDING);
        Assert.assertEquals(orderDetailPage.getBuyerEmail(), BUYER_EMAIL, ASSERT_BUYER_EMAIL);

        orderDetailPage.openAcceptForm();
        orderDetailPage.enterEstimatedPickupAfterHours(PICKUP_DELAY_HOURS);
        orderDetailPage.confirmAcceptance();

        Assert.assertEquals(orderDetailPage.getStatus(), STATUS_ACCEPTED, ASSERT_ORDER_ACCEPTED);

        orderDetailPage.markAsReady();

        Assert.assertEquals(orderDetailPage.getStatus(), STATUS_READY, ASSERT_ORDER_READY);
    }
}