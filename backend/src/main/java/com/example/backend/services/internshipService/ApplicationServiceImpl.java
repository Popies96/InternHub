// src/main/java/com/example/backend/service/impl/ApplicationServiceImpl.java
package com.example.backend.services.internshipService;

import com.example.backend.dto.ApplicationRequestDto;
import com.example.backend.dto.ApplicationResponseDto;
import com.example.backend.entity.*;
import com.example.backend.repository.ApplicationRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.services.TopicService.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService{
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final FileStorageService fileStorageService;

    @Override
    public ApplicationResponseDto createApplication(ApplicationRequestDto requestDTO) {
        Student student = studentRepository.findById(requestDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Internship internship = internshipRepository.findById(requestDTO.getInternshipId())
                .orElseThrow(() -> new RuntimeException("Internship not found"));




        Application application = new Application();
        application.setStudent(student);
        application.setInternship(internship);
        application.setAbout(requestDTO.getAbout());
        application.setResumePath(String.valueOf(requestDTO.getResumeFilename()));
        application.setFirstName(requestDTO.getFirstName());
        application.setLastName(requestDTO.getLastName());
        application.setEmail(requestDTO.getEmail());
        application.setCountry(requestDTO.getCountry());
        application.setStreetAddress(requestDTO.getStreetAddress());
        application.setCity(requestDTO.getCity());
        application.setRegion(requestDTO.getRegion());
        application.setPostalCode(requestDTO.getPostalCode());

        Application savedApplication = applicationRepository.save(application);
        return mapToResponseDTO(savedApplication);
    }

    @Override
    public List<ApplicationResponseDto> getAllApplications() {
        return applicationRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationResponseDto getApplicationById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return mapToResponseDTO(application);
    }

    @Override
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found");
        }
        applicationRepository.deleteById(id);
    }

    private ApplicationResponseDto mapToResponseDTO(Application application) {
        ApplicationResponseDto dto = new ApplicationResponseDto();
        dto.setId(application.getId());
        dto.setStudentId(application.getStudent().getId());
        dto.setInternshipId(application.getInternship().getId());
        dto.setApplicationDate(application.getApplicationDate());
        dto.setStatus(application.getStatus());
        dto.setAbout(application.getAbout());
        dto.setResumePath(application.getResumePath());
        dto.setFirstName(application.getFirstName());
        dto.setLastName(application.getLastName());
        dto.setEmail(application.getEmail());
        dto.setCountry(application.getCountry());
        dto.setStreetAddress(application.getStreetAddress());
        dto.setCity(application.getCity());
        dto.setRegion(application.getRegion());
        dto.setPostalCode(application.getPostalCode());
        return dto;
    }

}