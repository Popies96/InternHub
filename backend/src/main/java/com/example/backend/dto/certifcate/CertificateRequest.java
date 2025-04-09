package com.example.backend.dto.certifcate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CertificateRequest {
    private String title;
    private String description;
    private Long studentId;
    private Long internshipId;
    private Long issuerId;
    private String certificateContent;
    public Long getStudentId() {
        return studentId;
    }

    public Long getInternshipId() {
        return internshipId;
    }

    public Long getIssuerId() {
        return issuerId;
    }

    public String getTitle() {
        return title;
    }

    public String getCertificateContent() {
        return certificateContent;
    }
}
