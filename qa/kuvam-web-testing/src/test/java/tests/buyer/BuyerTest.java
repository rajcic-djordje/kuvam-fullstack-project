package tests.buyer;

import com.rajcic.pages.BuyerOrderDetailPage;
import com.rajcic.pages.auth.LoginPage;
import com.rajcic.pages.auth.RegisterPage;

import com.rajcic.pages.cart.CartModal;
import com.rajcic.pages.location.LocationModal;
import com.rajcic.pages.offers.OfferPage;
import com.rajcic.pages.offers.OffersPage;
import com.rajcic.pages.orders.MyOrdersPage;
import com.rajcic.pages.sellers.SellerOrderDetailPage;
import com.rajcic.pages.sellers.SellerOrdersPage;
import com.rajcic.pages.sellers.SellerPage;
import org.testng.Assert;
import org.testng.annotations.Test;
import tests.base.BaseTest;

import static tests.buyer.constants.BuyerTestConstants.*;

public class BuyerTest extends BaseTest {

    @Test
    public void buyerLocationAndOfferDiscoveryFlowTest() {
        String email = LOCATION_EMAIL_PREFIX + System.currentTimeMillis() + TEST_EMAIL_DOMAIN;

        RegisterPage registerPage = new RegisterPage(driver, wait);
        registerPage.open().registerBuyer(TEST_FIRST_NAME, LOCATION_LAST_NAME, email, PASSWORD);
        registerPage.waitForLoginPage();

        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.login(email, PASSWORD);
        loginPage.waitForHomePage();

        LocationModal locationModal = new LocationModal(driver, wait);

        Assert.assertTrue(locationModal.isDisplayed(), ASSERT_LOCATION_MODAL_DISPLAYED);

        locationModal.selectCity(LOCATION_CITY).enterStreet(LOCATION_STREET).enterStreetNumber(LOCATION_STREET_NUMBER).save();

        OffersPage offersPage = new OffersPage(driver, wait);
        offersPage.open();

        Assert.assertTrue(offersPage.hasSellers(), ASSERT_SELLERS_DISPLAYED);
    }

    @Test
    public void cartAndOrderCreationFlowTest() {
        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.open().login(BUYER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        OffersPage offersPage = new OffersPage(driver, wait);
        offersPage.open().openSeller(SELLER_NAME);

        SellerPage sellerPage = new SellerPage(driver, wait);
        sellerPage.openOffer(OFFER_NAME);

        OfferPage offerPage = new OfferPage(driver, wait);

        Assert.assertEquals(offerPage.getOfferName(), OFFER_NAME, ASSERT_OFFER_NAME);
        Assert.assertEquals(offerPage.getOfferPrice(), OFFER_PRICE, ASSERT_OFFER_PRICE);

        offerPage.enterQuantity(TWO_PORTIONS);

        Assert.assertEquals(offerPage.getTotalPrice(), TWO_PORTIONS_TOTAL, ASSERT_TWO_PORTIONS_TOTAL);

        offerPage.addToCart();

        CartModal cartModal = new CartModal(driver, wait);

        Assert.assertTrue(cartModal.isDisplayed(), ASSERT_CART_AUTO_OPEN);
        Assert.assertEquals(cartModal.getItemCount(), ONE_ITEM, ASSERT_CART_ITEM_COUNT);
        Assert.assertEquals(cartModal.getItemName(), OFFER_NAME, ASSERT_CART_ITEM_NAME);
        Assert.assertEquals(cartModal.getQuantity(), TWO_PORTIONS, ASSERT_CART_QUANTITY);
        Assert.assertEquals(cartModal.getTotalPrice(), TWO_PORTIONS_TOTAL, ASSERT_CART_TOTAL);

        cartModal.enterBuyerNote(ORDER_NOTE);
        cartModal.confirmOrder();
    }

    @Test
    public void buyerOrderPickupFlowTest() {
        String buyerNote = PICKUP_NOTE_PREFIX + System.currentTimeMillis();

        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.open().login(BUYER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        OffersPage offersPage = new OffersPage(driver, wait);
        offersPage.open().openSeller(SELLER_NAME);

        SellerPage sellerPage = new SellerPage(driver, wait);
        sellerPage.openOffer(OFFER_NAME);

        OfferPage offerPage = new OfferPage(driver, wait);

        Assert.assertEquals(offerPage.getOfferName(), OFFER_NAME, ASSERT_PICKUP_OFFER);

        offerPage.enterQuantity(ONE_PORTION);
        offerPage.addToCart();

        CartModal cartModal = new CartModal(driver, wait);

        Assert.assertTrue(cartModal.isDisplayed(), ASSERT_CART_OPEN);

        cartModal.enterBuyerNote(buyerNote);
        cartModal.confirmOrder();

        MyOrdersPage myOrdersPage = new MyOrdersPage(driver, wait);
        myOrdersPage.open();

        Assert.assertEquals(myOrdersPage.getOrderStatus(buyerNote), STATUS_PENDING, ASSERT_NEW_ORDER_PENDING);
        Assert.assertEquals(myOrdersPage.getOrderTotal(buyerNote), OFFER_PRICE, ASSERT_PICKUP_TOTAL);

        myOrdersPage.openOrderDetails(buyerNote);

        BuyerOrderDetailPage buyerOrderDetailPage = new BuyerOrderDetailPage(driver, wait);

        Assert.assertEquals(buyerOrderDetailPage.getStatus(), STATUS_PENDING, ASSERT_BUYER_PENDING_DETAIL);
        Assert.assertTrue(buyerOrderDetailPage.isPickupAddressLocked(), ASSERT_PICKUP_ADDRESS_LOCKED);

        clearCurrentSession();

        loginPage = new LoginPage(driver, wait);
        loginPage.open().login(SELLER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        SellerOrdersPage sellerOrdersPage = new SellerOrdersPage(driver, wait);
        sellerOrdersPage.open();

        Assert.assertEquals(sellerOrdersPage.getOrderStatus(buyerNote), STATUS_PENDING, ASSERT_SELLER_RECEIVES_PENDING);

        sellerOrdersPage.openOrderDetails(buyerNote);

        SellerOrderDetailPage sellerOrderDetailPage = new SellerOrderDetailPage(driver, wait);

        sellerOrderDetailPage.openAcceptForm();
        sellerOrderDetailPage.enterEstimatedPickupAfterHours(PICKUP_DELAY_HOURS);
        sellerOrderDetailPage.confirmAcceptance();

        Assert.assertEquals(sellerOrderDetailPage.getStatus(), STATUS_ACCEPTED, ASSERT_SELLER_ACCEPTED);

        sellerOrderDetailPage.markAsReady();

        Assert.assertEquals(sellerOrderDetailPage.getStatus(), STATUS_READY, ASSERT_SELLER_READY);

        clearCurrentSession();

        loginPage = new LoginPage(driver, wait);
        loginPage.open().login(BUYER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        myOrdersPage = new MyOrdersPage(driver, wait);
        myOrdersPage.open();

        Assert.assertEquals(myOrdersPage.getOrderStatus(buyerNote), STATUS_READY, ASSERT_BUYER_READY);

        myOrdersPage.openOrderDetails(buyerNote);

        buyerOrderDetailPage = new BuyerOrderDetailPage(driver, wait);

        Assert.assertEquals(buyerOrderDetailPage.getStatus(), STATUS_READY, ASSERT_BUYER_READY_DETAIL);
        Assert.assertEquals(buyerOrderDetailPage.getPickupCity(), PICKUP_CITY, ASSERT_PICKUP_CITY);
        Assert.assertEquals(buyerOrderDetailPage.getPickupStreet(), PICKUP_STREET, ASSERT_PICKUP_STREET);
        Assert.assertTrue(buyerOrderDetailPage.hasValidPickupCode(), ASSERT_PICKUP_CODE);

        buyerOrderDetailPage.markAsOnTheWay();

        Assert.assertTrue(buyerOrderDetailPage.isOnTheWayConfirmed(), ASSERT_ON_THE_WAY);
    }

    @Test
    public void completedOrderReviewAndReportFlowTest() {
        long timestamp = System.currentTimeMillis();

        String buyerNote = COMPLETED_NOTE_PREFIX + timestamp;
        String reviewComment = REVIEW_COMMENT_PREFIX + timestamp;
        String reportDescription = REPORT_DESCRIPTION_PREFIX + timestamp;

        LoginPage loginPage = new LoginPage(driver, wait);
        loginPage.open().login(BUYER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        OffersPage offersPage = new OffersPage(driver, wait);
        offersPage.open().openSeller(SELLER_NAME);

        SellerPage sellerPage = new SellerPage(driver, wait);
        sellerPage.openOffer(OFFER_NAME);

        OfferPage offerPage = new OfferPage(driver, wait);
        offerPage.enterQuantity(ONE_PORTION);
        offerPage.addToCart();

        CartModal cartModal = new CartModal(driver, wait);

        Assert.assertTrue(cartModal.isDisplayed(), ASSERT_CART_OPEN);

        cartModal.enterBuyerNote(buyerNote);
        cartModal.confirmOrder();

        clearCurrentSession();

        loginPage = new LoginPage(driver, wait);
        loginPage.open().login(SELLER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        SellerOrdersPage sellerOrdersPage = new SellerOrdersPage(driver, wait);
        sellerOrdersPage.open().openOrderDetails(buyerNote);

        SellerOrderDetailPage sellerDetail = new SellerOrderDetailPage(driver, wait);

        Assert.assertEquals(sellerDetail.getStatus(), STATUS_PENDING, ASSERT_CREATED_ORDER_PENDING);

        sellerDetail.openAcceptForm();
        sellerDetail.enterEstimatedPickupAfterHours(PICKUP_DELAY_HOURS);
        sellerDetail.confirmAcceptance();
        sellerDetail.markAsReady();

        Assert.assertEquals(sellerDetail.getStatus(), STATUS_READY, ASSERT_ORDER_MOVED_TO_READY);

        clearCurrentSession();

        loginPage = new LoginPage(driver, wait);
        loginPage.open().login(BUYER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        MyOrdersPage myOrdersPage = new MyOrdersPage(driver, wait);
        myOrdersPage.open().openOrderDetails(buyerNote);

        BuyerOrderDetailPage buyerDetail = new BuyerOrderDetailPage(driver, wait);

        Assert.assertEquals(buyerDetail.getStatus(), STATUS_READY, ASSERT_BUYER_SEES_READY);
        Assert.assertTrue(buyerDetail.hasValidPickupCode(), ASSERT_BUYER_RECEIVES_CODE);

        String pickupCode = buyerDetail.getPickupCode();

        clearCurrentSession();

        loginPage = new LoginPage(driver, wait);
        loginPage.open().login(SELLER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        sellerOrdersPage = new SellerOrdersPage(driver, wait);
        sellerOrdersPage.open().openOrderDetails(buyerNote);

        sellerDetail = new SellerOrderDetailPage(driver, wait);

        Assert.assertEquals(sellerDetail.getStatus(), STATUS_READY, ASSERT_SELLER_SEES_READY);

        sellerDetail.completeOrder(pickupCode);

        Assert.assertEquals(sellerDetail.getStatus(), STATUS_COMPLETED, ASSERT_ORDER_COMPLETED);

        clearCurrentSession();

        loginPage = new LoginPage(driver, wait);
        loginPage.open().login(BUYER_EMAIL, PASSWORD);
        loginPage.waitForHomePage();

        myOrdersPage = new MyOrdersPage(driver, wait);
        myOrdersPage.open().openOrderDetails(buyerNote);

        buyerDetail = new BuyerOrderDetailPage(driver, wait);

        Assert.assertEquals(buyerDetail.getStatus(), STATUS_COMPLETED, ASSERT_BUYER_SEES_COMPLETED);

        buyerDetail.submitReview(reviewComment);

        Assert.assertTrue(buyerDetail.isReviewModalClosed(), ASSERT_REVIEW_MODAL_CLOSED);

        buyerDetail.submitReport(REPORT_REASON_OTHER, reportDescription);

        Assert.assertTrue(buyerDetail.isReportModalClosed(), ASSERT_REPORT_MODAL_CLOSED);
    }
}