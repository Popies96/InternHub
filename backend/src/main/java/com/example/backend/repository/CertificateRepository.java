package com.example.backend.repository;

import com.example.backend.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository  extends JpaRepository<Certificate, Long> {
    List<Certificate> findByStudentId(Long studentId);
    List<Certificate> findByInternshipId(Long internshipId);
    List<Certificate> findByIssuerId(Long issuerId);

  //  Optional<Certificate> findByCertificateId(String certificateId);
}
