package com.example.backend.services.TopicService;

import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicCategory;
import com.example.backend.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TopicServiceImpl implements TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Override
    public Topic saveTopic(Topic topic, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            String storedFilename = fileStorageService.storeFile(file);
            topic.setImagePath(storedFilename);
        }

        topic.setDateCreated(LocalDateTime.now());
        topic.setUpdatedAt(null);
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
    public boolean deleteTopic(int id, int userId) {
        Optional<Topic> topic = topicRepository.findById(id);
        if(topic.get().getUser().getId() == userId){
        topicRepository.deleteById(id);
        return true;}
        return false;
    }
    @Override
    public Topic updateTopic(int topicId, Topic updatedTopic,MultipartFile file) throws IOException {
        Topic existingTopic = topicRepository.findById(topicId)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + topicId));

        System.err.println("file testing");
        if (file != null && !file.isEmpty()) {
            String storedFilename = fileStorageService.storeFile(file);
            existingTopic.setImagePath(storedFilename);
            System.err.println("stored file");
        }

        existingTopic.setTitle(updatedTopic.getTitle());
        existingTopic.setContent(updatedTopic.getContent());
        existingTopic.setCategory(updatedTopic.getCategory());
        existingTopic.setTags(updatedTopic.getTags());
        existingTopic.setUpdatedAt(LocalDateTime.now()); // ✅ set updated time



        // Optionally update user if you're supporting that
        // existingTopic.setUser(updatedTopic.getUser());

        return topicRepository.save(existingTopic);
    }

    @Override
    public Topic updateViews(Topic topic) {
        // Increment the views by 1
        topic.setViews(topic.getViews() + 1);
        System.err.println("Updated view count: " + topic.getViews());  // Debugging line

        // Save and return the updated topic
        return topicRepository.save(topic);
    }
    @Override
    public Topic saveLikeOrDislike(Topic topic) {

        topic.setUpdatedAt(LocalDateTime.now());
        return topicRepository.save(topic);
    }

}
