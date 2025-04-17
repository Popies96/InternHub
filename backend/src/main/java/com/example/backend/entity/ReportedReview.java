package com.example.backend.entity;

import jakarta.persistence.*;

import java.util.UUID;
@Entity
public class ReportedReview {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    private String reason;  // Reason for reporting

    @Enumerated(EnumType.STRING)
    private Status status;

    private String adminAction;  // Notes from the admin

    // Getters & Setters
    public enum Status {
        PENDING, REVIEWED, RESOLVED
    }
}
