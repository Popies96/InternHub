package com.example.backend.services.task;

import com.example.backend.dto.TaskRequest;
import com.example.backend.dto.TaskResponse;
import com.example.backend.entity.Task;
import java.util.List;

public interface TaskService {
        TaskResponse createTask(TaskRequest taskRequest);
        TaskResponse updateTask(Long id, TaskRequest taskRequest);
        List<TaskResponse> getAllTasks();
        TaskResponse getTaskById(Long id);
        void deleteTask(Long id);

        List<TaskResponse> getTasksByStudent(Long studentId);
}