package com.example.backend.services.ReviewService;

import com.example.backend.dto.ReviewDTO;
import com.example.backend.dto.ReviewScoreDTO;
import com.example.backend.entity.Review;
import com.example.backend.entity.ReviewScore;
import com.example.backend.repository.EnterpriseRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.ReviewScoreRepository;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service

public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewScoreRepository reviewScoreRepository;
    private final EnterpriseRepository enterpriseRepository;

    public ReviewService(ReviewRepository reviewRepository, ReviewScoreRepository reviewScoreRepository, EnterpriseRepository enterpriseRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewScoreRepository = reviewScoreRepository;
        this.enterpriseRepository = enterpriseRepository;
    }

    public Review createReview(Review review) {
        // Optional: validate that enterprise exists if needed
    /*
    if (review.getEnterprise() == null || !enterpriseRepository.existsById(review.getEnterprise().getId())) {
        throw new IllegalArgumentException("Enterprise with ID " +
            (review.getEnterprise() != null ? review.getEnterprise().getId() : "null") +
            " does not exist.");
    }
    */

        // Ensure each ReviewScore has the review reference set
        for (ReviewScore reviewScore : review.getReviewScores()) {
            reviewScore.setReview(review);
        }

        // Saving review will also save reviewScores because of CascadeType.ALL
        return reviewRepository.save(review);
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






//AI

    public String generateRecommendationSummary() {
        List<Review> allReviews = reviewRepository.findAll();
        String fullText = allReviews.stream()
                .map(Review::getComment)
                .collect(Collectors.joining(". "));

        return callHuggingFaceAPI(fullText);
    }
    private String callHuggingFaceAPI(String inputText) {
        try {
            String apiUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
            String apiToken = "Bearer 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";

            HttpClient client = HttpClient.newHttpClient();
            String requestBody = "{\"inputs\": \"" + inputText.replace("\"", "\\\"") + "\"}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Authorization", apiToken)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return response.body();
            } else {
                return "Error: " + response.statusCode() + " - " + response.body();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling AI service: " + e.getMessage();
        }
    }



}
