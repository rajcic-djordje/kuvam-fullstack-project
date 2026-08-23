package com.rajcic.dto.request;

public class ReportReviewRequest {

    private final String adminNote;

    public ReportReviewRequest(String adminNote) {
        this.adminNote = adminNote;
    }

    public String getAdminNote() {
        return adminNote;
    }
}