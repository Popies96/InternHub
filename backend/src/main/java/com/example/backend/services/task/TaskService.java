package com.example.backend.services.task;

import com.example.backend.entity.Internship;
import com.example.backend.entity.Task;

import java.util.List;

public interface TaskService {

        List<Task> retrieveTask();
        Task updateTask(Task task);
        Task addTask(Task task);
        Task retrieveTask(long idTask);
        void removeTask(long idTask);
       /* List<Task> getTasksByStudent(Long studentId);
        List<Task> getTasksByEnterprise(Long enterpriseId);*/
}
