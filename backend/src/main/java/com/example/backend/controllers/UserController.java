package com.example.backend.controllers;

import com.example.backend.dto.SignupRequest;
import com.example.backend.dto.UserRequest;
import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Student;
import com.example.backend.entity.User;
import com.example.backend.repository.EnterpriseRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.authSerivce.UserServiceImpl;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private EnterpriseRepository enterpriseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  UserServiceImpl userService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/get")
    public ResponseEntity<User> getUser() {
        User user = userService.getAuthenticatedUser();
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
            return req;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(userRequests);
    }

    @GetMapping("/email")
    public ResponseEntity<UserRequest> getUserByEmail(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        UserRequest userRequest = new UserRequest();

        // Set common fields for all user types
        userRequest.setId(user.getId());
        userRequest.setNom(user.getNom());
        userRequest.setPrenom(user.getPrenom());
        userRequest.setEmail(user.getEmail());
        userRequest.setPassword(user.getPassword());
        userRequest.setPhone(user.getPhone());
        userRequest.setRole(user.getRole().toString());

        // Set role-specific fields
        if (user instanceof Student) {
            Student student = (Student) user;
            userRequest.setSchool(student.getSchool());
            userRequest.setCin(student.getCin());
        } else if (user instanceof Enterprise) {
            Enterprise enterprise = (Enterprise) user;
            userRequest.setCompanyName(enterprise.getCompanyName());
            userRequest.setCompanyAddress(enterprise.getCompanyAddress());
        }

        return ResponseEntity.ok().body(userRequest);
    }

    @PutMapping("/update")
    public ResponseEntity<UserRequest> updateUser(
            @RequestBody UserRequest updateRequest) {

        User user = userService.getAuthenticatedUser();
        user.setNom(updateRequest.getNom());
        user.setPrenom(updateRequest.getPrenom());
        user.setPhone(updateRequest.getPhone());
        user.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
        userRepository.save(user);
        //  role-specific updates
        if (user instanceof Student student) {
            student.setSchool(updateRequest.getSchool());
            student.setCin(updateRequest.getCin());
            studentRepository.save((Student) user);
        }
        else if (user instanceof Enterprise enterprise) {

            enterprise.setCompanyName(updateRequest.getCompanyName());
            enterprise.setCompanyAddress(updateRequest.getCompanyAddress());
            enterpriseRepository.save((Enterprise) user);
        }
        UserRequest userRequest = new UserRequest();
        userRequest.setId(user.getId());
        userRequest.setNom(user.getNom());
        userRequest.setPrenom(user.getPrenom());
        userRequest.setEmail(user.getEmail());
        userRequest.setPassword(user.getPassword());
        userRequest.setPhone(user.getPhone());
        userRequest.setRole(user.getRole().toString());
        return ResponseEntity.ok(userRequest);
    }

}