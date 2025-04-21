package com.example.backend.services.task;

import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.Internship;
import com.example.backend.entity.Student;
import com.example.backend.entity.Task;
import com.example.backend.entity.Task.TaskStatus;
import com.example.backend.repository.InternshipRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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

    public TaskServiceImpl(TaskRepository taskRepository, StudentRepository studentRepository, InternshipRepository internshipRepository) {
        this.taskRepository = taskRepository;
        this.studentRepository = studentRepository;
        this.internshipRepository = internshipRepository;
    }
    @Override
    public TaskResponse createTask(TaskRequest taskRequest) {
        // Validate request

        // Create new task entity
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDeadline(taskRequest.getDeadline());
        task.setStatus(taskRequest.getStatus() != null ?
                taskRequest.getStatus() : TaskStatus.PENDING);
        // Set student and internship with proper existence checks
        task.setStudent(studentRepository.findById(taskRequest.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found with ID: " + taskRequest.getStudentId())));

        task.setInternship(internshipRepository.findById(taskRequest.getInternshipId())
                .orElseThrow(() -> new EntityNotFoundException("Internship not found with ID: " + taskRequest.getInternshipId())));

        // Save and return the response
        Task savedTask = taskRepository.save(task);

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
        existingTask.setStatus(taskRequest.getStatus() != null ?
                taskRequest.getStatus() : existingTask.getStatus());

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
    public List<TaskResponse> getTasksByStudent(Long studentId) {
        // Add existence check for student
        if (!studentRepository.existsById(studentId)) {
            throw new EntityNotFoundException("Student not found with ID: " + studentId);
        }

        return taskRepository.findByStudentId(studentId).stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse toTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setDeadline(task.getDeadline());
        response.setStatus(task.getStatus());
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