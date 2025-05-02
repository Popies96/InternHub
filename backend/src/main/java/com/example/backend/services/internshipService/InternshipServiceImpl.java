package com.example.backend.services.internshipService;

import com.example.backend.dto.EnterpriseDTO;
import com.example.backend.dto.InternshipDto;
import com.example.backend.dto.InternshipResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.EnterpriseRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.services.authSerivce.UserServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InternshipServiceImpl implements InternshipService{

    private final InternshipRepository internshipRepository;
    private final StudentRepository studentRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final UserServiceImpl userService;

    @Autowired
    public InternshipServiceImpl(InternshipRepository internshipRepository, StudentRepository studentRepository, EnterpriseRepository enterpriseRepository, UserServiceImpl userService) {
        this.internshipRepository = internshipRepository;
        this.studentRepository = studentRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.userService = userService;
    }

    @Override
    public List<Internship> retrieveInternships() {
        // Get all internships from the database
        return internshipRepository.findAll();
    }

    @Override
    public Internship updateInternship(Internship internship) {
        Optional<Internship> existingInternship = internshipRepository.findById(internship.getId());
        if (existingInternship.isPresent()) {
            return internshipRepository.save(internship);
        }
        return null;
    }

    @Override
    public Internship addInternship(Internship internship) {
        return internshipRepository.save(internship);
    }

    @Override
    public Internship retrieveInternship(long idInternship) {
        return internshipRepository.findById(idInternship).orElse(null);
    }

    @Override
    public void removeInternship(long idInternship) {
        internshipRepository.deleteById(idInternship);
    }

    @Override
    public List<Internship> getInternshipsByStudent(Long studentId) {
        return internshipRepository.findByStudentId(studentId);
    }

    @Override
    public List<InternshipResponse> getInternshipsByEnterprise(Long enterpriseId) {
        Optional<Enterprise> enterprise = enterpriseRepository.findById(enterpriseId);
        List<Internship> internships = enterprise.get().getCreatedInternships();
       return internships.stream()
                .map(internship -> {
                    InternshipResponse response = new InternshipResponse();
                    response.setStatus(internship.getStatus().toString());
                    BeanUtils.copyProperties(internship, response);
                    EnterpriseDTO enterpriseDTO = new EnterpriseDTO();
                    BeanUtils.copyProperties(internship.getEnterprise(), enterpriseDTO);
                    response.setEnterprise(enterpriseDTO); // Assuming you map enterprise to DTO
                    return response;
                })
                .collect(Collectors.toList());

    }

    @Override
    public Internship applyForInternship(Long internshipId, Long studentId) {
        Optional<Internship> internshipOpt = internshipRepository.findById(internshipId);
        Optional<Student> studentOpt = studentRepository.findById(studentId);

        if (internshipOpt.isPresent() && studentOpt.isPresent()) {
            Internship internship = internshipOpt.get();
            Student student = studentOpt.get();
            internship.setStudent(student);  // Linking student to internship
            return internshipRepository.save(internship);
        } else {
            throw new RuntimeException("Internship or Student not found");
        }
    }

    @Override
    public Internship createInternship(InternshipDto internshipDto, String username) {
        Enterprise enterprise = (Enterprise) userService.getAuthenticatedUser();

        // Create a new Internship
        Internship internship = new Internship();
        internship.setTitle(internshipDto.getTitle());
        internship.setDescription(internshipDto.getDescription());
        internship.setLocation(internshipDto.getLocation());
        internship.setDurationInMonths(internshipDto.getDurationInMonths());
        internship.setStartDate(internshipDto.getStartDate());
        internship.setEndDate(internshipDto.getEndDate());

        // New fields added
        internship.setPositionTitle(internshipDto.getPositionTitle());
        internship.setDepartment(internshipDto.getDepartment());
        internship.setPositionSummary(internshipDto.getPositionSummary());
        internship.setStipend(internshipDto.getStipend());
        internship.setStipendFrequency(internshipDto.getStipendFrequency());
        internship.setPositionsAvailable(internshipDto.getPositionsAvailable());
        internship.setApplicationDeadline(internshipDto.getApplicationDeadline());
        internship.setAdditionalNotes(internshipDto.getAdditionalNotes());

        // Set the internship status and link to the enterprise
        internship.setStatus(InternshipStatus.OPEN); // Default status is OPEN
        internship.setEnterprise(enterprise);

        return internshipRepository.save(internship);
    }



    @Override
    public List<Internship> getInternshipsByTitle(String title) {
        return internshipRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Internship> searchByTitle(String title) {
        // Perform case-insensitive partial match for internships with a title containing the given string
        return internshipRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Internship> getInternshipsByCompanyName(String companyName) {
        return internshipRepository.findByEnterpriseCompanyName(companyName);
    }
    @Override
    public List<Internship> getInternshipsByEnterpriseT(Long enterpriseId) {
        return internshipRepository.findByEnterpriseId(enterpriseId);
    }

}
