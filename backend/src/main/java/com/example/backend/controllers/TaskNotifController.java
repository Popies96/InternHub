package com.example.backend.controllers;
import com.example.backend.dto.TaskNotificationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller public class TaskNotifController {
    @Autowired     private SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/sendMessage")
    public void handleTaskNotification(@Payload TaskNotificationDto notification) {
        // Send to specific user's topic
        String destination = "/user/" + notification.getStudentId() + "/topic/tasks";
         messagingTemplate.convertAndSend(destination, notification);     } }
