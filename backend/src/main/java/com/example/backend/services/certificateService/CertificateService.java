package com.example.backend.services.certificateService;

import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;


import java.util.List;

public interface CertificateService {
    CertificateResponse createCertificate(CertificateRequest request);
    CertificateResponse getCertificateById(Long id);
    List<CertificateResponse> getAllCertificates();
    List<CertificateResponse> getCertificatesByStudent(Long studentId);
    List<CertificateResponse> getCertificatesByInternship(Long internshipId);
    CertificateResponse updateCertificate(Long id, CertificateRequest request);
    void revokeCertificate(Long id);
    void deleteCertificate(Long id);
}

