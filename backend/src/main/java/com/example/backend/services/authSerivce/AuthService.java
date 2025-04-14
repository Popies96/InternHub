package com.example.backend.services;

import com.example.backend.dto.SignupRequest;

public interface AuthService {
    boolean createEtudiant(SignupRequest signupRequest);
}
