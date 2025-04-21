package com.example.backend.repository;

import com.example.backend.entity.TaskAi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskAiRepository extends JpaRepository<TaskAi,Long> {
}
