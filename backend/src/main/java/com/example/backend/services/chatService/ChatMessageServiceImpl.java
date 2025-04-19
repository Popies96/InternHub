package com.example.backend.services.chatService;

import com.example.backend.entity.ChatMessage;
import com.example.backend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.LinkedTransferQueue;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;

    @Override
    public ChatMessage save(ChatMessage chatMessage)
    {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow(); // You can create your own dedicated exception
        chatMessage.setChatId(chatId);
        if (chatMessage.getTimestamp() == null) {
            chatMessage.setTimestamp(new Date()); // Sets current timestamp if it's null
        }
        repository.save(chatMessage);
        return chatMessage;
    }
    @Override
    public List<ChatMessage> findChatMessages(String senderId, String recipientId)
    {
        var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);
        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }


}
