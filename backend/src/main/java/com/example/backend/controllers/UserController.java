package com.example.backend.controllers;

import com.example.backend.dto.SignupRequest;
import com.example.backend.dto.UserRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<UserRequest>> getAllUsers() {
        List<UserRequest> userRequests = userRepository.findAll().stream().map(user -> {
            UserRequest req = new UserRequest();
            req.setId(user.getId());
            req.setNom(user.getNom());
            req.setPrenom(user.getPrenom());
            req.setEmail(user.getEmail());
            req.setPassword(user.getPassword());
            req.setRole(user.getRole().name());
            return req;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userRequests);
    }

    @GetMapping("/email")
    public ResponseEntity <UserRequest> getUserByEmail(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        UserRequest student = new UserRequest();

        student.setNom(user.get().getNom());
        student.setId(user.get().getId());
        student.setPrenom(user.get().getPrenom());
        student.setEmail(user.get().getEmail());
        student.setPassword(user.get().getPassword());

        return ResponseEntity.ok().body(student);
    }

}