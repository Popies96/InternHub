package com.example.backend.controllers;

import com.example.backend.entity.Internship;
import com.example.backend.services.internshipService.InternshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/internship")
public class StudentInternshipController {
    private final InternshipService internshipService;

    @Autowired
    public StudentInternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @GetMapping
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
        Internship createdInternship = internshipService.addInternship(internship);
        return ResponseEntity.ok(createdInternship);
    }

    // Update an internship
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internship) {
        internship.setId(id);
        return ResponseEntity.ok(internshipService.updateInternship(internship));
    }

    // Remove an internship (Only enterprise can delete)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Void> removeInternship(@PathVariable Long id) {
        internshipService.removeInternship(id);
        return ResponseEntity.noContent().build();
    }
}
