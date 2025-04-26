package com.example.backend.repository;

import com.example.backend.entity.ReactionType;
import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicLikes;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TopicLikesRepository extends JpaRepository<TopicLikes, Integer> {
    Optional<TopicLikes> findByUserAndTopic(User user, Topic topic);

    long countByTopicAndReactionType(Topic topic, ReactionType reactionType);
    Optional<TopicLikes> findByUserIdAndTopicId(Long userId, int topicId);

}


