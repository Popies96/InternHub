package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "internships")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    private int durationInMonths;

    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private InternshipStatus status; // e.g., OPEN, FILLED, CLOSED

    @ManyToOne
    @JoinColumn(name = "enterprise_id", nullable = false)
    @JsonBackReference
    private Enterprise enterprise; // The enterprise that created the internship

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student; // The student who takes the internship

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL)
    private List<Task> tasks; // Tasks assigned to this internship

    // New fields based on the form
    private String positionTitle; // Position title
    private String department; // Department
    private String positionSummary; // Position Summary
    private Double stipend; // Stipend (nullable)
    private String stipendFrequency; // Stipend Frequency (per month, per week, per hour)
    private Integer positionsAvailable; // Number of positions available
    private LocalDate applicationDeadline; // Application deadline
    @ElementCollection
    @CollectionTable(name = "required_materials", joinColumns = @JoinColumn(name = "internship_id"))
    @Column(name = "material")
    private List<String> requiredMaterials; // List of required materials (e.g. resume, cover letter, etc.)
    private String additionalNotes; // Additional Notes

    // Getters and Setters for new fields
    public String getPositionTitle() {
        return positionTitle;
    }

    public void setPositionTitle(String positionTitle) {
        this.positionTitle = positionTitle;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPositionSummary() {
        return positionSummary;
    }

    public void setPositionSummary(String positionSummary) {
        this.positionSummary = positionSummary;
    }

    public Double getStipend() {
        return stipend;
    }

    public void setStipend(Double stipend) {
        this.stipend = stipend;
    }

    public String getStipendFrequency() {
        return stipendFrequency;
    }

    public void setStipendFrequency(String stipendFrequency) {
        this.stipendFrequency = stipendFrequency;
    }

    public Integer getPositionsAvailable() {
        return positionsAvailable;
    }

    public void setPositionsAvailable(Integer positionsAvailable) {
        this.positionsAvailable = positionsAvailable;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public List<String> getRequiredMaterials() {
        return requiredMaterials;
    }

    public void setRequiredMaterials(List<String> requiredMaterials) {
        this.requiredMaterials = requiredMaterials;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
}
