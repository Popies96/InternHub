package com.example.backend.controllers;


import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;
import com.example.backend.services.certificateService.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certificates")
public class CertificateController {

    private  CertificateService certificateService;

    @Autowired
    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<CertificateResponse> createCertificate(@RequestBody CertificateRequest request) {
        CertificateResponse response = certificateService.createCertificate(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getCertificateById(@PathVariable Long id) {
        CertificateResponse response = certificateService.getCertificateById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify/{verificationId}")
    public ResponseEntity<CertificateResponse> verifyCertificate(@PathVariable String verificationId) {
        CertificateResponse response = certificateService.getCertificateByVerificationId(verificationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByStudent(@PathVariable Long studentId) {
        List<CertificateResponse> responses = certificateService.getCertificatesByStudent(studentId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByInternship(@PathVariable Long internshipId) {
        List<CertificateResponse> responses = certificateService.getCertificatesByInternship(internshipId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @PathVariable Long id,
            @RequestBody CertificateRequest request) {
        CertificateResponse response = certificateService.updateCertificate(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> revokeCertificate(@PathVariable Long id) {
        certificateService.revokeCertificate(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
}