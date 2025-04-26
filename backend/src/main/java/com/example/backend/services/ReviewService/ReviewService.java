package com.example.backend.services.ReviewService;

import com.example.backend.dto.ReviewDTO;
import com.example.backend.dto.ReviewScoreDTO;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewScoreRepository reviewScoreRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;





    public ReviewDTO createReviewFromDTO(ReviewDTO dto, User reviewer) {
        // Fetch internship based on provided internshipId
        Internship internship = internshipRepository.findById(dto.getInternshipId())
                .orElseThrow(() -> new IllegalArgumentException("Internship not found"));

        // Get the Enterprise object from the internship
        Enterprise reviewee = (Enterprise) internship.getEnterprise();  // reviewee is now of type Enterprise, not Student

        // Create a new Review instance
        Review review = new Review();
        review.setComment(dto.getComment());
        review.setReviewDate(LocalDateTime.now());
        review.setReviewer(reviewer);

        // Set the reviewee as Enterprise (reviewee is expected to be an Enterprise, not Student)
        review.setReviewee(reviewee);  // Setting reviewee as Enterprise correctly

        // Set the internship
        review.setInternship(internship);

        // Set the enterprise from internship (internship already has the Enterprise object)
        review.setEnterprise(reviewee); // Setting Enterprise correctly

        // Map ReviewScores from DTO to Review
        List<ReviewScore> scores = dto.getScores().stream().map(scoreDTO -> {
            ReviewScore score = new ReviewScore();
            score.setCriteria(scoreDTO.getCriteria());
            score.setScore(scoreDTO.getScore());
            score.setReview(review);
            return score;
        }).collect(Collectors.toList());

        // Set review scores and save the review
        review.setReviewScores(scores);

        // Save the review and convert to DTO
        return convertToDTO(reviewRepository.save(review));
    }





    public List<Review> getReviewsByReviewee(Long revieweeId) {
        // Fetch reviews based on reviewee ID
        return reviewRepository.findByRevieweeId(revieweeId);
    }

    public List<Review> getReviewsByReviewer(Long reviewerId) {
        // Fetch reviews based on reviewer ID
        return reviewRepository.findByReviewerId(reviewerId);
    }

 /*   public Optional<Review> getReviewById(Long id) {
        // Return review if found, otherwise throw an exception
        Optional<Review> review = reviewRepository.findById(id);
        if (review.isEmpty()) {
            throw new IllegalArgumentException("Review with ID " + id + " not found.");
        }
        return review;
    }*/

    public void deleteReview(Long id) {
        // Check if review exists before deleting
        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("Review with ID " + id + " does not exist.");
        }
        reviewRepository.deleteById(id);
    }

    public Review updateReview(Long id, Review updatedReview) {
        // Check if the review exists
        Optional<Review> existingReview = reviewRepository.findById(id);
        if (existingReview.isPresent()) {
            Review review = existingReview.get();

            // Update the review details
            review.setComment(updatedReview.getComment());
            review.setReviewDate(updatedReview.getReviewDate());
            review.setReviewee(updatedReview.getReviewee());
            review.setReviewer(updatedReview.getReviewer());

            // Save and return the updated review
            return reviewRepository.save(review);
        } else {
            // If review doesn't exist, throw an exception or return null
            throw new ReviewNotFoundException("Review not found with id: " + id);
        }
    }


  /*  public List<Review> getAllReviews() {
        return reviewRepository.findAll(); // Returns all reviews
    }
*/
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







}
