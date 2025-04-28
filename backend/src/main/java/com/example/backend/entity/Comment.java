package com.example.backend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Lob
    private String comment;

    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topic topic;
    private LocalDateTime dateCreated;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", comment='" + comment + '\'' +
                ", topic=" + topic +
                ", user=" + user +
                '}';
    }
}
