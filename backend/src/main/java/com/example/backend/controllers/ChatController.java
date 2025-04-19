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

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        System.out.println("Message saved with ID: " + savedMsg.getId());

        System.out.println("Attempting to send to /user/" + chatMessage.getRecipientId() + "/queue/messages");
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
        chat.get(chat.size()-1).setSeen(true);
        return ResponseEntity
                .ok(chat);
    }
    @PostMapping("/users/{userId}")
    public ResponseEntity<User> getUser(@PathVariable long userId) {
        User user = userRepository.getReferenceById(userId);
        return ResponseEntity.ok(user);
    }

//    @GetMapping("/seen/{senderId}/{recipientId}")
    public boolean ReadOrNot(@PathVariable String senderId,
                             @PathVariable String recipientId) {
        List<ChatMessage> chatmessage=chatMessageService.findChatMessages(senderId, recipientId);
        return chatmessage.get(chatmessage.size()-1).getSeen();

    }



}