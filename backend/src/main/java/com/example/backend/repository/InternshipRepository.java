package com.example.backend.repository;

import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Internship;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InternshipRepository extends JpaRepository<Internship,Long> {
    List<Internship> findByStudentId(Long studentId);



    List<Internship> findByEnterprise(Optional<Enterprise> enterprise);

    List<Internship> findByEnterpriseId(Long enterpriseId);

   
    @Query("SELECT DISTINCT i FROM Internship i LEFT JOIN FETCH i.student")
    List<Internship> findAllWithStudents();
}
