package com.example.backend.dto;

import com.example.backend.entity.InternshipStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class InternshipResponseT {
    private Long id;
    private String title;
    private String description;
    private String location;
    private Integer durationInMonths;
    private LocalDate startDate;
    private LocalDate endDate;
    private InternshipStatus status;
    private Long enterpriseId;  // Direct DB field
    private Long studentId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getDurationInMonths() {
        return durationInMonths;
    }

    public void setDurationInMonths(Integer durationInMonths) {
        this.durationInMonths = durationInMonths;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public InternshipStatus getStatus() {
        return status;
    }

    public void setStatus(InternshipStatus status) {
        this.status = status;
    }

    public Long getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(Long enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }


    // Direct DB field

    // Optional nested objects (uncomment if needed)
    /*
    private EnterpriseSummary enterprise;
    private StudentSummary student;

    @Data
    public static class EnterpriseSummary {
        private Long id;
        private String name;
    }

    @Data
    public static class StudentSummary {
        private Long id;
        private String firstName;
        private String lastName;
    }
    */
}