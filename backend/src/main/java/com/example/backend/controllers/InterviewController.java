package com.example.backend.controllers;
import com.example.backend.dto.InterviewDto;
import com.example.backend.entity.Interview;
import com.example.backend.services.InterviewService;
import org.eclipse.angus.mail.iap.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping
    public ResponseEntity<Interview> createInterview(@RequestBody InterviewDto dto) {
        Interview interview = interviewService.create(dto);
        return ResponseEntity.ok(interview);
    }

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterviewById(@PathVariable Long id) {
        Optional<Interview> interview = interviewService.getById(id);
        return interview.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        interviewService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test endpoint is working!");
    }
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelInterview(@PathVariable Long id) {
        boolean canceled = interviewService.cancelInterview(id);
        if (canceled) {
            return ResponseEntity.ok("Interview canceled successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
