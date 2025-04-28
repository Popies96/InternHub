package com.example.backend.services.taskRep;

import com.example.backend.dto.TaskRepResponse;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskRep;
import com.example.backend.entity.TaskRepStatus;
import com.example.backend.entity.User;
import com.example.backend.repository.TaskRepRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskRepServiceImpl implements TaskRepService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private TaskRepRepository taskRepRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<TaskRepResponse> getAllTaskReps() {
        return taskRepRepository.findAllWithTaskAndStudent().stream()
                .map(this::toTaskRepResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskRepResponse getTaskRepById(Long taskRepId) {
        return taskRepRepository.findByIdWithTaskAndStudent(taskRepId)
                .map(this::toTaskRepResponse)
                .orElseThrow(() -> new RuntimeException("TaskRep not found with id: " + taskRepId));
    }

    @Override
    public TaskRepResponse saveTaskRep(Long taskId, TaskRepResponse taskRepResponse) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if(task.getTaskRep() != null) {
            throw new IllegalStateException("Task already has a TaskRep");
        }

        TaskRep taskRep = new TaskRep();
        taskRep.setContent(taskRepResponse.getContent());
        taskRep.setStatus(taskRepResponse.getStatus());
        taskRep.setTask(task);
        task.setTaskRep(taskRep);

        return toTaskRepResponse(taskRepRepository.save(taskRep));
    }

    @Override
    public TaskRepResponse getTaskRepByTaskId(Long taskId) {
        TaskRep taskRep = taskRepRepository.findByTaskId(taskId);
        return taskRep != null ? toTaskRepResponse(taskRep) : null;
    }

    @Override
    public TaskRepResponse savePdfTaskRep(Long taskId, MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String uniqueFileName = UUID.randomUUID() + fileExtension;

        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath);

        TaskRep taskRep = taskRepRepository.findByTaskId(taskId);
        if (taskRep == null) {
            taskRep = new TaskRep();
            Task task = taskRepository.findById(taskId).orElseThrow();
            taskRep.setTask(task);
            taskRep.setStatus(TaskRepStatus.PENDING);
        }

        taskRep.setContent(filePath.toString());
        taskRep.setFileName(originalFileName);
        taskRep.setFileType(file.getContentType());

        return toTaskRepResponse(taskRepRepository.save(taskRep));
    }

    @Override
    public byte[] getPdfFile(Long taskRepId) throws IOException {
        TaskRep taskRep = taskRepRepository.findById(taskRepId).orElseThrow();
        Path filePath = Paths.get(taskRep.getContent());
        return Files.readAllBytes(filePath);
    }

    @Override
    public TaskRepResponse approveTaskRep(Long taskRepId) {
        TaskRep taskRep = taskRepRepository.findById(taskRepId)
                .orElseThrow(() -> new RuntimeException("TaskRep not found"));

        taskRep.setStatus(TaskRepStatus.APPROVED);
        return toTaskRepResponse(taskRepRepository.save(taskRep));
    }

    @Override
    public TaskRepResponse rejectTaskRep(Long taskRepId, String feedback) {
        TaskRep taskRep = taskRepRepository.findById(taskRepId)
                .orElseThrow(() -> new RuntimeException("TaskRep not found"));

        taskRep.setStatus(TaskRepStatus.REJECTED);
        taskRep.setFeedback(feedback);
        return toTaskRepResponse(taskRepRepository.save(taskRep));
    }

    private TaskRepResponse toTaskRepResponse(TaskRep taskRep) {
        TaskRepResponse response = new TaskRepResponse();
        response.setId(taskRep.getId());
        response.setContent(taskRep.getContent());
        response.setFileName(taskRep.getFileName());
        response.setFileType(taskRep.getFileType());
        response.setStatus(taskRep.getStatus());
        response.setFeedback(taskRep.getFeedback());

        if (taskRep.getTask() != null) {
            Task task = taskRep.getTask();
            TaskResponse taskResponse = new TaskResponse();
            taskResponse.setId(task.getId());
            taskResponse.setTitle(task.getTitle());
            taskResponse.setDescription(task.getDescription());
            taskResponse.setDeadline(task.getDeadline());
            taskResponse.setStatus(task.getStatus());
            taskResponse.setType(task.getType());
            taskResponse.setPriority(task.getPriority());
            taskResponse.setCreatedAt(task.getCreatedAt());
            taskResponse.setUpdatedAt(task.getUpdatedAt());

            if (task.getStudent() != null) {
                taskResponse.setStudentId(task.getStudent().getId());
                taskResponse.setStudentName(task.getStudent().getPrenom() + " " + task.getStudent().getNom());
            }

            if (task.getInternship() != null) {
                taskResponse.setInternshipId(task.getInternship().getId());
            }

            response.setTask(taskResponse);
        }

        return response;
    }
}