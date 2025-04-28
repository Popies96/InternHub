package com.example.backend.dto;

import com.example.backend.entity.Topic;
import com.example.backend.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDTO {

    private int id;
    private String comment;
    private long userId;
    private long topicId;
    private LocalDateTime dateCreated;
    private String prenom;
    private String nom;



}

