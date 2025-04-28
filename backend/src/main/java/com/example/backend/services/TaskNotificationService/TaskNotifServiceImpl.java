package com.example.backend.services.TaskNotificationService;
import com.example.backend.dto.TaskResponse;
import com.example.backend.dto.UserRequest;
import com.example.backend.entity.Task;
import com.example.backend.entity.TaskNotification;
import com.example.backend.entity.User;
import com.example.backend.repository.TaskNotificationRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class TaskNotifServiceImpl implements TaskNotifService {
    private final SimpMessagingTemplate messagingTemplate;

    public TaskNotifServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }


    @Override
    public void sendNewTaskNotification(UserRequest student, TaskResponse task) {
        UserRequest assignedTo = new UserRequest();
        String message = String.format(
                "New task for %s: %s",
                assignedTo.getPrenom(),  // First name
                task.getTitle()
        );

        messagingTemplate.convertAndSendToUser(
                assignedTo.getId().toString(),
                "/queue/tasks",
                message
        );
    }
}