package com.example.backend.repository;

import com.example.backend.entity.InternshipAi;
import com.example.backend.entity.TaskAi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskAiRepository extends JpaRepository<TaskAi,Long> {

}
