package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InternshipDto {
private Long id ;
    // Existing fields
    private String title;
    private String description;
    private String location;
    private int durationInMonths;
    private LocalDate startDate;
    private LocalDate endDate;

    // New fields based on your updated entity
    private String positionTitle; // Position title
    private String department; // Department
    private String positionSummary; // Position Summary
    private Double stipend; // Stipend (nullable)
    private String stipendFrequency; // Stipend Frequency (per month, per week, per hour)
    private Integer positionsAvailable; // Number of positions available
    private LocalDate applicationDeadline; // Application deadline
    // List of required materials (e.g. resume, cover letter, etc.)
    private String additionalNotes; // Additional Notes

}
