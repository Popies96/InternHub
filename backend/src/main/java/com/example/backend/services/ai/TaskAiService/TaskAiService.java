package com.example.backend.services.ai.TaskAiService;

import com.example.backend.dto.TaskAiDto;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskAi;

import java.util.List;

public interface TaskAiService {
    List<TaskAi> retrieveTaskAi();
    TaskAi updateTaskAi(TaskAi task);
    TaskAi addTaskAi(TaskAi task);
    TaskAi retrieveTaskAi(long idTask);
    void removeTaskAi(long idTask);
}
