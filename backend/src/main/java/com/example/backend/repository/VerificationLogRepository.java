package com.example.backend.repository;

import com.example.backend.entity.CertificateVerificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VerificationLogRepository extends JpaRepository<CertificateVerificationLog, Long> {
    List<CertificateVerificationLog> findByCertificateId(Long certificateId);

}
