package com.example.backend.controllers;

import com.example.backend.dto.TopicDTO;
import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicCategory;
import com.example.backend.entity.User;
import com.example.backend.services.TopicService.TopicServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/topic")
public class TopicController {

    @Autowired
    private TopicServiceImpl topicService;

    private TopicDTO convertToDTO(Topic topic) {
        TopicDTO dto = new TopicDTO();
        dto.setId(topic.getId());
        dto.setTitle(topic.getTitle());
        dto.setContent(topic.getContent());
        dto.setCategory(topic.getCategory());
        dto.setTags(topic.getTags());
        dto.setUserId(topic.getUser() != null ? topic.getUser().getId() : null);
        dto.setDateCreated(topic.getDateCreated());
        dto.setPrenom(topic.getUser() != null ? topic.getUser().getNom() : null); // <-- ADD THIS
        return dto;
    }

    // Create a new topic
    @PostMapping("/create/{userId}")
    public ResponseEntity<TopicDTO> createTopic(@RequestBody Topic topic,
                                                @PathVariable int userId) {
        // Attach user by ID (assumes just the ID is provided from the path)
        User user = new User();
        user.setId((long) userId); // Cast to Long if your User.id is Long
        topic.setUser(user);

        Topic saved = topicService.saveTopic(topic);
        return ResponseEntity.ok(convertToDTO(saved));
    }
    // Get all topics
    @GetMapping("all")
    public ResponseEntity<List<TopicDTO>> getAllTopics() {
        List<TopicDTO> dtos = topicService.getAllTopics()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TopicDTO>> getByCategory(@PathVariable TopicCategory category) {
        List<TopicDTO> dtos = topicService.getTopicsByCategory(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TopicDTO>> getByUser(@PathVariable Long userId) {
        List<TopicDTO> dtos = topicService.getTopicsByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Search topics
    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<TopicDTO>> searchTopics(@PathVariable String keyword) {
        List<TopicDTO> dtos = topicService.searchTopics(keyword)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<TopicDTO> getById(@PathVariable int id) {
        Topic topic = topicService.getTopicById(id);
        if (topic == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(convertToDTO(topic));
    }

    // Delete topic
    @DeleteMapping("/{id}/{userId}")
    public ResponseEntity<Void> delete(@PathVariable int id,
                                       @PathVariable int userId) {
        topicService.deleteTopic(id,userId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/update/{id}/{userId}")
    public ResponseEntity<TopicDTO> updateTopic(@PathVariable int id,
                                                @PathVariable int userId,
                                                @RequestBody Topic topic) {
        if(topic.getUser().getId()==userId)
        {
        Topic updated = topicService.updateTopic(id, topic);
        return ResponseEntity.ok(convertToDTO(updated));}
        else return ResponseEntity.badRequest().build();
    }
}
