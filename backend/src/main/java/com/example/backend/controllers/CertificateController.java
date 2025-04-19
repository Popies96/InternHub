
package com.example.backend.controllers;

import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;
import com.example.backend.dto.certifcate.StudentDTO;

import com.example.backend.entity.Certificate;
import com.example.backend.entity.Internship;
import com.example.backend.entity.Student;
import com.example.backend.repository.CertificateRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.services.certificateService.CertificateService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.util.List;
import java.util.stream.Collectors;

@RestController
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
    //@PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
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
    public ResponseEntity<List<CertificateResponse>> getAllCertificates() {
        List<CertificateResponse> responses = certificateService.getAllCertificates();
        return ResponseEntity.ok(responses);
    }


    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByStudent(@PathVariable Long studentId) {
        List<CertificateResponse> responses = certificateService.getCertificatesByStudent(studentId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/internship/{internshipId}")
    //@PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<List<CertificateResponse>> getCertificatesByInternship(@PathVariable Long internshipId) {
        List<CertificateResponse> responses = certificateService.getCertificatesByInternship(internshipId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ENTERPRISE') or hasRole('ADMIN')")
    public ResponseEntity<CertificateResponse> updateCertificate(
            @PathVariable Long id,
            @RequestBody CertificateRequest request) {
        CertificateResponse response = certificateService.updateCertificate(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/revoke")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> revokeCertificate(@PathVariable Long id) {
        certificateService.revokeCertificate(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/internships")
    public ResponseEntity<List<Internship>> getAllInternshipsForCertificates() {
        List<Internship> internships = internshipRepository.findAllWithStudents();
        return ResponseEntity.ok(internships);
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
            dto.setIntershipTitle(certificate.getInternship().getTitle());

        }

        return ResponseEntity.ok(dto);
    }
    @GetMapping("/internships/{internshipId}/students")
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
}
