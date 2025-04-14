package com.example.backend.controllers;

import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.services.authSerivce.AuthService;
import com.example.backend.services.authSerivce.OAuth2Authentication;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class LoginController {
    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl etudiantService;
    private final JwtUtil jwtUtil;

    @Autowired
    public LoginController(AuthenticationManager authenticationManager, AuthService authService, OAuth2Authentication authentication, UserServiceImpl etudiantService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;

        this.etudiantService = etudiantService;
        this.jwtUtil = jwtUtil;
    }
    @PostMapping("/login")
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
    @GetMapping("/google")
    public ResponseEntity<String > loginGoogleAuth(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
        return ResponseEntity.ok("Redirecting ..");
    }


}
