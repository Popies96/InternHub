package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Table(name = "certificate_verification_logs")
public class CertificateVerificationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "certificate_id")
    private Certificate certificate;

    private LocalDateTime verificationDate;
    private String verifierInfo;
    private boolean verificationResult;
}
