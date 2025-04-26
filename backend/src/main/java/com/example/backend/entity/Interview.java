package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;


@Entity
public class Interview {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long applicationId;

    private LocalDateTime scheduledDate;
    private String location;

    @Enumerated(EnumType.STRING)
    private InterviewMode mode;

    @Enumerated(EnumType.STRING)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    private String notes;

    private String meetingLink;

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public void setScheduledDate(LocalDateTime scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setMode(InterviewMode mode) {
        this.mode = mode;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }
    public Long getId() {
        return id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public LocalDateTime getScheduledDate() {
        return scheduledDate;
    }

    public String getLocation() {
        return location;
    }

    public InterviewMode getMode() {
        return mode;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

}
