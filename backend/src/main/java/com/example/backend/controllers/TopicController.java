package com.example.backend.controllers;

import com.example.backend.dto.TopicDTO;
import com.example.backend.entity.Comment;
import com.example.backend.entity.Topic;
import com.example.backend.entity.TopicCategory;
import com.example.backend.entity.User;
import com.example.backend.repository.CommentRepository;
import com.example.backend.services.TopicService.Comment.CommentService;
import com.example.backend.services.TopicService.Comment.CommentServiceImpl;
import com.example.backend.services.TopicService.FileStorageService;
import com.example.backend.services.TopicService.TopicServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/topic")
public class TopicController {

    @Autowired
    private TopicServiceImpl topicService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private CommentServiceImpl commentService;

    @Autowired
    private CommentRepository commentRepository;

    private TopicDTO convertToDTO(Topic topic) {
        TopicDTO dto = new TopicDTO();
        dto.setId(topic.getId());
        dto.setTitle(topic.getTitle());
        dto.setContent(topic.getContent());
        dto.setCategory(topic.getCategory());
        dto.setTags(topic.getTags());
        dto.setUserId(topic.getUser() != null ? topic.getUser().getId() : null);
        dto.setDateCreated(topic.getDateCreated());
        dto.setUpdatedAt(topic.getUpdatedAt());
        dto.setPrenom(topic.getUser() != null ? topic.getUser().getNom() : null);
        dto.setImagePath(topic.getImagePath()); // Make sure to include imagePath in DTO
        dto.setViews(topic.getViews());
        return dto;
    }

    // Create a new topic with optional file upload
    @PostMapping("/create/{userId}")
    public ResponseEntity<TopicDTO> createTopic(
            @RequestPart("topic") Topic topic,
            @PathVariable Long userId,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        // Set user
        User user = new User();
        user.setId(userId);
        topic.setUser(user);

        // Set timestamps
        topic.setDateCreated(java.time.LocalDateTime.now());
        topic.setViews(0);

        Topic saved = topicService.saveTopic(topic, file);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    // Get topic image
    @GetMapping("/{id}/image")
    public ResponseEntity<Resource> getTopicImage(@PathVariable int id) throws IOException {
        Topic topic = topicService.getTopicById(id);
        if (topic == null || topic.getImagePath() == null) {
            return ResponseEntity.notFound().build();
        }

        Path filePath = fileStorageService.loadFile(topic.getImagePath());
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(getContentType(topic.getImagePath())))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    private String getContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            default:
                return "application/octet-stream";
        }
    }

    // Get all topics
    @GetMapping("/all")
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

        if (topic == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(convertToDTO(topic));
    }

    // Delete topic
    @DeleteMapping("/{id}/{userId}")
    public ResponseEntity<Void> delete(@PathVariable int id, @PathVariable int userId) {
        boolean deleted = topicService.deleteTopic(id, userId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // Update topic
    @PostMapping("/update/{id}/{userId}")
    public ResponseEntity<TopicDTO> updateTopic(
            @PathVariable int id,
            @PathVariable Long userId,
            @RequestPart("topic") Topic topic,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        System.err.println(file);
        // Verify user owns the topic
        Topic existingTopic = topicService.getTopicById(id);
        if (existingTopic == null || existingTopic.getUser() == null ||
                !existingTopic.getUser().getId().equals(userId)) {
            return ResponseEntity.badRequest().build();
        }

        // Update timestamps
        topic.setUpdatedAt(java.time.LocalDateTime.now());

        Topic updated = topicService.updateTopic(id, topic, file);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @PostMapping("/view/{id}")
    public ResponseEntity<TopicDTO> incrementViews(@PathVariable int id) {
        Topic topic = topicService.getTopicById(id);
        if (topic == null) {
            return ResponseEntity.notFound().build();  // Return 404 if topic is not found
        }

        // Increment views and save
        Topic updatedTopic = topicService.updateViews(topic);
        return ResponseEntity.ok(convertToDTO(updatedTopic));  // Return updated topic as DTO
    }


    @PostMapping("/{topicId}/{userId}/addcomment")
    public ResponseEntity<Comment> addComment(@PathVariable int topicId,
                                              @RequestBody Comment comment,
                                              @PathVariable int userId) {
        System.err.println("topicId: " + topicId + " comment: " + comment);
        System.err.println("WZEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        Comment savedComment = commentService.addComment(comment, topicId,userId);
        return  ResponseEntity.ok(savedComment);
    }
    @GetMapping("/comments/{topicId}")
    public List<Comment> getCommentsByTopic(@PathVariable int topicId) {
        // Log to check what is being returned
        System.err.println("\n Fetching comments for topicId: " + topicId);
        List<Comment> comments = commentService.getCommentsByTopicId(topicId);


        return comments;
    }

    @GetMapping("/comments/count/{topicId}")
    public long countCommentsByTopic(@PathVariable int topicId) {
        return commentRepository.countCommentsByTopicId(topicId);
    }
    @DeleteMapping("/comment/delete/{commentId}/{userId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, @PathVariable Long userId) {
        Comment comment = commentService.findById(commentId);

        if (comment.getUser().getId().equals(userId)) {
            commentService.delete(commentId);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // User not authorized to delete
        }
    }

    @PutMapping("/comment/update/{id}/{currentUser}")
    public ResponseEntity<?> updateComment(@PathVariable Long id,
                                           @RequestBody Comment updatedComment,
                                           @PathVariable User currentUser) {
        Comment comment = commentService.findById(id);
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only update your own comments.");
        }
        comment.setComment(updatedComment.getComment());
        commentService.save(comment);
        return ResponseEntity.ok(comment);
    }




}