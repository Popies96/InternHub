package com.example.backend.controllers;

import com.example.backend.dto.SignupRequest;
import com.example.backend.entity.User;
import com.example.backend.services.authSerivce.AuthService;
import com.example.backend.services.authSerivce.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
public class SignupController {

    private final AuthService authService;
    private final UserServiceImpl userService;

    @Autowired
    public SignupController(AuthService authService, UserServiceImpl userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signupCustomer(@RequestBody SignupRequest signupRequest) {
        User createdEtudiant = authService.createEtudiant(signupRequest);
        if (createdEtudiant != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body("created");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create customer");
        }
    }
    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody SignupRequest signupRequest, Authentication authentication) {

        OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;

        User updatedUser = authService.updateUser(signupRequest,oauth2Token);
        if (updatedUser != null) {
            return ResponseEntity.ok("User updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

}
