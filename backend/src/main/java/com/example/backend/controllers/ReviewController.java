package com.example.backend.controllers;

import com.example.backend.dto.ReviewDTO;
import com.example.backend.entity.*;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.RecommandationRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.services.ReviewService.GeminiService;
import com.example.backend.services.ReviewService.ReviewService;
import com.example.backend.services.authSerivce.UserServiceImpl;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private RecommandationRepository recommendationRepository;

    @Autowired
    private InternshipRepository internshipRepository;
    @Autowired
    private GeminiService geminiService;
    public ReviewController(ReviewRepository reviewRepository, GeminiService geminiService) {
        this.reviewRepository = reviewRepository;
        this.geminiService = geminiService;
    }

    //ok
 /*  @PostMapping
   public Review createReview(@RequestBody Review review) {
        return reviewService.createReview(review);
    }*/

@Autowired
    private  UserServiceImpl userServiceImpl; // <-- inject this

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO reviewDTO) {
        User reviewer = userServiceImpl.getAuthenticatedUser(); // <-- get the logged-in user
        ReviewDTO createdReview = reviewService.createReviewFromDTO(reviewDTO, reviewer);
        return ResponseEntity.ok(createdReview);
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
    public Review updateReview(@PathVariable Long id, @RequestBody @P("review") Review review) {
        return reviewService.updateReview(id, review);
    }


    @GetMapping("/get_reviews")
    public List<ReviewDTO> getAllReviews() {
        return reviewService.getAllReviews();
    }


//Ai

@PostMapping("/recommendation/{internshipId}")
@PreAuthorize("hasRole('STUDENT') or hasRole('ENTERPRISE') or hasRole('ADMIN')")

public ResponseEntity<String> getRecommendation(
        @PathVariable Long internshipId,
        @RequestParam(defaultValue = "false") boolean regenerate) {

    Internship internship = internshipRepository.findById(internshipId)
            .orElseThrow(() -> new RuntimeException("Internship not found"));

    Optional<Recommendation> existing = recommendationRepository.findByInternship(internship);

    // Return existing recommendation unless regenerate is requested
    if (existing.isPresent() && !regenerate) {
        return ResponseEntity.ok(existing.get().getContent());
    }

    List<Review> reviews = reviewRepository.findByInternshipId(internshipId);

    // Get only non-empty comments
    List<String> reviewComments = reviews.stream()
            .map(Review::getComment)
            .filter(comment -> comment != null && !comment.trim().isEmpty())
            .collect(Collectors.toList());

    String enterpriseName = internship.getEnterprise().getNom();

    // Simple and direct prompt
    StringBuilder prompt = new StringBuilder();
    prompt.append("Only consider comprehensible and useful comments to generate a recommendation like a report for the enterprise and make it neat without special caracters like * or # ");
    prompt.append(enterpriseName).append(".\n");
    prompt.append("Reviews:\n");
    for (String comment : reviewComments) {
        prompt.append("- ").append(comment).append("\n");
    }

    String result = geminiService.generateRecommendation(prompt.toString());

    // Save new or update existing recommendation
    Recommendation recommendation = existing.orElse(
            Recommendation.builder()
                    .internship(internship)
                    .build()
    );

    recommendation.setContent(result);
    recommendation.setCreatedAt(LocalDateTime.now());
    recommendationRepository.save(recommendation);

    return ResponseEntity.ok(result);
}



}
