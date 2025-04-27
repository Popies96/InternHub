package com.example.backend.services.certificateService;

import com.example.backend.dto.InternshipResponse;
import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;
import com.example.backend.entity.Internship;


import java.util.List;

public interface CertificateService {
    CertificateResponse createCertificate(CertificateRequest request);
    CertificateResponse getCertificateById(Long id);
    CertificateResponse updateCertificate(Long id, CertificateRequest request);

    void deleteCertificate(Long id);
    void sendCertificateByEmail(Long certificateId, String recipientEmail);
    List<CertificateResponse> getCertificatesForAuthenticatedStudent();
    List<CertificateResponse> getAllCertificatesForAuthenticatedIssuer();
     List<InternshipResponse> getCompletedInternshipsForAuthenticatedEnterprise();

}

