
package com.example.backend.controllers;

import com.example.backend.dto.InternshipResponse;
import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;
import com.example.backend.dto.certifcate.StudentDTO;

import com.example.backend.entity.Certificate;
import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Internship;
import com.example.backend.entity.Student;
import com.example.backend.repository.CertificateRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.services.certificateService.CertificateService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;



import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/certificates")
public class CertificateController {
    private CertificateService certificateService;
    private  CertificateRepository certificateRepository;
    private InternshipRepository internshipRepository;
    private StudentRepository studentRepository;

    @Autowired
    public CertificateController(CertificateService certificateService,
                                 InternshipRepository internshipRepository,
                                 StudentRepository studentRepository) {
        this.certificateService = certificateService;
        this.internshipRepository = internshipRepository;
        this.studentRepository = studentRepository;
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

    @GetMapping
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<List<CertificateResponse>> getAllCertificatesForAuthenticatedIssuer() {
        List<CertificateResponse> responses = certificateService.getAllCertificatesForAuthenticatedIssuer();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/internships/completed")
    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<List<InternshipResponse>> getCompletedInternships() {
        List<InternshipResponse> responses = certificateService.getCompletedInternshipsForAuthenticatedEnterprise();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/internships/{internshipId}/students")
    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<List<StudentDTO>> getStudentsWithCompletedInternship(
            @PathVariable Long internshipId) {
        List<Student> students = studentRepository.findStudentsWithCompletedInternship(internshipId);
        if (students.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<StudentDTO> dtos = students.stream()
                .map(StudentDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @PathVariable Long id,
            @RequestBody CertificateRequest request) {
        CertificateResponse response = certificateService.updateCertificate(id, request);
        return ResponseEntity.ok(response);
    }



    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/my-certificates")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<CertificateResponse>> getCertificatesForAuthenticatedStudent() {
        List<CertificateResponse> responses = certificateService.getCertificatesForAuthenticatedStudent();
        return ResponseEntity.ok(responses);
    }
    @GetMapping("/{id}/details")
    public ResponseEntity<CertificateResponse> getCertificateDetails(@PathVariable Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Certificate not found"));

        CertificateResponse dto = new CertificateResponse();
        dto.setId(certificate.getId());
        dto.setTitle(certificate.getTitle());
        dto.setIssueDate(certificate.getIssueDate());
        dto.setStatus(certificate.getStatus());
        dto.setCertificateContent(certificate.getCertificateContent());

        // Student details
        if (certificate.getStudent() != null) {
            dto.setStudentFirstName(certificate.getStudent().getPrenom() + " " + certificate.getStudent().getNom());
        }

        // Internship details
        if (certificate.getInternship() != null) {
            dto.setInternshipTitle(certificate.getInternship().getTitle());
        }

        // Issuer details (Enterprise)
        if (certificate.getIssuer() != null && certificate.getIssuer() instanceof Enterprise) {
            Enterprise enterpriseIssuer = (Enterprise) certificate.getIssuer();
            dto.setIssuerCompanyName(enterpriseIssuer.getCompanyName());
        }

        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")

    @PostMapping("/{id}/send-email")
    public ResponseEntity<?> sendCertificateByEmail(
            @PathVariable Long id,
            @RequestParam String recipientEmail) {
        if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Recipient email cannot be empty");
        }
        System.out.println(recipientEmail);
        try {
            certificateService.sendCertificateByEmail(id, recipientEmail);
            return ResponseEntity.ok().build();

        } catch (MailException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}
