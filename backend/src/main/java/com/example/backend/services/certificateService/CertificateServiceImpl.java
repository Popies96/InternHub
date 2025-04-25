package com.example.backend.services.certificateService;


import com.example.backend.dto.EnterpriseDto;
import com.example.backend.dto.InternshipResponse;
import com.example.backend.dto.certifcate.CertificateRequest;
import com.example.backend.dto.certifcate.CertificateResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.CertificateRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.EmailService;
import com.example.backend.services.authSerivce.UserServiceImpl;
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
    @Autowired
    private EmailService emailService;


    private final InternshipRepository internshipRepository;
    private UserServiceImpl userService;

    @Autowired
    public CertificateServiceImpl(CertificateRepository certificateRepository,
                                  UserRepository userRepository,
                                  InternshipRepository internshipRepository,UserServiceImpl userService) {
        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.internshipRepository = internshipRepository;
        this.userService = userService;
    }



    @Override
    public CertificateResponse createCertificate(CertificateRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new NoSuchElementException("Student not found"));
        User authenticatedUser = userService.getAuthenticatedUser();

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
        certificate.setIssuer(authenticatedUser);

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
    public List<CertificateResponse> getAllCertificatesForAuthenticatedIssuer() {
        User authenticatedUser = userService.getAuthenticatedUser();

        if (!(authenticatedUser instanceof Enterprise)) {
            throw new IllegalStateException("Authenticated user is not an enterprise");
        }

        Long issuerId = authenticatedUser.getId();
        return certificateRepository.findByIssuerId(issuerId).stream()
                .map(this::mapToCertificateResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<InternshipResponse> getCompletedInternshipsForAuthenticatedEnterprise() {
        User authenticatedUser = userService.getAuthenticatedUser();

        if (!(authenticatedUser instanceof Enterprise)) {
            throw new IllegalStateException("Authenticated user is not an enterprise");
        }

        List<Internship> internships = internshipRepository
                .findCompletedInternshipsByEnterpriseId(authenticatedUser.getId());

        return internships.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private InternshipResponse convertToResponse(Internship internship) {
        InternshipResponse response = new InternshipResponse();
        response.setId(internship.getId());
        response.setTitle(internship.getTitle());
        response.setDescription(internship.getDescription());
        response.setLocation(internship.getLocation());
        response.setDurationInMonths(internship.getDurationInMonths());
        response.setStartDate(internship.getStartDate());
        response.setEndDate(internship.getEndDate());
        response.setStatus("COMPLETED"); // Forcé à COMPLETED

        if (internship.getEnterprise() != null) {
            EnterpriseDto enterpriseDto = new EnterpriseDto();
            enterpriseDto.setId(internship.getEnterprise().getId());
            response.setEnterprise(enterpriseDto);
        }

        return response;

}


    @Override
    public CertificateResponse updateCertificate(Long id, CertificateRequest request) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->  new NoSuchElementException("Certificate not found"));

        certificate.setTitle(request.getTitle());
        certificate.setCertificateContent(request.getCertificateContent());
        certificate.setStatus(request.getStatus());
        certificate.setIssueDate(request.getIssueDate());
        certificate.setVerifactionID(request.getVerificationID());


        Certificate updatedCertificate = certificateRepository.save(certificate);
        return mapToCertificateResponse(updatedCertificate);
    }



    @Override
    public void deleteCertificate(Long id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->  new NoSuchElementException("Certificate not found"));
        certificateRepository.delete(certificate);
    }



    private String generateVerificationId() {
        return "VER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private CertificateResponse mapToCertificateResponse(Certificate certificate) {
        CertificateResponse response = new CertificateResponse();
        Enterprise enterprise = (Enterprise) certificate.getIssuer();
        Internship internship = (Internship) certificate.getInternship();

        response.setId(certificate.getId());
        response.setTitle(certificate.getTitle());
        response.setIssueDate(certificate.getIssueDate());
        response.setVerificationID(certificate.getVerifactionID());
        response.setStatus(certificate.getStatus());
        response.setCertificateContent(certificate.getCertificateContent());
        response.setStudentId(certificate.getStudent().getId());
        response.setStudentFirstName(certificate.getStudent().getPrenom());
        response.setStudentLastName(certificate.getStudent().getNom());
        response.setIssuerId(certificate.getIssuer().getId());
        response.setIssuerCompanyName(enterprise.getCompanyName());
        response.setInternshipTitle(certificate.getInternship().getTitle());
     //   response.setI(internship.getTitle());
       ;

        if (certificate.getIssuer() != null) {
            response.setIssuerId(certificate.getIssuer().getId());
        }



        return response;
    }
    @Override
    public List<CertificateResponse> getCertificatesForAuthenticatedStudent() {

        User authenticatedUser = userService.getAuthenticatedUser();
        if (!(authenticatedUser instanceof Student)) {
            throw new IllegalStateException("Authenticated user is not a student");
        }

        Long studentId = authenticatedUser.getId();
        return certificateRepository.findByStudentId(studentId).stream()
                .map(this::mapToCertificateResponse)
                .collect(Collectors.toList());
    }


    @Override
    public void sendCertificateByEmail(Long certificateId, String recipientEmail) {
        Certificate certificate = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new NoSuchElementException("Certificate not found"));

        // Récupérer l'entreprise authentifiée
        User authenticatedUser = userService.getAuthenticatedUser();
        if (!(authenticatedUser instanceof Enterprise)) {
            throw new IllegalStateException("Authenticated user is not an enterprise");
        }
        Enterprise enterprise = (Enterprise) authenticatedUser;

        // Vérifier que l'entreprise a un email valide
        if (enterprise.getEmail() == null || enterprise.getEmail().isEmpty()) {
            throw new IllegalStateException("Enterprise email is not set");
        }

        String subject = "Your Certificate of Completion";
        String content = buildCertificateEmailContent(certificate, enterprise);

        // Envoyer l'email depuis l'adresse de l'entreprise
        emailService.sendEmail(recipientEmail, subject, content, enterprise.getEmail());
    }
    private String buildCertificateEmailContent(Certificate certificate, Enterprise enterprise) {
        return String.format(
                "Dear %s %s,\n\n" +
                        "Please find attached your Certificate of Completion for %s.\n\n" +
                        "Verification ID: %s\n" +
                        "Issued on: %s\n\n" +
                        "You can verify this certificate at: %s/verify/%s\n\n" +
                        "Best regards,\n" +
                        "%s\n" +
                        "Email: %s\n",
                certificate.getStudent().getPrenom(),
                certificate.getStudent().getNom(),
                certificate.getInternship().getTitle(),
                certificate.getVerifactionID(),
                certificate.getIssueDate(),
                "https://internhub.com",
                certificate.getVerifactionID(),
                enterprise.getCompanyName(),
                enterprise.getEmail()
        );
    }


}

