package com.example.backend.services.certificateService;

import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;
import com.example.backend.entity.Certificate;
import com.example.backend.entity.CertificateVerificationLog;
import com.example.backend.entity.SkillBadge;

import java.util.List;

public interface CertificateService {
    CertificateResponse createCertificate(CertificateRequest request);
    CertificateResponse getCertificateById(Long id);
    CertificateResponse getCertificateByVerificationId(String verificationId);
    List<CertificateResponse> getCertificatesByStudent(Long studentId);
    List<CertificateResponse> getCertificatesByInternship(Long internshipId);
    CertificateResponse updateCertificate(Long id, CertificateRequest request);
    void revokeCertificate(Long id);
    void deleteCertificate(Long id);
    CertificateResponse addSkillBadgeToCertificate(Long certificateId, Long skillBadgeId);
}

