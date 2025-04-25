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
    @Query("SELECT DISTINCT i FROM Internship i " +
            "JOIN i.tasks t " +
            "WHERE i.enterprise.id = :enterpriseId " +
            "AND NOT EXISTS (" +
            "    SELECT t2 FROM Task t2 " +
            "    WHERE t2.internship = i " +
            "    AND t2.status != 'COMPLETED'" +
            ")")
    List<Internship> findCompletedInternshipsByEnterpriseId(@Param("enterpriseId") Long enterpriseId);


    @Query("SELECT DISTINCT i FROM Internship i LEFT JOIN FETCH i.student")
    List<Internship> findAllWithStudents();
}
