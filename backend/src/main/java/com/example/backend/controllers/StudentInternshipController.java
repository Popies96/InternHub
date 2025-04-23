package com.example.backend.controllers;

import com.example.backend.dto.InternshipResponse;
import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Internship;
import com.example.backend.entity.InternshipStatus;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.services.internshipService.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/internship")
public class StudentInternshipController {
    private final InternshipService internshipService;
    private final UserServiceImpl userService ;
    @Autowired
    public StudentInternshipController(InternshipService internshipService, UserServiceImpl userService) {
        this.internshipService = internshipService;
        this.userService = userService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")  // Only Admin can access all internships
    public ResponseEntity<List<Internship>> getAllInternships() {
        return ResponseEntity.ok(internshipService.retrieveInternships());
    }

    // Fetch internships by student
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') and #studentId == authentication.principal.id")  // Ensure the student can only view their own internships
    public ResponseEntity<List<Internship>> getInternshipsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(internshipService.getInternshipsByStudent(studentId));
    }

    // Apply for internship (Only student can apply)
    @PostMapping("/apply/{internshipId}/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') and #studentId == authentication.principal.id")  // Ensure the student is applying for their own internship
    public ResponseEntity<Internship> applyForInternship(@PathVariable Long internshipId, @PathVariable Long studentId) {
        Internship internship = internshipService.applyForInternship(internshipId, studentId);
        return ResponseEntity.ok(internship);
    }

    // Add a new internship (Only enterprise can create internships)
    @PostMapping("/enterprise")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Internship> addInternship(@RequestBody Internship internship) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("User Roles: " + auth.getAuthorities());

        Internship createdInternship = internshipService.addInternship(internship);
        return ResponseEntity.ok(createdInternship);
    }

    // Update an internship
    @PutMapping("/enterprise/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internship) {
        internship.setId(id);
        return ResponseEntity.ok(internshipService.updateInternship(internship));
    }

    // Remove an internship (Only enterprise can delete)
    @DeleteMapping("/enterprise/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Void> removeInternship(@PathVariable Long id) {
        internshipService.removeInternship(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/enterprise")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<List<InternshipResponse>> getInternshipsByEnterprise() {

        Enterprise enterprise = (Enterprise) userService.getAuthenticatedUser();
        List<Internship> internships = internshipService.getInternshipsByEnterprise(enterprise.getId());
        System.out.println(internships);
        List<InternshipResponse> responses = internships.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    private InternshipResponse toResponse(Internship entity) {
        InternshipResponse response = new InternshipResponse();
        response.setId(entity.getId());
        response.setTitle(entity.getTitle());
        response.setDescription(entity.getDescription());
        response.setLocation(entity.getLocation());
        response.setDurationInMonths(entity.getDurationInMonths());
        response.setStartDate(entity.getStartDate());
        response.setEndDate(entity.getEndDate());
        response.setStatus(InternshipStatus.valueOf(entity.getStatus().toString()));
        response.setEnterpriseId(entity.getEnterprise() != null ? entity.getEnterprise().getId() : null);
        response.setStudentId(entity.getStudent() != null ? entity.getStudent().getId() : null);
        return response;
    }
}
