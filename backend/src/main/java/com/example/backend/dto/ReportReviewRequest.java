package com.example.backend.dto;

import com.example.backend.entity.Review;
import com.example.backend.entity.User;
import com.example.backend.entity.ReportedReview;

public class ReportReviewRequest {
    private Long reviewId;  // or String if you prefer
    private String reason;  // or your enum type

    // Getters and setters only for these fields
    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}