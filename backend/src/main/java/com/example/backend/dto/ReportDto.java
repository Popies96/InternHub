package com.example.backend.dto;

import com.example.backend.entity.ReportedReview;
import com.example.backend.entity.Review;
import com.example.backend.entity.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.UUID;

public class ReportDto {

    private UUID id;


    private Long reviewId;


    private Long reportedById;


    private ReportedReview.ReportReason reason; // Changed this to enum


    private ReportedReview.Status status;

    private String adminAction;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public Long getReportedById() {
        return reportedById;
    }

    public void setReportedById(Long reportedById) {
        this.reportedById = reportedById;
    }

    public ReportedReview.ReportReason getReason() {
        return reason;
    }

    public void setReason(ReportedReview.ReportReason reason) {
        this.reason = reason;
    }

    public ReportedReview.Status getStatus() {
        return status;
    }

    public void setStatus(ReportedReview.Status status) {
        this.status = status;
    }

    public String getAdminAction() {
        return adminAction;
    }

    public void setAdminAction(String adminAction) {
        this.adminAction = adminAction;
    }
}
