package com.example.backend.repository;

import com.example.backend.entity.InternshipAi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InternshipAiRepository extends JpaRepository<InternshipAi,Long> {
    Optional<InternshipAi> findById(Long id);
}
