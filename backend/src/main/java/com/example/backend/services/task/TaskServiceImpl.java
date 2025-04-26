package com.example.backend.services.task;

import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.*;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.TaskRepository;
import com.example.backend.services.EmailService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final EmailService emailService;

    public TaskServiceImpl(TaskRepository taskRepository, StudentRepository studentRepository, InternshipRepository internshipRepository, EmailService emailService) {
        this.taskRepository = taskRepository;
        this.studentRepository = studentRepository;
        this.internshipRepository = internshipRepository;
        this.emailService = emailService;
    }
    @Override
    public TaskResponse createTask(TaskRequest taskRequest) {
        // Validate request

        // Create new task entity
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDeadline(taskRequest.getDeadline());
        task.setStatus(taskRequest.getStatus() != null ?taskRequest.getStatus() : TaskStatus.PENDING);
        task.setType(taskRequest.getType());
        task.setPriority(taskRequest.getPriority() != null ?taskRequest.getPriority() : TaskPriority.MEDIUM );
        // Set student and internship with proper existence checks
        task.setStudent(studentRepository.findById(taskRequest.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + taskRequest.getStudentId())));

        task.setInternship(internshipRepository.findById(taskRequest.getInternshipId())
                .orElseThrow(() -> new EntityNotFoundException("Internship not found with ID: " + taskRequest.getInternshipId())));

        // Save and return the response
        Task savedTask = taskRepository.save(task);
         sendTaskByEmail(savedTask.getId());
        return toTaskResponse(savedTask);
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest taskRequest) {
        // Validate request
        if (!StringUtils.hasText(taskRequest.getTitle())) {
            throw new IllegalArgumentException("Task title cannot be empty");
        }

        // Find existing task
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + id));

        // Update basic fields
        existingTask.setTitle(taskRequest.getTitle());
        existingTask.setDescription(taskRequest.getDescription());
        existingTask.setDeadline(taskRequest.getDeadline());
        existingTask.setStatus(taskRequest.getStatus() != null ? taskRequest.getStatus() : existingTask.getStatus());
        existingTask.setType(taskRequest.getType() != null ? taskRequest.getType() : existingTask.getType());
        existingTask.setPriority(taskRequest.getPriority() != null ? taskRequest.getPriority() : existingTask.getPriority() );
        // Update relationships if they are provided in the request
        if (taskRequest.getStudentId() != null) {
            Student student = studentRepository.findById(taskRequest.getStudentId())
                    .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + taskRequest.getStudentId()));
            existingTask.setStudent(student);
        }

        if (taskRequest.getInternshipId() != null) {
            Internship internship = internshipRepository.findById(taskRequest.getInternshipId())
                    .orElseThrow(() -> new EntityNotFoundException("Internship not found with ID: " + taskRequest.getInternshipId()));
            existingTask.setInternship(internship);
        }

        // Save and return the response
        Task updatedTask = taskRepository.save(existingTask);
        return toTaskResponse(updatedTask);
    }

    @Override
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
        return toTaskResponse(task);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with ID: " + id);
        }
        taskRepository.deleteById(id);
    }

    @Override
    public TaskResponse updateTaskStatus(Long id) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + id));

        existingTask.setStatus(TaskStatus.COMPLETED);
        return toTaskResponse(taskRepository.save(existingTask));
    }


    @Override
    public List<TaskResponse> getTasksByStudent(Long studentId) {
        // Add existence check for student
        if (!studentRepository.existsById(studentId)) {
            throw new EntityNotFoundException("Student not found with ID: " + studentId);
        }

        return taskRepository.findByStudentId(studentId).stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void sendTaskByEmail(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with ID: " + taskId));

        Student student = task.getStudent();
        if (student == null) {
            throw new IllegalStateException("Task is not assigned to any student");
        }

        if (student.getEmail() == null || student.getEmail().isEmpty()) {
            throw new IllegalStateException("Student email is not set");
        }
        String subject = "New Task Assigned: " + task.getTitle();
        String content = buildTaskEmailContent(task);

        emailService.sendHtmlEmail(student.getEmail(), subject, content );
    }

    private String buildTaskEmailContent(Task task) {
        String formattedDeadline = task.getDeadline() != null
                ? task.getDeadline().toString()
                : "No deadline specified";

        return String.format(
                "<html>" +
                        "<body>" +
                        "<p>Dear %s %s,</p>" +
                        "<p>You have been assigned a new task for your internship at <strong>%s</strong>.</p>" +
                        "<h3>Task Details:</h3>" +
                        "<ul>" +
                        "<li><strong>Title:</strong> %s</li>" +
                        "<li><strong>Description:</strong> %s</li>" +
                        "<li><strong>Deadline:</strong> %s</li>" +
                        "<li><strong>Priority:</strong> %s</li>" +
                        "<li><strong>Status:</strong> %s</li>" +
                        "</ul>" +
                        "<p>Please log in to your InternHub account to view and complete this task.</p>" +
                        "<p>Best regards,<br/>" +
                        "InternHub Team</p>" +
                        "</body>" +
                        "</html>",
                task.getStudent().getPrenom(),
                task.getStudent().getNom(),
                task.getInternship().getEnterprise().getNom(),
                task.getTitle(),
                task.getDescription(),
                formattedDeadline,
                task.getPriority().toString(),
                task.getStatus().toString()
        );
    }




    private TaskResponse toTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDeadline(task.getDeadline());
        response.setStatus(task.getStatus());
        response.setType(task.getType());
        response.setPriority(task.getPriority());
        response.setCreatedAt(LocalDateTime.now());
        response.setUpdatedAt(LocalDateTime.now());

        if (task.getStudent() != null) {
            response.setStudentId(task.getStudent().getId());
        }

        if (task.getInternship() != null) {
            response.setInternshipId(task.getInternship().getId());
        }

        response.setOverdue(task.isOverdue());
        return response;
    }
}