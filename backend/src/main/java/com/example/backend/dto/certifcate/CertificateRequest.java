package com.example.backend.dto.certifcate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CertificateRequest {
    private String title;
    private String description;
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private String issuerFirstName;
    private String issuerLastName;
    private String intershipTitle;
    private Long internshipId;
    private Long issuerId;
    private String certificateContent;

}
