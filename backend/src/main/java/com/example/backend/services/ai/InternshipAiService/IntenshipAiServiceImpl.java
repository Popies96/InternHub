package com.example.backend.services.ai.InternshipAiService;

import com.example.backend.dto.InternshipAiDto;
import com.example.backend.dto.TaskAiDto;
import com.example.backend.entity.InternshipAi;
import com.example.backend.entity.Student;
import com.example.backend.entity.TaskAi;
import com.example.backend.entity.TaskStatus;
import com.example.backend.repository.InternshipAiRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.services.ai.TaskAiService.TaskAiService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IntenshipAiServiceImpl implements InternshipAiService{

private final InternshipAiRepository internshipRepository;
private final TaskAiService taskAiService;

@Autowired
    public IntenshipAiServiceImpl(InternshipAiRepository internshipRepository, StudentRepository studentRepository, TaskAiService taskAiService) {
        this.internshipRepository = internshipRepository;
    this.taskAiService = taskAiService;
    }

    @Override
    public List<InternshipAiDto> retrieveInternshipAi(Student student) {
    List<InternshipAi> internshipAi = student.getInternshipAiList();

        return internshipAi.stream().map(internship -> {
            InternshipAiDto dto = new InternshipAiDto();
            dto.setId(internship.getId());
            dto.setTitle(internship.getTitle());
            dto.setDescription(internship.getDescription());
            dto.setStartDate(internship.getStartDate());
            dto.setEndDate(internship.getEndDate());
            dto.setTechnology(internship.getTechnology());
            dto.setCompanyName(internship.getCompanyName());
            dto.setCategory(internship.getCategory());
            dto.setActive(internship.isActive());
            dto.setStudentId(internship.getStudent() != null ? internship.getStudent().getId() : null);

            if (internship.getTaskAiList() != null) {
                List<TaskAiDto> taskDtos = internship.getTaskAiList().stream().map(task -> {
                    TaskAiDto taskDto = new TaskAiDto();
                    taskDto.setId(task.getId());
                    taskDto.setTitle(task.getTitle());
                    taskDto.setDescription(task.getDescription());
                    taskDto.setResponseType(task.getResponseType());
                    taskDto.setStatus(task.getStatus().name());
                    return taskDto;
                }).toList();
                dto.setTaskAiList(taskDtos);
            }

            return dto;
        }).toList();

    }

    @Override
    public InternshipAiDto updateInternshipAi(InternshipAi internshipAi, Long idInternship) {
        InternshipAi internship = internshipRepository.findById(idInternship)
                .orElseThrow(() -> new RuntimeException("Internship not found with id " + idInternship));

        internship.setTitle(internshipAi.getTitle());
        internship.setDescription(internshipAi.getDescription());
        internship.setStartDate(internshipAi.getStartDate());
        internship.setEndDate(internshipAi.getEndDate());
        internship.setTechnology(internshipAi.getTechnology());
        internship.setCompanyName(internshipAi.getCompanyName());
        internship.setCategory(internshipAi.getCategory());
internship.setActive(internshipAi.isActive());
        // Tasks update
        if (internshipAi.getTaskAiList() != null) {
            List<TaskAi> taskList = internshipAi.getTaskAiList().stream().map(taskAi -> {
                TaskAi task = new TaskAi();
                task.setId(taskAi.getId()); // If ID is null, it'll be treated as new
                task.setTitle(taskAi.getTitle());
                task.setDescription(taskAi.getDescription());
                task.setResponseType(taskAi.getResponseType());
                task.setStatus(TaskStatus.valueOf(taskAi.getStatus().toString()));
                task.setInternshipAi(internship);
                return task;
            }).collect(Collectors.toList());
            internship.setTaskAiList(taskList);
        }
        InternshipAi saved = internshipRepository.save(internship);
    return  mapToDto(saved);
    }

    @Override
    public InternshipAi addInternshipAi(InternshipAi internshipAi) {
        if (internshipAi.getTaskAiList() != null) {
            for (TaskAi task : internshipAi.getTaskAiList()) {
                task.setInternshipAi(internshipAi);
                if (task.getStatus() == null) {
                    task.setStatus(TaskStatus.PENDING);
                }
            }
        }
    return internshipRepository.save(internshipAi);
    }

    @Override
    public InternshipAiDto retrieveInternshipAiById(long idInternship) {
        InternshipAi internshipAi = internshipRepository.findById(idInternship)
                .orElseThrow(() -> new EntityNotFoundException("InternshipAi with ID " + idInternship + " not found"));
        return mapToDto(internshipAi);
    }

    @Override
    public void removeInternshipAi(long internshipId) {
        if (!internshipRepository.existsById(internshipId)) {
            throw new EntityNotFoundException("Internship with ID " + internshipId + " not found.");
        }
        internshipRepository.deleteById(internshipId);

    }

    private InternshipAiDto mapToDto(InternshipAi internship) {
        InternshipAiDto dto = new InternshipAiDto();
        dto.setId(internship.getId());
        dto.setTitle(internship.getTitle());
        dto.setDescription(internship.getDescription());
        dto.setStartDate(internship.getStartDate());
        dto.setEndDate(internship.getEndDate());
        dto.setTechnology(internship.getTechnology());
        dto.setCompanyName(internship.getCompanyName());
        dto.setCategory(internship.getCategory());
        dto.setStudentId(internship.getStudent() != null ? internship.getStudent().getId() : null);
dto.setActive(internship.isActive());
        if (internship.getTaskAiList() != null) {
            List<TaskAiDto> taskDtos = internship.getTaskAiList().stream().map(task -> {
                TaskAiDto taskDto = new TaskAiDto();
                taskDto.setId(task.getId());
                taskDto.setTitle(task.getTitle());
                taskDto.setDescription(task.getDescription());
                taskDto.setResponseType(task.getResponseType());
                taskDto.setStatus(task.getStatus().name());
                return taskDto;
            }).collect(Collectors.toList());
            dto.setTaskAiList(taskDtos);
        }

        return dto;
    }
}
