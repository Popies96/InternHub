package com.example.backend.repository;

import com.example.backend.entity.Application;
import com.example.backend.entity.Internship;
import com.example.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByInternship(Internship internship);

    boolean existsByStudentIdAndInternshipId(Long studentId, Long internshipId);

    List<Application> findByStudentId(Long studentId);

    List<Application> findByInternshipId(Long internshipId);


    boolean existsByInternshipAndStudent(Internship internship, Student student);
}
