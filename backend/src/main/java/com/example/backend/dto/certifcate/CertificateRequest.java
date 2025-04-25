package com.example.backend.dto.certifcate;

import com.example.backend.entity.CertificateStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

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
    private CertificateStatus status;
    private LocalDate issueDate;
    private String verificationID;
    private Long internshipId;
  //  private Long issuerId;
    private String certificateContent;

}
