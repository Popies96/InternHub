package com.example.backend.controllers;

import com.example.backend.dto.ReportDto;
import com.example.backend.dto.ReportReviewRequest;
import com.example.backend.dto.ReviewDTO;
import com.example.backend.dto.TaskAiDto;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import com.example.backend.services.ReviewService.GeminiService;
import com.example.backend.services.ReviewService.ReviewService;
import com.example.backend.services.authSerivce.UserServiceImpl;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
    private UserRepository userRepository;

    @Autowired
    private InternshipRepository internshipRepository;
    @Autowired
    private GeminiService geminiService;
    public ReviewController(ReviewRepository reviewRepository, GeminiService geminiService) {
        this.reviewRepository = reviewRepository;
        this.geminiService = geminiService;
    }


@Autowired
    private  UserServiceImpl userServiceImpl; // <-- inject this
    @PreAuthorize(" hasRole('STUDENT')")
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
@PreAuthorize(" hasRole('STUDENT') or hasRole('ADMIN')")

@DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
    //ok
    @PreAuthorize(" hasRole('STUDENT')")

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody @P("review") Review review) {
        return ResponseEntity.ok(reviewService.updateReview(id, review));
    }


    @GetMapping("/get_reviews")
    public List<ReviewDTO> getAllReviews() {
        return reviewService.getAllReviews();
    }


//Ai

@PostMapping("/recommendation/{internshipId}")
@PreAuthorize(" hasRole('ENTERPRISE')")

public ResponseEntity<String> getRecommendation(
        @PathVariable Long internshipId,
        @RequestParam(defaultValue = "false") boolean regenerate) {

    Internship internship = internshipRepository.findById(internshipId)
            .orElseThrow(() -> new RuntimeException("Internship not found"));

    Optional<Recommendation> existing = recommendationRepository.findByInternship(internship);


    if (existing.isPresent() && !regenerate) {
        return ResponseEntity.ok(existing.get().getContent());
    }

    List<Review> reviews = reviewRepository.findByInternshipId(internshipId);

    List<String> reviewComments = reviews.stream()
            .map(Review::getComment)
            .filter(comment -> comment != null && !comment.trim().isEmpty())
            .collect(Collectors.toList());

    String enterpriseName = internship.getEnterprise().getNom();

    StringBuilder prompt = new StringBuilder();
    prompt.append("Only consider comprehensible and useful comments to generate a recommendation like a report for the enterprise and make it neat without special caracters like * or # ");
    prompt.append(enterpriseName).append(".\n");
    prompt.append("Reviews:\n");
    for (String comment : reviewComments) {
        prompt.append("- ").append(comment).append("\n");
    }

    String result = geminiService.generateRecommendation(prompt.toString());

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

//report a review
//report a review
@PostMapping("/report")
@PreAuthorize("hasRole('ENTERPRISE')")
public ReportedReview reportReview(@RequestBody ReportReviewRequest request) {
    // Get the current security user
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    String email;
    if (principal instanceof org.springframework.security.core.userdetails.User) {
        email = ((org.springframework.security.core.userdetails.User) principal).getUsername();
    } else {
        email = principal.toString();
    }

    // Fetch your real User entity using the email
    User reporter = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

    return reviewService.reportReview(
            request.getReviewId(), reporter, request.getReason()
    );
}
    @GetMapping("/status")
    public List<ReportDto> getReportedReviewsByStatus() {
        List<ReportedReview>  reportedReview = reviewService.getAllReportedReviews();

        return reportedReview.stream().map(report -> {
            ReportDto dto = new ReportDto();
            ReviewDTO reviewDTO = new ReviewDTO();
            dto.setId(report.getId());
            dto.setAdminAction(report.getAdminAction());
            dto.setReason(report.getReason());
            dto.setReviewId(report.getReview().getId());
            dto.setReportedById(report.getReportedBy().getId());
            dto.setStatus(report.getStatus());
            return dto;
        }).toList();
    }

    @PutMapping("/action/{reportId}")
    public ReportedReview takeActionOnReport(@PathVariable UUID reportId,
                                             @RequestParam ReportedReview.Status status,
                                             @RequestParam String adminAction) {
        return reviewService.takeAction(reportId, status, adminAction);
    }

    @DeleteMapping("/report/{reportId}")
    public void deleteReportedReview(@PathVariable UUID reportId) {
        reviewService.deleteReportedReview(reportId);
    }

}
