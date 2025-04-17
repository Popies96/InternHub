package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "review_scores")
@Getter
@Setter
@NoArgsConstructor
public class ReviewScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "review_id")
    private Review review;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatingCriteria criteria;



    @Column(nullable = false)
    private int score; // Value between 1 and 5

    public ReviewScore(Review review, RatingCriteria criteria, int score) {
        this.review = review;
        this.criteria = criteria;
        this.score = score;
    }
 /* @PrePersist
    public void setDefaultCriteriaIfNull() {
        if (this.criteria == null) {
            this.criteria = "Default Criteria";  // Default value
        }
    }*/

}
