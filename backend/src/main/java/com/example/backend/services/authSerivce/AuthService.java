package com.example.backend.services.authSerivce;

import com.example.backend.dto.SignupRequest;

public interface AuthService {
    boolean createEtudiant(SignupRequest signupRequest);
}
