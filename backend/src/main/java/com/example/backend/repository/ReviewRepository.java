package com.example.backend.repository;

import com.example.backend.entity.ReportedReview;
import com.example.backend.entity.Review;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
 /*   List<Review> findByRevieweeId(Long revieweeId);
    List<Review> findByReviewerId(Long reviewerId);*/
    List<Review> findByInternshipId(Long internshipId);

    @EntityGraph(attributePaths = "reviewScores")
    List<Review> findAll();

}
