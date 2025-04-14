package com.example.backend.controllers;

import com.example.backend.dto.LoginRequest;
import com.example.backend.services.UserServiceImpl;
import com.example.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/login")
public class LoginController {
    private final AuthenticationManager authenticationManager;

    private final UserServiceImpl etudiantService;
    private final JwtUtil jwtUtil;

    @Autowired
    public LoginController(AuthenticationManager authenticationManager, UserServiceImpl etudiantService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.etudiantService = etudiantService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        UserDetails userDetails;
        try {
            userDetails = etudiantService.loadUserByUsername(loginRequest.getEmail());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        String jwt = jwtUtil.generateToken(userDetails);
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority()) // Extract role names
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("token", jwt, "roles", roles));

    }

}
