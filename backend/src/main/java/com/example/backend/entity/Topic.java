package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String content;
    @Enumerated(EnumType.STRING)
    private  TopicCategory category ;
    @ElementCollection
    private List<String> tags;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private LocalDateTime dateCreated;
    private LocalDateTime updatedAt;
    private String imagePath;
    private int views;


}
