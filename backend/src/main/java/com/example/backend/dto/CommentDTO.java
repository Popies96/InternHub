package com.example.backend.dto;

import com.example.backend.entity.Topic;
import com.example.backend.entity.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
public class CommentDTO {

    private int id;
    private String comment;
    private User user;



}

