package com.example.backend.dto;

import com.example.backend.entity.ApplicationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationResponseDto {
    private Long id;
    private Long studentId;
    private Long internshipId;
    private LocalDateTime applicationDate;
    private ApplicationStatus status;
    private String about;
    private String resumePath;
    private String firstName;
    private String lastName;
    private String email;
    private String country;
    private String streetAddress;
    private String city;
    private String region;
    private String postalCode;
}