package com.example.backend.repository;

import com.example.backend.entity.Internship;
import com.example.backend.entity.Recommendation;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecommandationRepository extends JpaRepository<Recommendation, Long> {
    Optional<Recommendation> findByInternship(Internship internship);

}
