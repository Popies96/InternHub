package com.example.backend.dto.certifcate;

import com.example.backend.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
}
