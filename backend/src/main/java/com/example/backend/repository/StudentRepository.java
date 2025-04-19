package com.example.backend.repository;

import com.example.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student,Long> {
    @Query("SELECT DISTINCT s FROM Student s " +
            "JOIN s.internships i " +
            "WHERE i.id = :internshipId " +
            "AND NOT EXISTS (" +
            "  SELECT t FROM Task t WHERE t.internship = i AND t.status <> 'COMPLETED'" +
            ")")
    List<Student> findStudentsWithCompletedInternship(@Param("internshipId") Long internshipId);}


