package com.example.backend.services.TopicService;

import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicCategory;
import com.example.backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TopicServiceImpl implements TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Override
    public Topic saveTopic(Topic topic) {
        topic.setDateCreated(LocalDateTime.now()); // Set manually
        topic.setUpdatedAt(null); // optional: make it explicit
        return topicRepository.save(topic);
    }

    @Override
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    @Override
    public List<Topic> getTopicsByCategory(TopicCategory category) {
        return topicRepository.findByCategory(category);
    }

    @Override
    public List<Topic> getTopicsByUserId(Long userId) {
        return topicRepository.findByUserId(userId);
    }

    @Override
    public List<Topic> searchTopics(String keyword) {
        return topicRepository.findByTitleContainingIgnoreCase(keyword);
    }

    @Override
    public Topic getTopicById(int id) {
        Optional<Topic> topic = topicRepository.findById(id);
        return topic.orElse(null);
    }

    @Override
    public void deleteTopic(int id,int userId) {
        Optional<Topic> topic = topicRepository.findById(id);
        if(topic.get().getUser().getId() == userId){
        topicRepository.deleteById(id);}
    }
    @Override
    public Topic updateTopic(int topicId, Topic updatedTopic) {
        Topic existingTopic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + topicId));

        existingTopic.setTitle(updatedTopic.getTitle());
        existingTopic.setContent(updatedTopic.getContent());
        existingTopic.setCategory(updatedTopic.getCategory());
        existingTopic.setTags(updatedTopic.getTags());
        existingTopic.setUpdatedAt(LocalDateTime.now()); // ✅ set updated time


        // Optionally update user if you're supporting that
        // existingTopic.setUser(updatedTopic.getUser());

        return topicRepository.save(existingTopic);
    }
}
