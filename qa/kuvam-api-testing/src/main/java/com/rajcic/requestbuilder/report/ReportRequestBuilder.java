package com.rajcic.requestbuilder.report;

import com.rajcic.dto.request.ReportRequest;
import com.rajcic.dto.request.ReportReviewRequest;
import com.rajcic.requestbuilder.report.constants.ReportRequestBuilderConstants;
import com.rajcic.specification.ReqSpecification;
import io.restassured.RestAssured;
import io.restassured.response.Response;

public class ReportRequestBuilder {

    public static Response createReport(ReportRequest request, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(ReportRequestBuilderConstants.REPORTS_PATH, request, accessToken))
                .when()
                .post()
                .then()
                .extract()
                .response();
    }

    public static Response getAdminReports(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(ReportRequestBuilderConstants.ADMIN_REPORTS_PATH, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response getPendingReports(String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthNoBody(ReportRequestBuilderConstants.ADMIN_PENDING_REPORTS_PATH, accessToken))
                .when()
                .get()
                .then()
                .extract()
                .response();
    }

    public static Response approveReport(String reportId, ReportReviewRequest request, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(ReportRequestBuilderConstants.ADMIN_REPORTS_PATH + "/" + reportId + ReportRequestBuilderConstants.APPROVE_PATH, request, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }

    public static Response rejectReport(String reportId, ReportReviewRequest request, String accessToken) {

        return RestAssured
                .given()
                .spec(ReqSpecification.requestAuthBody(ReportRequestBuilderConstants.ADMIN_REPORTS_PATH + "/" + reportId + ReportRequestBuilderConstants.REJECT_PATH, request, accessToken))
                .when()
                .patch()
                .then()
                .extract()
                .response();
    }
}