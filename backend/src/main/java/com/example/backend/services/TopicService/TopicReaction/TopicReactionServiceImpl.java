package com.example.backend.services.TopicService.TopicReaction;

import com.example.backend.entity.ReactionType;
import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicLikes;
import com.example.backend.entity.User;
import com.example.backend.repository.TopicLikesRepository;
import com.example.backend.repository.TopicRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TopicReactionServiceImpl implements TopicReactionService {

    private final TopicLikesRepository topicReactionRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;

    @Autowired
    public TopicReactionServiceImpl(TopicLikesRepository topicReactionRepository,
                                    UserRepository userRepository,
                                    TopicRepository topicRepository) {
        this.topicReactionRepository = topicReactionRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
    }

    @Override
    public void reactToTopic(Long userId, int topicId, ReactionType reactionType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        TopicLikes existingReaction = topicReactionRepository.findByUserAndTopic(user, topic)
                .orElse(null);

        if (existingReaction != null) {
            if (existingReaction.getReactionType() == reactionType) {
                return; // Already reacted with same type
            }
            existingReaction.setReactionType(reactionType);
            topicReactionRepository.save(existingReaction);
        } else {
            TopicLikes newReaction = new TopicLikes();
            newReaction.setUser(user);
            newReaction.setTopic(topic);
            newReaction.setReactionType(reactionType);
            topicReactionRepository.save(newReaction);
        }
    }

    @Override
    public long countLikes(int topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        return topicReactionRepository.countByTopicAndReactionType(topic, ReactionType.LIKE);
    }

    @Override
    public long countDislikes(int topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        return topicReactionRepository.countByTopicAndReactionType(topic, ReactionType.DISLIKE);
    }

    public ReactionType getUserReaction(Long userId, int topicId) {
        Optional<TopicLikes> reaction = topicReactionRepository.findByUserIdAndTopicId(userId, topicId);
        return reaction.map(TopicLikes::getReactionType).orElse(ReactionType.NONE); // Return NONE if no reaction
    }
}
