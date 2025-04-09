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

    public void setId(Long id) {
        this.id = id;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public void setVerificationID(String verificationID) {
        this.verificationID = verificationID;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public void setCertificateContent(String certificateContent) {
        this.certificateContent = certificateContent;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }

    public void setIssuerId(Long issuerId) {
        this.issuerId = issuerId;
    }

    public void setSkillBadges(List<SkillBadgeResponse> skillBadges) {
        this.skillBadges = skillBadges;
    }

    private String certificateId;
    private String title;
    private LocalDate issueDate;
    private String verificationID;
    private CertificateStatus status;
    private String certificateContent;
    private Long studentId;
    private Long internshipId;
    private Long issuerId;
    private List<SkillBadgeResponse> skillBadges;
}
