package com.example.backend.services.internshipService;

import com.example.backend.dto.EnterpriseDto;
import com.example.backend.dto.InternshipResponse;
import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Internship;
import com.example.backend.entity.Student;
import com.example.backend.repository.EnterpriseRepository;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
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

    @Autowired
    public InternshipServiceImpl(InternshipRepository internshipRepository, StudentRepository studentRepository, EnterpriseRepository enterpriseRepository) {
        this.internshipRepository = internshipRepository;
        this.studentRepository = studentRepository;
        this.enterpriseRepository = enterpriseRepository;
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
                    EnterpriseDto enterpriseDTO = new EnterpriseDto();
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


}
