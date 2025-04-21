package com.example.backend.services.ai.InternshipAiService;

import com.example.backend.dto.InternshipAiDto;
import com.example.backend.entity.InternshipAi;
import com.example.backend.entity.Student;
import com.example.backend.entity.Task;

import java.util.List;

public interface InternshipAiService {
    List<InternshipAiDto> retrieveInternshipAi(Student student);
    InternshipAiDto updateInternshipAi(InternshipAi internshipAi,Long idInternship);
    InternshipAi addInternshipAi(InternshipAi internshipAi);
    InternshipAiDto retrieveInternshipAiById(long idInternship);
    void removeInternshipAi(long internshipId);
}
