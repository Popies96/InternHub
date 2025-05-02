package com.example.backend.controllers;

import com.example.backend.dto.EnterpriseDTO;
import com.example.backend.dto.InternshipDto;
import com.example.backend.dto.InternshipResponse;
import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Internship;
import com.example.backend.repository.InternshipAiRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.services.internshipService.InternshipServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/test")
public class InternshipController {

    private final InternshipServiceImpl internshipService;
    private final UserServiceImpl userService;
    @Autowired
    private final InternshipRepository internshipRepository;
    private final InternshipAiRepository internshipAiRepository;

    @Autowired
    public InternshipController(InternshipServiceImpl internshipService, UserServiceImpl userService, InternshipRepository internshipRepository, InternshipAiRepository internshipAiRepository) {
        this.internshipService = internshipService;
        this.userService = userService;
        this.internshipRepository = internshipRepository;
        this.internshipAiRepository = internshipAiRepository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<InternshipDto> createInternship(@RequestBody InternshipDto internshipDto) {
        // Get the authenticated enterprise
        Enterprise enterprise = (Enterprise) userService.getAuthenticatedUser();

        // Create the internship
        Internship internship = internshipService.createInternship(internshipDto, String.valueOf(enterprise));

        // Prepare response DTO
        InternshipDto responseDto = new InternshipDto();
        BeanUtils.copyProperties(internship, responseDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<InternshipDto> updateInternship(
            @PathVariable Long id,
            @RequestBody InternshipDto internshipDto) {

        Enterprise enterprise = (Enterprise) userService.getAuthenticatedUser();
        Internship existingInternship = internshipRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Update all fields from the DTO
        existingInternship.setTitle(internshipDto.getTitle());
        existingInternship.setPositionTitle(internshipDto.getPositionTitle());
        existingInternship.setDepartment(internshipDto.getDepartment());
        existingInternship.setDescription(internshipDto.getDescription());
        existingInternship.setPositionSummary(internshipDto.getPositionSummary());
        existingInternship.setLocation(internshipDto.getLocation());
        existingInternship.setDurationInMonths(internshipDto.getDurationInMonths());
        existingInternship.setStartDate(internshipDto.getStartDate());
        existingInternship.setEndDate(internshipDto.getEndDate());
        existingInternship.setApplicationDeadline(internshipDto.getApplicationDeadline());
        existingInternship.setStipend(internshipDto.getStipend());
        existingInternship.setStipendFrequency(internshipDto.getStipendFrequency());
        existingInternship.setPositionsAvailable(internshipDto.getPositionsAvailable());
        existingInternship.setAdditionalNotes(internshipDto.getAdditionalNotes());


        Internship updatedInternship = internshipService.updateInternship(existingInternship);

        InternshipDto responseDto = new InternshipDto();
        BeanUtils.copyProperties(updatedInternship, responseDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        internshipService.removeInternship(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search/{title}")
    public ResponseEntity<List<Internship>> searchInternshipsByTitle(@PathVariable String title) {
        List<Internship> internships = internshipService.searchByTitle(title);
        return internships.isEmpty()
                ? ResponseEntity.noContent().build()  // 204 No Content if no internships found
                : ResponseEntity.ok(internships);     // 200 OK with internships list
    }

    @GetMapping("/search/{companyName}")
    public ResponseEntity<List<Internship>> searchInternshipsByCompanyName(@PathVariable String companyName) {
        List<Internship> internships = internshipService.getInternshipsByCompanyName(companyName);

        // If no internships found, return 204 No Content
        if (internships.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // If internships are found, return them with 200 OK
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/all")
    public List<InternshipDto> getAllInternships() {
        List<Internship> internships = internshipService.retrieveInternships();
        return internships.stream()
                .map(internship -> {
                    InternshipDto response = new InternshipDto();

                    BeanUtils.copyProperties(internship, response);
                    return response;
                })
                .collect(Collectors.toList());

    }

    @GetMapping("/get/{id}")
    public ResponseEntity<InternshipDto> getIntershipById(@PathVariable Long id) {
        Internship internship = internshipRepository.findById(id) .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        InternshipDto responseDto = new InternshipDto();
        BeanUtils.copyProperties(internship, responseDto);
        return ResponseEntity.ok(responseDto);


    }


}
