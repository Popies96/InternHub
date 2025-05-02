package com.example.backend.services.internshipService;

import com.example.backend.dto.InternshipDto;
import com.example.backend.dto.InternshipResponse;
import com.example.backend.entity.Internship;

import java.util.List;

public interface InternshipService {
    List<Internship> retrieveInternships();
    Internship updateInternship(Internship internship);
    Internship addInternship(Internship internship);
    Internship retrieveInternship(long idInternship);
    void removeInternship(long idInternship);

    List<Internship> getInternshipsByStudent(Long studentId);
    List<InternshipResponse> getInternshipsByEnterprise(Long enterpriseId);

    Internship applyForInternship(Long internshipId, Long studentId);

    Internship createInternship(InternshipDto internshipDto, String username);

    List<Internship> getInternshipsByTitle(String title);

    List<Internship> getInternshipsByCompanyName(String companyName);
     List<Internship> getInternshipsByEnterpriseT(Long enterpriseId) ;


    }
