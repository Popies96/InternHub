package com.example.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Data
public class ApplicationRequestDto {
    private Long studentId;
    private Long internshipId;
    private String about;
    private MultipartFile resumeFilename;
    private String firstName;
    private String lastName;
    private String email;
    private String country;
    private String streetAddress;
    private String city;
    private String region;
    private String postalCode;

    public MultipartFile getResumeFilename() {
        return resumeFilename;
    }


}