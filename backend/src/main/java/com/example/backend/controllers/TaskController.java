package com.example.backend.controllers;

import ch.qos.logback.classic.Logger;
import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.services.task.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/enterprise")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<TaskResponse> addTask( @RequestBody TaskRequest taskRequest) {
        return ResponseEntity.ok(taskService.createTask(taskRequest));
    }

    @PutMapping("/enterprise/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest taskRequest) {
        return ResponseEntity.ok(taskService.updateTask(id, taskRequest));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ENTERPRISE', 'STUDENT')")
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @DeleteMapping("/enterprise/{id}")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    // Add this method to your TaskController.java
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENTERPRISE', 'STUDENT')")
    public ResponseEntity<List<TaskResponse>> getTasksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(taskService.getTasksByStudent(studentId));
    }
}