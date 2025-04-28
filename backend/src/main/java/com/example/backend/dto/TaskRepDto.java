package com.example.backend.dto;

import com.example.backend.entity.Student;
import com.example.backend.entity.Task;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

public class TaskRepDto {

    private Long id;
    private Task task;
    private String content;
    private String fileName;
    private String fileType;
    private Student student;
}
