package com.example.backend.services.TopicService.Comment;

import com.example.backend.entity.Comment;

import java.util.List;

public interface CommentService {

     Comment addComment(Comment comment,int topicId,int userId) ;

     List<Comment> getCommentsByTopicId(int topicId);

    Comment findById(Long id);

    void delete(Long id);

    Comment save(Comment comment);

    }
