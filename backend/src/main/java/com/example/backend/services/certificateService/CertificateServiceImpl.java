package com.example.backend.services.certificateService;


import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.CertificateRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDate;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateServiceImpl  implements CertificateService {
    @Autowired
    private CertificateRepository certificateRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;


    private final InternshipRepository internshipRepository;

    @Autowired
    public CertificateServiceImpl(CertificateRepository certificateRepository,
                                  UserRepository userRepository,
                                  InternshipRepository internshipRepository) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.internshipRepository = internshipRepository;
    }

    @Override
    public CertificateResponse createCertificate(CertificateRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NoSuchElementException("Student not found"));

        User user = request.getIssuerId() != null ?
                userRepository.findById(request.getIssuerId())
                        .orElseThrow(() -> new NoSuchElementException("Issuer not found")) :
                null;

        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() ->  new NoSuchElementException("Internship not found"));

        Certificate certificate = new Certificate();
        certificate.setTitle(request.getTitle());
        certificate.setIssueDate(LocalDate.now());
        certificate.setVerifactionID(generateVerificationId());
        certificate.setStatus(CertificateStatus.ACTIVE);
        certificate.setCertificateContent(request.getCertificateContent());
        certificate.setStudent(student);
        certificate.setInternship(internship);
        certificate.setIssuer(user);

        Certificate savedCertificate = certificateRepository.save(certificate);
        return mapToCertificateResponse(savedCertificate);
    }

    @Override
    public CertificateResponse getCertificateById(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->  new NoSuchElementException("Certificate not found"));
        return mapToCertificateResponse(certificate);
    }
    @Override
    public List<CertificateResponse> getAllCertificates() {
        return certificateRepository.findAll().stream()
                .map(this::mapToCertificateResponse)
                .collect(Collectors.toList());
    }



    @Override
    public List<CertificateResponse> getCertificatesByStudent(Long studentId) {
        return certificateRepository.findByStudentId(studentId).stream()
                .map(this::mapToCertificateResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CertificateResponse> getCertificatesByInternship(Long internshipId) {
        return certificateRepository.findByInternshipId(internshipId).stream()
                .map(this::mapToCertificateResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CertificateResponse updateCertificate(Long id, CertificateRequest request) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->  new NoSuchElementException("Certificate not found"));

        certificate.setTitle(request.getTitle());
        certificate.setCertificateContent(request.getCertificateContent());

        Certificate updatedCertificate = certificateRepository.save(certificate);
        return mapToCertificateResponse(updatedCertificate);
    }

    @Override
    public void revokeCertificate(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->  new NoSuchElementException("Certificate not found"));
        certificate.setStatus(CertificateStatus.REVOKED);
        certificateRepository.save(certificate);
    }

    @Override
    public void deleteCertificate(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->  new NoSuchElementException("Certificate not found"));
        certificateRepository.delete(certificate);
    }

   // @Override
    //public CertificateResponse addSkillBadgeToCertificate(Long certificateId, Long skillBadgeId) {

      //  throw new UnsupportedOperationException("Not implemented yet");
    //}

    private String generateVerificationId() {
        return "VER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private CertificateResponse mapToCertificateResponse(Certificate certificate) {
        CertificateResponse response = new CertificateResponse();
        response.setId(certificate.getId());
        response.setTitle(certificate.getTitle());
        response.setIssueDate(certificate.getIssueDate());
        response.setVerificationID(certificate.getVerifactionID());
        response.setStatus(certificate.getStatus());
        response.setCertificateContent(certificate.getCertificateContent());
        response.setStudentId(certificate.getStudent().getId());
        response.setStudentFirstName(certificate.getStudent().getPrenom());
        response.setStudentLastName(certificate.getStudent().getNom());
        response.setIssuerFirstName(certificate.getIssuer().getPrenom());
        response.setIssuerFirstName(certificate.getIssuer().getNom());
        response.setIntershipTitle(certificate.getInternship().getTitle());
        response.setStudentLastName(certificate.getStudent().getNom());
        response.setInternshipId(certificate.getInternship().getId());
        if (certificate.getIssuer() != null) {
            response.setIssuerId(certificate.getIssuer().getId());
        }

        // Map skill badges if needed
        //  if (certificate.getSkillBadges() != null) {
        //    response.setSkillBadges(certificate.getSkillBadges().stream()
        //          .map(this::mapToSkillBadgeResponse)
        //        .collect(Collectors.toList()));
        //}

        return response;
    }

    //private SkillBadgeResponse mapToSkillBadgeResponse(SkillBadge skillBadge) {
    //  SkillBadgeResponse response = new SkillBadgeResponse();
    //response.setId(skillBadge.getId());
    //response.setSkillName(skillBadge.getSkillName());
    //response.setBadgeImageUrl(skillBadge.getBadgeImageUrl());
    //response.setDescription(skillBadge.getDescription());
    //return response;
    //}

}
