package com.example.backend.controllers;

import com.example.backend.dto.ReviewDTO;
import com.example.backend.entity.Review;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.services.ReviewService.ReviewService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    private ReviewRepository reviewRepository;
//ok
    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }
//ok
@GetMapping("/{id}")
public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
    return reviewService.getReviewDTOById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}



//ok
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
    //ok
    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review review) {
        return reviewService.updateReview(id, review);
    }
  //  @GetMapping
/*  public List<Review> getReviews() {
        return reviewService.getAllReviews(); // Returns all reviews
    } */

    @GetMapping("/get_reviews")
    public List<ReviewDTO> getAllReviews() {
        return reviewService.getAllReviews();
    }
    // does not work !!!!
    @GetMapping("/reviewee/{revieweeId}")
    public List<Review> getReviewsByReviewee(@PathVariable Long revieweeId) {
        return reviewService.getReviewsByReviewee(revieweeId);
    }

    @GetMapping("/reviewer/{reviewerId}")
    public List<Review> getReviewsByReviewer(@PathVariable Long reviewerId) {
        return reviewService.getReviewsByReviewer(reviewerId);
    }

//Ai

@GetMapping("/ai-recommendation")
public String getRecommendation() {
    return reviewService.generateRecommendationSummary();
}


}
