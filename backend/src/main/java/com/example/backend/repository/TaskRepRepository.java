package com.example.backend.repository;

import com.example.backend.entity.TaskRep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TaskRepRepository extends JpaRepository<TaskRep, Long> {
    TaskRep findByTaskId(Long taskId);

    @Query("SELECT tr FROM TaskRep tr JOIN FETCH tr.task t JOIN FETCH t.student WHERE tr.id = :id")
    Optional<TaskRep> findByIdWithTaskAndStudent(Long id);

    @Query("SELECT tr FROM TaskRep tr JOIN FETCH tr.task t JOIN FETCH t.student")
    List<TaskRep> findAllWithTaskAndStudent();

}