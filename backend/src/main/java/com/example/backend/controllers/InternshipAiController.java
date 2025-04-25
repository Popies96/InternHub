package com.example.backend.controllers;

import com.example.backend.dto.InternshipAiDto;
import com.example.backend.dto.TaskAiDto;
import com.example.backend.entity.*;
import com.example.backend.repository.TaskAiRepository;
import com.example.backend.services.ai.InternshipAiService.InternshipAiService;
import com.example.backend.services.ai.TaskAiService.TaskAiServiceImpl;
import com.example.backend.services.authSerivce.UserServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/internshipAi")
public class InternshipAiController {
    private final InternshipAiService internshipAiService;
    private final UserServiceImpl userService;
    private final TaskAiServiceImpl taskAiService;

    @Autowired
    public InternshipAiController(InternshipAiService internshipAiService, UserServiceImpl userService, TaskAiRepository taskAiRepository, TaskAiServiceImpl taskAiService) {
        this.internshipAiService = internshipAiService;
        this.userService = userService;
        this.taskAiService = taskAiService;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<InternshipAiDto> createInternship(@RequestBody InternshipAi internshipAi) {
        User authenticatedStudent = userService.getAuthenticatedUser();

        if (!(authenticatedStudent instanceof Student)) {
            throw new RuntimeException("Only students can create ai internships.");
        }

        internshipAi.setStudent((Student) authenticatedStudent);
        internshipAiService.addInternshipAi(internshipAi);

        InternshipAiDto internshipAiDto = new InternshipAiDto();
        internshipAiDto.setStudentId(internshipAi.getStudent().getId());
        internshipAiDto.setActive(internshipAi.isActive());
        System.out.println(internshipAi.isActive());
        System.out.println(internshipAiDto.isActive());
        BeanUtils.copyProperties(internshipAi,internshipAiDto );

        if (internshipAi.getTaskAiList() != null) {
            List<TaskAiDto> taskDtos = internshipAi.getTaskAiList().stream().map(task -> {
                TaskAiDto dto = new TaskAiDto();
                dto.setId(task.getId());
                dto.setTitle(task.getTitle());
                dto.setDescription(task.getDescription());
                dto.setResponseType(task.getResponseType());
                dto.setStatus(task.getStatus().name());
                return dto;
            }).toList();
            internshipAiDto.setTaskAiList(taskDtos);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(internshipAiDto);
    }
    @GetMapping("/list")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<InternshipAiDto>> retriveInternships() {
        Student student =(Student) userService.getAuthenticatedUser();
        List<InternshipAiDto> internships = internshipAiService.retrieveInternshipAi(student);
        return ResponseEntity.ok(internships);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<InternshipAiDto> getInternshipById(@PathVariable Long id) {
        InternshipAiDto internship = internshipAiService.retrieveInternshipAiById(id);
        return ResponseEntity.ok(internship);
    }

    @GetMapping("task/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TaskAiDto> getTask(@PathVariable Long id) {
        TaskAi taskAi = taskAiService.retrieveTaskAi(id);
        TaskAiDto taskAiDto = new TaskAiDto();
        taskAiDto.setId(taskAi.getId());
        taskAiDto.setDescription(taskAi.getDescription());
        taskAiDto.setResponseType(taskAi.getResponseType());
        taskAiDto.setStatus(taskAi.getStatus().toString());
        taskAiDto.setTitle(taskAi.getTitle());
        return ResponseEntity.ok(taskAiDto);
    }
    @PutMapping("task/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TaskAiDto> updateTask(@PathVariable Long id,@RequestBody TaskAi taskAi) {
        TaskAi task = taskAiService.updateTaskAi(taskAi,id);
        TaskAiDto taskAiDto = new TaskAiDto();
        taskAiDto.setId(task.getId());
        taskAiDto.setDescription(task.getDescription());
        taskAiDto.setResponseType(task.getResponseType());
        taskAiDto.setStatus(task.getStatus().toString());
        taskAiDto.setTitle(task.getTitle());
        return ResponseEntity.ok(taskAiDto);
    }


    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<InternshipAiDto>updateInternship(   @PathVariable Long id,
                                                              @RequestBody InternshipAi internshipAi){
        InternshipAiDto updatedInternship = internshipAiService.updateInternshipAi(internshipAi,id);
        return ResponseEntity.ok(updatedInternship);
    }
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?>deleteInternship(@PathVariable Long id){
internshipAiService.removeInternshipAi(id);
return ResponseEntity.ok().body("Internship deleted successfully.");
    }


}
