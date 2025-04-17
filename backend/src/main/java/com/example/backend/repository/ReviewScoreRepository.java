package com.example.backend.repository;

import com.example.backend.entity.ReviewScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewScoreRepository extends JpaRepository<ReviewScore, Long> {
}
