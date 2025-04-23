package com.example.backend.controllers;

import com.example.backend.dto.SignupRequest;
import com.example.backend.dto.UserRequest;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<UserRequest> getUser(@PathVariable long userId) {
        User user = userRepository.getReferenceById(userId);
        UserRequest student = new UserRequest();

        student.setNom(user.getNom());
        student.setId(user.getId());
        student.setPrenom(user.getPrenom());
        student.setEmail(user.getEmail());
        student.setPassword(user.getPassword());
        student.setCin(student.getCin());
        student.setSchool(student.getSchool());
        return ResponseEntity.ok().body(student);
    }



    @GetMapping("/all")
    public ResponseEntity <List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());

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
        student.setCin(student.getCin());
        student.setSchool(student.getSchool());
        return ResponseEntity.ok().body(student);
    }

    @GetMapping("/students")
    public ResponseEntity<List<UserRequest>> getAllStudents() {

        User user = (User) userRepository.findByRole(UserRole.STUDENT );
        UserRequest student = new UserRequest();

        student.setNom(user.getNom());
        student.setId(user.getId());
        student.setPrenom(user.getPrenom());
        student.setEmail(user.getEmail());
        student.setPassword(user.getPassword());
        student.setCin(student.getCin());
        student.setSchool(student.getSchool());
        return ResponseEntity.ok().body(Collections.singletonList(student));


    }




}