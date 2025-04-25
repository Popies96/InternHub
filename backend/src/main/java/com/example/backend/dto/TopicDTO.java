package com.example.backend.dto;

import com.example.backend.entity.TopicCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopicDTO {

    private int id;
    private String title;
    private String content;
    private TopicCategory category;
    private List<String> tags;
    private Long userId; // Only expose the user
    private String prenom; // <-- ADD THIS
    private LocalDateTime dateCreated;
    private LocalDateTime updatedAt;
    private String imagePath;
    private int views;

}
