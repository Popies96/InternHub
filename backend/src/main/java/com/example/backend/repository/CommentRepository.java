package com.example.backend.repository;

import com.example.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTopicId(int topicId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.topic.id = :topicId")
    long countCommentsByTopicId(@Param("topicId") int topicId);

}
