package com.example.backend.controllers;

import com.example.backend.dto.TaskRepResponse;
import com.example.backend.entity.TaskRep;
import com.example.backend.entity.TaskRepStatus;
import com.example.backend.services.task.TaskService;
import com.example.backend.services.taskRep.TaskRepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/task-reps")
public class TaskRepController {

    @Autowired
    private TaskRepService taskRepService;

    @Autowired
    private TaskService taskService;

    // Get all task responses with details
    @GetMapping("/all")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<List<TaskRepResponse>> getAllTaskReps() {
        List<TaskRepResponse> taskReps = taskRepService.getAllTaskReps();
        return ResponseEntity.ok(taskReps);
    }

    // Get specific task response
    @GetMapping("/{taskRepId}")

    public ResponseEntity<TaskRepResponse> getTaskRepById(@PathVariable Long taskRepId) {
        TaskRepResponse taskRep = taskRepService.getTaskRepById(taskRepId);
        return ResponseEntity.ok(taskRep);
    }

    // PDF Upload
    @PostMapping("/{taskId}/pdf")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TaskRepResponse> uploadPdfTaskRep(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file) throws IOException {
        TaskRepResponse taskRep = taskRepService.savePdfTaskRep(taskId, file);
        return ResponseEntity.ok(taskRep);
    }

    // Create task response (text)
    @PostMapping("/tasks/{taskId}/task-rep")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<TaskRepResponse> createTaskRep(
            @PathVariable Long taskId,
            @RequestBody TaskRepResponse taskRep) {
        TaskRepResponse savedTaskRep = taskRepService.saveTaskRep(taskId, taskRep);
        savedTaskRep.setStatus(TaskRepStatus.PENDING);
        return ResponseEntity.created(URI.create("/api/task-reps/" + savedTaskRep.getId()))
                .body(savedTaskRep);
    }
    // PDF Download
    @GetMapping("/{taskRepId}/pdf")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<byte[]> downloadPdfFile(@PathVariable Long taskRepId) throws IOException {
        TaskRepResponse taskRep = taskRepService.getTaskRepById(taskRepId);
        byte[] fileContent = taskRepService.getPdfFile(taskRepId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(taskRep.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + taskRep.getFileName() + "\"")
                .body(fileContent);
    }

    // Get by task ID
    @GetMapping("/task/{taskId}")
    public ResponseEntity<TaskRepResponse> getTaskRepByTaskId(@PathVariable Long taskId) {
        TaskRepResponse taskRep = taskRepService.getTaskRepByTaskId(taskId);
        return ResponseEntity.ok(taskRep);
    }
    // Approve task response
    @PatchMapping("/{taskRepId}/approve")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<TaskRepResponse> approveTaskRep(@PathVariable Long taskRepId) {
        TaskRepResponse approvedTaskRep = taskRepService.approveTaskRep(taskRepId);
        approvedTaskRep.setStatus(TaskRepStatus.APPROVED);
        return ResponseEntity.ok(approvedTaskRep);
    }

    @PatchMapping("/{taskRepId}/reject")
    @PreAuthorize("hasRole('ENTERPRISE')")
    public ResponseEntity<TaskRepResponse> rejectTaskRep(
            @PathVariable Long taskRepId,
            @RequestBody String feedback) {
        TaskRepResponse rejectedTaskRep = taskRepService.rejectTaskRep(taskRepId, feedback);
        rejectedTaskRep.setStatus(TaskRepStatus.REJECTED);
        return ResponseEntity.ok(rejectedTaskRep);
    }
}