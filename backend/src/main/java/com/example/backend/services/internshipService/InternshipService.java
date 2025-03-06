package com.example.backend.services.internshipService;

import com.example.backend.entity.Internship;

import java.util.List;

public interface InternshipService {
    List<Internship> retrieveInternships();
    Internship updateInternship(Internship internship);
    Internship addInternship(Internship internship);
    Internship retrieveInternship(long idInternship);
    void removeInternship(long idInternship);

    List<Internship> getInternshipsByStudent(Long studentId);
    List<Internship> getInternshipsByEnterprise(Long enterpriseId);

    Internship applyForInternship(Long internshipId, Long studentId);
}
