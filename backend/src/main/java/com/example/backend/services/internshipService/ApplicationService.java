package com.example.backend.services.internshipService;

import com.example.backend.dto.ApplicationRequestDto;
import com.example.backend.dto.ApplicationResponseDto;

import java.net.MalformedURLException;
import java.util.List;

public interface ApplicationService {
    ApplicationResponseDto createApplication(ApplicationRequestDto requestDTO);
    List<ApplicationResponseDto> getAllApplications();
    ApplicationResponseDto getApplicationById(Long id);
    void deleteApplication(Long id);
}