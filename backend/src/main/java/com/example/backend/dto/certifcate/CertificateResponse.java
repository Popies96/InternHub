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
    private Long internshipId;
    private String internshipTitle;
    private Long issuerId;
    private String issuerCompanyName;


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

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public String getVerificationID() {
        return verificationID;
    }

    public void setVerificationID(String verificationID) {
        this.verificationID = verificationID;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public String getCertificateContent() {
        return certificateContent;
    }

    public void setCertificateContent(String certificateContent) {
        this.certificateContent = certificateContent;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentFirstName() {
        return studentFirstName;
    }

    public void setStudentFirstName(String studentFirstName) {
        this.studentFirstName = studentFirstName;
    }

    public String getStudentLastName() {
        return studentLastName;
    }

    public void setStudentLastName(String studentLastName) {
        this.studentLastName = studentLastName;
    }

    public String getIssuerFirstName() {
        return issuerFirstName;
    }

    public void setIssuerFirstName(String issuerFirstName) {
        this.issuerFirstName = issuerFirstName;
    }

    public String getIssuerLastName() {
        return issuerLastName;
    }

    public void setIssuerLastName(String issuerLastName) {
        this.issuerLastName = issuerLastName;
    }

    public Long getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }

    public String getInternshipTitle() {
        return internshipTitle;
    }

    public void setInternshipTitle(String internshipTitle) {
        this.internshipTitle = internshipTitle;
    }

    public Long getIssuerId() {
        return issuerId;
    }

    public void setIssuerId(Long issuerId) {
        this.issuerId = issuerId;
    }

    public String getIssuerCompanyName() {
        return issuerCompanyName;
    }

    public void setIssuerCompanyName(String issuerCompanyName) {
        this.issuerCompanyName = issuerCompanyName;
    }
}
