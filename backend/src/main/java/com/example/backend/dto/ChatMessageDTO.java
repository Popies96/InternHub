package com.example.backend.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ChatMessageDTO {
    private Long id;
    private String chatId;
    private String senderId;
    private String recipientId;
    private String content;
    private Date timestamp;
}
