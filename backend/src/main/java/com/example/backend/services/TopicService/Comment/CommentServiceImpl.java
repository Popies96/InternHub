package com.example.backend.services.TopicService.Comment;

import com.example.backend.dto.CommentDTO;
import com.example.backend.entity.Comment;
import com.example.backend.entity.Topic;
import com.example.backend.entity.User;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.TopicRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.TopicService.TopicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TopicService topicService;

    @Override
    public Comment addComment(Comment comment, int topicId,int userId   ) {

        Comment newComment = new Comment();
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id " + topicId));

        User user = userRepository.findById((long)userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + comment.getUser().getId()));

        comment.setTopic(topic);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByTopicId(int topicId) {
        return commentRepository.findByTopicId(topicId);
    }
}
