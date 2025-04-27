package com.example.backend.services.ReviewService;

import com.example.backend.dto.ReviewDTO;
import com.example.backend.dto.ReviewScoreDTO;
import com.example.backend.entity.*;
import com.example.backend.entity.ReportedReview;
import com.example.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final InternshipRepository internshipRepository;

    @Autowired
    private ReportedReviewRepository reportedReviewRepository;


    public ReviewDTO createReviewFromDTO(ReviewDTO dto, User reviewer) {

        Internship internship = internshipRepository.findById(dto.getInternshipId())
                .orElseThrow(() -> new IllegalArgumentException("Internship not found"));


        Enterprise reviewee = (Enterprise) internship.getEnterprise();


        Review review = new Review();
        review.setComment(dto.getComment());
        review.setReviewDate(LocalDateTime.now());
        review.setReviewer(reviewer);


        review.setReviewee(reviewee);


        review.setInternship(internship);


        review.setEnterprise(reviewee);


        List<ReviewScore> scores = dto.getScores().stream().map(scoreDTO -> {
            ReviewScore score = new ReviewScore();
            score.setCriteria(scoreDTO.getCriteria());
            score.setScore(scoreDTO.getScore());
            score.setReview(review);
            return score;
        }).collect(Collectors.toList());


        review.setReviewScores(scores);


        return convertToDTO(reviewRepository.save(review));
    }


    public void deleteReview(Long id) {

        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("Review with ID " + id + " does not exist.");
        }
        reviewRepository.deleteById(id);
    }

    public Review updateReview(Long id, Review updatedReview) {

        Optional<Review> existingReview = reviewRepository.findById(id);
        if (existingReview.isPresent()) {
            Review review = existingReview.get();


            review.setComment(updatedReview.getComment());
            review.setReviewDate(updatedReview.getReviewDate());
            review.setReviewee(updatedReview.getReviewee());
            review.setReviewer(updatedReview.getReviewer());


            return reviewRepository.save(review);
        } else {

            throw new ReviewNotFoundException("Review not found with id: " + id);
        }
    }


    public List<ReviewDTO> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public ReviewDTO convertToDTO(Review review) {
        List<ReviewScoreDTO> scoreDTOs = review.getReviewScores().stream()
                .map(score -> new ReviewScoreDTO(score.getCriteria(), score.getScore()))
                .toList();

        return new ReviewDTO(
                review.getId(),
                review.getComment(),
                review.getReviewDate(),
                review.getReviewer().getId(),
                review.getReviewee().getId(),

                review.getInternship().getId(),
                scoreDTOs
        );
    }

    public Optional<ReviewDTO> getReviewDTOById(Long id) {
        return reviewRepository.findById(id)
                .map(this::convertToDTO);
    }


//reported reviews


    // Report a review
    public ReportedReview reportReview(Long reviewId, User reporter, String reason) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        ReportedReview reportedReview = new ReportedReview();
        reportedReview.setReview(review);
        reportedReview.setReportedBy(reporter);
        reportedReview.setReason(ReportedReview.ReportReason.valueOf(reason));
        reportedReview.setStatus(ReportedReview.Status.PENDING);

        return reportedReviewRepository.save(reportedReview);
    }

    // Get all reported reviews by status (used by admin)
    public List<ReportedReview> getAllReportedReviews(ReportedReview.Status status) {
        return reportedReviewRepository.findAllByStatus(status); // Custom query to find by status
    }

    // Admin action on a reported review
    public ReportedReview takeAction(UUID reportId, ReportedReview.Status status, String adminAction) {
        ReportedReview report = reportedReviewRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(status);
        report.setAdminAction(adminAction);
        return reportedReviewRepository.save(report);
    }

    // Delete a reported review
    public void deleteReportedReview(UUID reportId) {
        reportedReviewRepository.deleteById(reportId);
    }



}
