package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "enterprises")
@PrimaryKeyJoinColumn(name = "id") // Links with User table
public class Enterprise extends User {

    private String companyName;
    private String companyAddress;

    @OneToMany(mappedBy = "enterprise", cascade = CascadeType.ALL)
    private List<Internship> createdInternships; // Internships created by enterprise

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

    public List<Internship> getCreatedInternships() {
        return createdInternships;
    }

    public void setCreatedInternships(List<Internship> createdInternships) {
        this.createdInternships = createdInternships;
    }
}

