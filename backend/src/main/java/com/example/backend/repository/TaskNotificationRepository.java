package com.example.backend.repository;

import com.example.backend.entity.TaskNotification;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskNotificationRepository extends JpaRepository<TaskNotification, Long> {
    List<TaskNotification> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
