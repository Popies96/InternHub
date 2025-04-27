package com.example.backend.repository;

import com.example.backend.entity.ReportedReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportedReviewRepository extends JpaRepository<ReportedReview, UUID> {


    List<ReportedReview> findAllByStatus(ReportedReview.Status status);

}
