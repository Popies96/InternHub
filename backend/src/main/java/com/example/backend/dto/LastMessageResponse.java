package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LastMessageResponse {
    private Long userId;
    private String nom;
    private String prenom;
    private String email;
    private String lastMessage;
    private String timestamp;
}
