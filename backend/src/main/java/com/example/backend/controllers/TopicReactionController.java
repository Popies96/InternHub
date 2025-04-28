package com.example.backend.controllers;


import com.example.backend.entity.ReactionType;
import com.example.backend.services.TopicService.TopicReaction.TopicReactionServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reactions")
public class TopicReactionController {

    private final TopicReactionServiceImpl topicReactionService;

    public TopicReactionController(TopicReactionServiceImpl topicReactionService) {
        this.topicReactionService = topicReactionService;
    }

    @PostMapping("/{topicId}/like/{userId}")
    public void likeTopic(@PathVariable int topicId, @PathVariable Long userId) {
        topicReactionService.reactToTopic(userId, topicId, ReactionType.LIKE);
    }

    @PostMapping("/{topicId}/dislike/{userId}")
    public void dislikeTopic(@PathVariable int topicId, @PathVariable Long userId) {
        topicReactionService.reactToTopic(userId, topicId, ReactionType.DISLIKE);
    }

    @GetMapping("/{topicId}/likes")
    public long getLikes(@PathVariable int topicId) {
        return topicReactionService.countLikes(topicId);
    }

    @GetMapping("/{topicId}/dislikes")
    public long getDislikes(@PathVariable int topicId) {
        return topicReactionService.countDislikes(topicId);
    }
    @GetMapping("/{topicId}/reaction/{userId}")
    public ResponseEntity<ReactionType> getUserReaction(@PathVariable int topicId, @PathVariable Long userId) {
        ReactionType reaction = topicReactionService.getUserReaction(userId, topicId);
        return ResponseEntity.ok(reaction);
    }

}
