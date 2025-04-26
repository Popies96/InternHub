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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getIntershipTitle() {
        return intershipTitle;
    }

    public void setIntershipTitle(String intershipTitle) {
        this.intershipTitle = intershipTitle;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
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

    public Long getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }

    public String getCertificateContent() {
        return certificateContent;
    }

    public void setCertificateContent(String certificateContent) {
        this.certificateContent = certificateContent;
    }
}
