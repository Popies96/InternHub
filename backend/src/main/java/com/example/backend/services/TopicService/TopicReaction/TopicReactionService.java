package com.example.backend.services.TopicService.TopicReaction;

import com.example.backend.entity.ReactionType;

public interface TopicReactionService {
    public long countDislikes(int topicId) ;
        public long countLikes(int topicId) ;
            public void reactToTopic(Long userId, int topicId, ReactionType reactionType);
    }
