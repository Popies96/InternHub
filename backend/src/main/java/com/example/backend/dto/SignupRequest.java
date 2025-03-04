package com.example.backend.dto;

import com.example.backend.entity.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String nom;
    private String prenom;
    private  String password;
    private  String email;
    private String role;
    private String school;  // Only needed for Student
    private Long cin;  // Only needed for Student
    private String companyName;  // Only needed for Enterprise
    private String companyAddress;

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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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




}
