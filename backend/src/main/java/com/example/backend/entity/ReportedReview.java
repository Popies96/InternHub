package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
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

    @Enumerated(EnumType.STRING)
    private ReportReason reason; // Changed this to enum

    @Enumerated(EnumType.STRING)
    private Status status;

    private String adminAction;

    public enum Status {
        PENDING, REVIEWED, RESOLVED
    }

    public enum ReportReason {
        FALSE_INFORMATION, BAD_LANGUAGE, SPAM, OFFENSIVE_CONTENT
    }

}
