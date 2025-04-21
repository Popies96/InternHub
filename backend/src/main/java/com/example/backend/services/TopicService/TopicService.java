package com.example.backend.services.TopicService;

import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicCategory;

import java.util.List;

public interface TopicService {
    Topic saveTopic(Topic topic);
    List<Topic> getAllTopics();
    List<Topic> getTopicsByCategory(TopicCategory category);
    List<Topic> getTopicsByUserId(Long userId);
    List<Topic> searchTopics(String keyword);
    Topic getTopicById(int id);
    void deleteTopic(int id,int userid);
    Topic updateTopic(int topicId, Topic updatedTopic);

}
