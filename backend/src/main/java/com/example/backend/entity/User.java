package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Inheritance(strategy = InheritanceType.JOINED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private  String password;
    private  String email;
    @Enumerated(EnumType.STRING)
    private UserRole role;



    @OneToMany(mappedBy = "enterprise", cascade = CascadeType.ALL)
    private List<Internship> createdInternships;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private Set<Internship> appliedInternships;

    public Long getIdEtudiant() {
        return id;
    }

    public void setIdEtudiant(Long idEtudiant) {
        this.id = idEtudiant;
    }

    public String getNomEt() {
        return nom;
    }

    public void setNomEt(String nomEt) {
        this.nom = nomEt;
    }

    public String getPrenomEt() {
        return prenom;
    }

    public void setPrenomEt(String prenomEt) {
        this.prenom = prenomEt;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }



    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
