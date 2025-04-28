package com.example.backend.controllers;

import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskStatus;
import com.example.backend.services.task.TaskService;
import com.example.backend.services.TaskNotificationService.TaskNotifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    private final SimpMessagingTemplate messagingTemplate;


    @Autowired
    public TaskController(TaskService taskService ,  SimpMessagingTemplate messagingTemplate) {
        this.taskService = taskService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/enterprise")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<TaskResponse> addTask(@RequestBody TaskRequest taskRequest) {
        TaskResponse savedTask = taskService.createTask(taskRequest);

        // Send notification directly to the assigned user's channel
        /*String destination = "/topic/tasks/" + savedTask.getAssignedTo();
        messagingTemplate.convertAndSend(destination, savedTask);*/

        return ResponseEntity.ok(savedTask);
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


    // In your TaskController.java

}