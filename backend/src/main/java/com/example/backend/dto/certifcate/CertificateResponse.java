package com.example.backend.dto.certifcate;

import com.example.backend.entity.CertificateStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class CertificateResponse {
    private Long id;
    private String title;
    private LocalDate issueDate;
    private String verificationID;
    private CertificateStatus status;
    private String certificateContent;
    private Long studentId;
    private String studentFirstName; // Nouveau champ
    private String studentLastName;
    private String issuerFirstName;
    private String issuerLastName;
    private String intershipTitle;
    private Long internshipId;
    private Long issuerId;
    //   private List<SkillBadgeResponse> skillBadges;








}
