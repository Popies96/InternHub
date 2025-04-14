package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class InternshipAi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private String technology;
    private String companyName;
    private String category;
    private boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
