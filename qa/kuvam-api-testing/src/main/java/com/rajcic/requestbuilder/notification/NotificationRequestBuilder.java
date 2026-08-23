package com.rajcic.requestbuilder.notification;

import com.rajcic.requestbuilder.notification.constants.NotificationRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.response.Response;

import static io.restassured.RestAssured.given;

public class NotificationRequestBuilder {

    public static Response getNotifications(String accessToken) {

        return given()
                .spec(ReqSpecification.requestAuthNoBody(NotificationRequestBuilderConstants.NOTIFICATIONS_PATH, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();

    }

    public static Response getUnreadCount(String accessToken) {

        return given()
                .spec(ReqSpecification.requestAuthNoBody(NotificationRequestBuilderConstants.NOTIFICATIONS_UNREAD_PATH, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response markNotificationAsRead(String notificationId, String accessToken) {

        return given()
                .spec(ReqSpecification.requestAuthNoBody(NotificationRequestBuilderConstants.NOTIFICATIONS_PATH + notificationId + NotificationRequestBuilderConstants.NOTIFICATIONS_READ_PATH, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response markAllNotificationsAsRead(String accessToken) {

        return given()
                .spec(ReqSpecification.requestAuthNoBody(NotificationRequestBuilderConstants.NOTIFICATIONS_READ_ALL_PATH, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }
}