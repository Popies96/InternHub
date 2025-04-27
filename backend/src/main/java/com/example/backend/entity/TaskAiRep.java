package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class TaskAiRep {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "task_id")
    @JsonBackReference
    private TaskAi taskAi;

    // For all types - stores either text content, code, or file path
    @Column(columnDefinition = "TEXT")
    private String content;

    // Only for PDF/files - stores the file name
    private String fileName;

    // Only for PDF/files - stores the file type
    private String fileType;

    private String feedback;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TaskAi getTaskAi() {
        return taskAi;
    }

    public void setTaskAi(TaskAi taskAi) {
        this.taskAi = taskAi;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
