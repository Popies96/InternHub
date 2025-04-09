package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String certificateId; // Changed from verifactionID

    private String title;
    private LocalDate issueDate;
    private String verifactionID;
    @Enumerated(EnumType.STRING)
    private CertificateStatus status;
    @Lob
    private String certificateContent;
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne
    @JoinColumn(name = "issuer_id")
    private User issuer;

    @OneToMany(mappedBy = "certificate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkillBadge> skillBadges = new ArrayList<>();
    public void setTitle(String title) {
        this.title = title;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public void setVerifactionID(String verifactionID) {
        this.verifactionID = verifactionID;
    }

    public void setStatus(CertificateStatus status) {
        this.status = status;
    }

    public void setCertificateContent(String certificateContent) {
        this.certificateContent = certificateContent;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Long getId() {
        return id;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public String getTitle() {
        return title;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public String getVerifactionID() {
        return verifactionID;
    }

    public CertificateStatus getStatus() {
        return status;
    }

    public String getCertificateContent() {
        return certificateContent;
    }

    public User getStudent() {
        return student;
    }

    public Internship getInternship() {
        return internship;
    }

    public User getIssuer() {
        return issuer;
    }

    public List<SkillBadge> getSkillBadges() {
        return skillBadges;
    }

    public void setInternship(Internship internship) {
        this.internship = internship;
    }

    public void setIssuer(User issuer) {
        this.issuer = issuer;
    }

    public void setSkillBadges(List<SkillBadge> skillBadges) {
        this.skillBadges = skillBadges;
    }

}
