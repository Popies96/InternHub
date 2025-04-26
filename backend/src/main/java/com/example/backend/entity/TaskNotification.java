package com.example.backend.entity;

import com.example.backend.dto.UserRequest;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class TaskNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User student;

    private String message;
    private LocalDateTime createdAt;

    @ManyToOne
    private Task task;

    // Constructors
    public TaskNotification() {}

    public TaskNotification(User student, Task task) {
        this.student = student;
        this.task = task;
        this.message = "New task: " + task.getTitle();
        this.createdAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public User getStudent() { return student; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Task getTask() { return task; }
}