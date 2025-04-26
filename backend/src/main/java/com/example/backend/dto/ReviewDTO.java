package com.example.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long id;
    private String comment;
    private LocalDateTime reviewDate;
    private Long reviewerId;
    private Long revieweeId;
    private Long internshipId;
    private List<ReviewScoreDTO> scores;

}
