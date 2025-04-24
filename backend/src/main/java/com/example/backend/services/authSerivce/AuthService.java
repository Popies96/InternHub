package com.example.backend.services.authSerivce;

import com.example.backend.dto.SignupRequest;
import com.example.backend.entity.User;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

public interface AuthService {
    User createEtudiant(SignupRequest signupRequest);
    User updateUser(SignupRequest signupRequest, OAuth2AuthenticationToken auth2AuthenticationToken);
}
