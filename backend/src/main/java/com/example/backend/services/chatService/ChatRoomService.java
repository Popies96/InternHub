package com.example.backend.services.chatService;

import java.util.Optional;

public interface ChatRoomService {


    Optional<String> getChatRoomId(String senderId, String recipientId, boolean createNewRoomIfNotExists);

    String createChatId(String senderId, String recipientId);
}
