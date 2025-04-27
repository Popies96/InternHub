package com.example.backend.dto;

import com.example.backend.entity.RatingCriteria;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewScoreDTO {
    private RatingCriteria criteria;
    private int score;
}
