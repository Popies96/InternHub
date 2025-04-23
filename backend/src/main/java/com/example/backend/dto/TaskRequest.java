package com.example.backend.dto;
import com.example.backend.entity.TaskPriority;
import com.example.backend.entity.TaskType;
import lombok.*;
import com.example.backend.entity.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {
    private String title;
    private String description;
    private LocalDateTime deadline;  // Changed to LocalDate
    private TaskStatus status;
    private String type;
    private TaskPriority priority;
    private Long internshipId;
    private Long studentId;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        if (type != null && !List.of("PDF", "CODE", "TEXT").contains(type.toUpperCase())) {
            throw new IllegalArgumentException("Invalid task type");
        }
        this.type = type != null ? type.toUpperCase() : "TEXT";
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
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

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
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