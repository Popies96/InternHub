package com.example.backend.services.ai.TaskAiService;

import com.example.backend.entity.Task;
import com.example.backend.entity.TaskAi;
import com.example.backend.repository.TaskAiRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TaskAiServiceImpl implements TaskAiService{

    private final TaskAiRepository taskAiRepository;

    @Autowired
    public TaskAiServiceImpl(TaskAiRepository taskAiRepository) {
        this.taskAiRepository = taskAiRepository;
    }

    @Override
    public List<TaskAi> retrieveTaskAi() {
        return taskAiRepository.findAll();
    }

    @Override
    public TaskAi updateTaskAi(TaskAi task) {
        return null;
    }

    @Override
    public TaskAi addTaskAi(TaskAi task) {
        return taskAiRepository.save(task);
    }

    @Override
    public TaskAi retrieveTaskAi(long idTask) {
        return  taskAiRepository.findById(idTask).orElseThrow(() -> new EntityNotFoundException("InternshipAi with ID " + idTask + " not found"));
    }

    @Override
    public void removeTaskAi(long idTask) {

    }
}
