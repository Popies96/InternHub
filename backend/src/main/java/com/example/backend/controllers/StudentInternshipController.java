package com.example.backend.controllers;

import com.example.backend.dto.EnterpriseDto;
import com.example.backend.dto.InternshipResponse;
import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Internship;
import com.example.backend.entity.User;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.services.internshipService.InternshipService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/internship")
public class StudentInternshipController {
    private final InternshipService internshipService;
    private final UserServiceImpl userService;
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
    public ResponseEntity<InternshipResponse> createInternship(@RequestBody Internship internship) {
        User authenticatedEnterprise = userService.getAuthenticatedUser();

        if (!(authenticatedEnterprise instanceof Enterprise)) {
            throw new RuntimeException("Only enterprises can create internships.");
        }

        internship.setEnterprise((Enterprise) authenticatedEnterprise);
        internshipService.addInternship(internship);
        InternshipResponse dto = new InternshipResponse();
        BeanUtils.copyProperties(internship, dto);
        if (internship.getStatus() != null) {
            dto.setStatus(internship.getStatus().toString());
        }

        if (internship.getEnterprise() != null) {
            EnterpriseDto enterpriseDTO = new EnterpriseDto();
            BeanUtils.copyProperties(internship.getEnterprise(), enterpriseDTO);
            dto.setEnterprise(enterpriseDTO);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/enterprise")
    @PreAuthorize("hasRole('ENTERPRISE')")  // get internships for enterprise
    public ResponseEntity<List<InternshipResponse>> getInternshipsByEnterprise() {
        User authenticatedEnterprise = userService.getAuthenticatedUser();

        if (!(authenticatedEnterprise instanceof Enterprise)) {
            throw new RuntimeException("user is not an enterprise");
        }


        return ResponseEntity.ok(internshipService.getInternshipsByEnterprise(authenticatedEnterprise.getId()) );
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
}
