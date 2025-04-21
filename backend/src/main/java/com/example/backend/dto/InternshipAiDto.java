package com.example.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class InternshipAiDto {

        private Long id;
        private String title;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String technology;
        private String companyName;
        private String category;
        private Long studentId;
    private boolean isActive ;
        private List<TaskAiDto> taskAiList;

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getTechnology() {
        return technology;
    }

    public void setTechnology(String technology) {
        this.technology = technology;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public List<TaskAiDto> getTaskAiList() {
        return taskAiList;
    }

    public void setTaskAiList(List<TaskAiDto> taskAiList) {
        this.taskAiList = taskAiList;
    }
}
