package com.example.backend.repository;

import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Integer> {
    List<Topic> findByCategory(TopicCategory category);
    List<Topic> findByUserId(Long userId);
    List<Topic> findByTitleContainingIgnoreCase(String keyword);
}
