package com.example.backend.controllers;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable long userId) {
        User user = userRepository.getReferenceById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String email) {
        if (email == null) {
            return ResponseEntity.ok(userRepository.findAll());
        }

        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(List.of(user))) // Wrap in a list for consistent return type
                .orElse(ResponseEntity.notFound().build());
    }
}
