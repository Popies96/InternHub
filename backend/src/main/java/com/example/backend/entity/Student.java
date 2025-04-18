package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "id") // Links with User table
public class Student extends User {

    private String school;

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public Long getCin() {
        return cin;
    }

    public void setCin(Long cin) {
        this.cin = cin;
    }

    public List<Internship> getInternships() {
        return internships;
    }

    public void setInternships(List<Internship> internships) {
        this.internships = internships;
    }

    private Long cin; // Unique identifier for students

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Internship> internships; // Internships assigned to student

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Task> tasks;
}

