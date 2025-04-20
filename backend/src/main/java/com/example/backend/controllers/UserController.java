package com.example.backend.controllers;

import com.example.backend.dto.SignupRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
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
    public ResponseEntity <List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());

    }

    @GetMapping("/email")
    public ResponseEntity <SignupRequest> getUserByEmail(@RequestParam String email) {
        Optional<User> user = userRepository.findByEmail(email);
        SignupRequest student = new SignupRequest();

        student.setNom(user.get().getNom());
        student.setPrenom(user.get().getPrenom());
        student.setEmail(user.get().getEmail());
        student.setPassword(user.get().getPassword());
        student.setCin(student.getCin());
        student.setSchool(student.getSchool());
        return ResponseEntity.ok().body(student);
    }

}