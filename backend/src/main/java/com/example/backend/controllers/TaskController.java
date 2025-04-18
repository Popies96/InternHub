package com.example.backend.controllers;

import com.example.backend.entity.Internship;
import com.example.backend.entity.Task;
import com.example.backend.services.internshipService.InternshipService;
import com.example.backend.services.task.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;


    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")  // Only Admin can access all internships
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.retrieveTask());
    }
/*
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') and #studentId == authentication.principal.id")  // Ensure the student can only view their own internships
    public ResponseEntity<List<Task>> getTasksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(taskService.getTasksByStudent(studentId));
    }*/

    @PostMapping("/enterprise/addTask")

    //  @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("User Roles: " + auth.getAuthorities());
        Task createdTask = taskService.addTask(task);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/enterprise/updateTask/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        task.setId(id);
        return ResponseEntity.ok(taskService.updateTask(task));
    }

    @DeleteMapping("/enterprise/deleteTask/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Void> removeTask(@PathVariable Long id) {
        taskService.removeTask(id);
        return ResponseEntity.noContent().build();
    }
}
