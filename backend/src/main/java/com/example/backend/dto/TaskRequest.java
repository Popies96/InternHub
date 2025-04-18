package com.example.backend.dto;

import com.example.backend.entity.Task.TaskStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskRequest {


    private String title;
    private String description;
    private LocalDate deadline;
    private TaskStatus status;
    private Long internshipId;
    private Long studentId;

    // Constructors
    public TaskRequest() {
    }

    public TaskRequest(String title, String description, LocalDate deadline, TaskStatus status, Long internshipId, Long studentId) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.status = status;
        this.internshipId = internshipId;
        this.studentId = studentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public Long getInternshipId() {
        return internshipId;
    }

    public void setInternshipId(Long internshipId) {
        this.internshipId = internshipId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}