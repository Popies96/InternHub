package com.example.backend.dto;

import com.example.backend.entity.Enterprise;
import lombok.Getter;
import lombok.Setter;

import java.util.Optional;


public class EnterpriseDTO {
    private Long id;
    private String companyName;
    private String companyAddress;
    private String email;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
