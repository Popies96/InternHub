package com.example.backend.services.TaskNotificationService;

import com.example.backend.dto.TaskResponse;
import com.example.backend.dto.UserRequest;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskNotification;
import com.example.backend.entity.User;

import java.util.List;

public interface TaskNotifService {
    void sendNewTaskNotification(UserRequest student, TaskResponse task);
}