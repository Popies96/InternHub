package com.example.backend.controllers;

import com.example.backend.entity.*;
import com.example.backend.repository.ChatMessageRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.services.chatService.ChatMessageService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserServiceImpl userService;
    private final String audioUploadDir = "uploads/audio/"; // relative path

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        System.err.println("weeeeew");
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        System.err.println("Message saved with ID: " + savedMsg.getId());
        LocalDateTime localTimestamp = savedMsg.getTimestamp().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        System.err.println("Attempting to send to /user/" + chatMessage.getRecipientId() + "/queue/messages");
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                new ChatNotification(
                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getRecipientId(),
                        savedMsg.getContent(),
                        ""
                )
        );
        System.out.println("Message forwarding attempted");

    }

    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String senderId,
                                                              @PathVariable String recipientId) {
        List<ChatMessage> chat=chatMessageService.findChatMessages(senderId, recipientId);

        return ResponseEntity.ok(chat);
    }
    @PostMapping("/users/{userId}")
    public ResponseEntity<User> getUser(@PathVariable long userId) {
        User user = userRepository.getReferenceById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/unseen-count/{userId}")
    public ResponseEntity<Integer> getUnseenMessagesCount(@PathVariable String userId) {
        int unseenCount = chatMessageRepository.countByRecipientIdAndSeen(userId, false);
        System.err.println(unseenCount);
        return ResponseEntity.ok(unseenCount);
    }

    @GetMapping("/seen/{senderId}/{recipientId}")
    public ResponseEntity<Boolean> isLastMessageSeen(@PathVariable String senderId,
                                                     @PathVariable String recipientId) {
        List<ChatMessage> messages = chatMessageService.findChatMessagesLast(senderId, recipientId);

        if (messages.isEmpty())
        {return ResponseEntity.ok(true); }// No message = nothing to notify

        ChatMessage lastMessage = messages.get(messages.size() - 1);

        boolean currentIsRecipient = recipientId.equals(lastMessage.getRecipientId());

        if(!lastMessage.getSeen())
        {
            System.err.println("lehna");
            return ResponseEntity.ok(false);}

        return ResponseEntity.ok(true);
    }

    @GetMapping("/last/{currentUserId}")
    public ResponseEntity<Map<Long, ChatMessage>> getLastMessages(@PathVariable String currentUserId) {
        List<User> users = userService.getAllUsers();
        Map<Long, ChatMessage> lastMessages = new HashMap<>();

        for (User user : users) {
            if (!Long.toString(user.getId()).equals(currentUserId)) {
                List<ChatMessage> messages = chatMessageService.findChatMessagesLast(currentUserId, Long.toString(user.getId()));

                if (!messages.isEmpty()) {
                    // Sort messages DESC by timestamp
                    messages.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

                    ChatMessage lastMessage = messages.get(0); // Now this is truly the latest
                    System.err.println("Last Message for " + user.getId() + ": " + lastMessage.getContent());
                    lastMessages.put(user.getId(), lastMessage);
                }
            }
        }

        return ResponseEntity.ok(lastMessages);
    }

    @PostMapping("/upload-audio")
    public ResponseEntity<?> uploadAudio(
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderId") String senderId,
            @RequestParam("recipientId") String recipientId) throws IOException {

        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file provided");
        }

        // Ensure directory exists
        File uploadDir = new File(audioUploadDir);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Generate unique filename
        String filename = UUID.randomUUID() + ".webm";
        Path filePath = Paths.get(audioUploadDir, filename);

        // Save the file to the server
        Files.copy(file.getInputStream(), filePath);

        // Create and save message with only filename in the database
        ChatMessage audioMessage = ChatMessage.builder()
                .senderId(senderId)
                .recipientId(recipientId)
                .messageType(MessageType.AUDIO)
                .audioUrl(filename)  // Save only the filename in the database
                .timestamp(new Date())
                .seen(false)
                .build();

        ChatMessage savedMsg = chatMessageRepository.save(audioMessage);

        // Notify recipient
        messagingTemplate.convertAndSendToUser(
                recipientId,
                "/queue/messages",
                new ChatNotification(
                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getRecipientId(),
                        "",
                        savedMsg.getAudioUrl() // Send only the filename (not the full URL)
                )
        );

        return ResponseEntity.ok(savedMsg);
    }



    @GetMapping("/audio/{filename:.+}")
    public ResponseEntity<Resource> getAudio(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(audioUploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("audio/webm"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}

