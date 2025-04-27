package com.example.backend.dto.certifcate;

import com.example.backend.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter

public class StudentDTO {
    private Long id;
    private String prenom;
    private String nom;
    private String email;
    private String school;
    private Long cin;
    public static StudentDTO fromEntity(Student student) {
        return new StudentDTO(
                student.getId(),
                student.getPrenom(),
                student.getNom(),
                student.getEmail(),
                student.getSchool(),
                student.getCin()
        );
    }

    public StudentDTO(Long id, String prenom, String nom, String email, String school, Long cin) {
        this.id = id;
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
        this.school = school;
        this.cin = cin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

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
}
