package com.example.backend.controllers;

import com.example.backend.entity.ChatMessage;
import com.example.backend.entity.ChatNotification;
import com.example.backend.entity.ChatRoom;
import com.example.backend.entity.User;
import com.example.backend.repository.ChatMessageRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.services.chatService.ChatMessageService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller

public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserServiceImpl userService;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatMessageService chatMessageService, UserRepository userRepository, ChatMessageRepository chatMessageRepository, UserServiceImpl userService) {
        this.messagingTemplate = messagingTemplate;
        this.chatMessageService = chatMessageService;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userService = userService;
    }

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
                        savedMsg.getContent()
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


}