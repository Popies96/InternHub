package com.example.backend.services.TopicService;

import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicCategory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TopicService {
    Topic saveTopic(Topic topic, MultipartFile file) throws IOException;
    List<Topic> getAllTopics();
    List<Topic> getTopicsByCategory(TopicCategory category);
    List<Topic> getTopicsByUserId(Long userId);
    List<Topic> searchTopics(String keyword);
    Topic getTopicById(int id);
    boolean deleteTopic(int id, int userid);
    Topic updateTopic(int topicId, Topic updatedTopic,MultipartFile file) throws IOException;
     Topic updateViews(Topic topic);


}
