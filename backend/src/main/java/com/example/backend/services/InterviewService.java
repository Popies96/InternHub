package com.example.backend.services;

import com.example.backend.dto.InterviewDto;
import com.example.backend.entity.Application;
import com.example.backend.entity.Interview;
import com.example.backend.entity.InterviewMode;
import com.example.backend.entity.InterviewStatus;
import com.example.backend.repository.ApplicationRepository;
import com.example.backend.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Interview create(InterviewDto dto) {
        Interview interview = new Interview();
        interview.setApplicationId(dto.getApplicationId());
        interview.setScheduledDate(dto.getScheduledDate());
        interview.setLocation(dto.getLocation());
        interview.setMode(dto.getMode());
        interview.setStatus(dto.getStatus());
        interview.setNotes(dto.getNotes());

        if (dto.getMode() == InterviewMode.ONLINE) {
            String link = "https://meet.jit.si/interview-" + UUID.randomUUID().toString().substring(0, 8);
            interview.setMeetingLink(link);
        }

        return interviewRepository.save(interview);
    }
    public List<Interview> getAll() {
        return interviewRepository.findAll();
    }

    public Optional<Interview> getById(Long id) {
        return interviewRepository.findById(id);
    }

    public void delete(Long id) {
        interviewRepository.deleteById(id);
    }

    public List<Interview> getByApplicationId(Long appId) {
        return interviewRepository.findByApplicationId(appId);
    }
    public boolean cancelInterview(Long id) {
        Optional<Interview> optionalInterview = interviewRepository.findById(id);
        if (optionalInterview.isPresent()) {
            Interview interview = optionalInterview.get();
            interview.setStatus(InterviewStatus.valueOf("CANCELED"));
            interviewRepository.save(interview);
            return true;
        }
        return false;
    }
}
