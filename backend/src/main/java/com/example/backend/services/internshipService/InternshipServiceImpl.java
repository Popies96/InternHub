package com.example.backend.services.internshipService;

import com.example.backend.entity.Internship;
import com.example.backend.entity.Student;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InternshipServiceImpl implements InternshipService{

    private final InternshipRepository internshipRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public InternshipServiceImpl(InternshipRepository internshipRepository, StudentRepository studentRepository) {
        this.internshipRepository = internshipRepository;
        this.studentRepository = studentRepository;
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
