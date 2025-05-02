package com.example.backend.controllers;

import com.example.backend.dto.ApplicationRequestDto;
import com.example.backend.dto.ApplicationResponseDto;
import com.example.backend.entity.Application;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.services.internshipService.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/application")
public class ApplicationController {

    @Autowired
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationResponseDto> createApplication(@RequestBody ApplicationRequestDto requestDTO) {
        ApplicationResponseDto created = applicationService.createApplication(requestDTO);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationResponseDto>> getAllApplications() {
        List<ApplicationResponseDto> applications = applicationService.getAllApplications();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/app/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationResponseDto> getApplicationById(@PathVariable Long id) {
        ApplicationResponseDto application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.noContent().build();
    }

}
