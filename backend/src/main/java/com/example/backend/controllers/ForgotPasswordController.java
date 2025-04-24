package com.example.backend.controllers;

import com.example.backend.dto.ForgotPasswordRequest;
import com.example.backend.services.EmailService;
import com.example.backend.services.ForgotPasswordService;
import com.example.backend.services.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/forgotPassword")
public class ForgotPasswordController {
    @Autowired
    private ForgotPasswordService forgotPasswordService;  // Service for user management
    @Autowired
    private EmailService emailService; // Service for sending emails
    @Autowired
    private SmsService smsService; // Service for sending SMS

    // Step 1: Send a validation code to either email or SMS
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> requestResetPassword(@RequestBody ForgotPasswordRequest request) {
        boolean success = forgotPasswordService.generateVerificationCode(request.getIdentifier(), request.getMethod());

        Map<String, Object> response = new HashMap<>();
        response.put("success", success);

        if (success) {
            response.put("message", "Verification code sent successfully via " + request.getMethod());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to send verification code");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateVerificationCode(@RequestBody ForgotPasswordRequest request) {
        System.out.println(request.getValidationCode());
        boolean isValid = forgotPasswordService.validateVerificationCode(request.getIdentifier(), request.getValidationCode());
        Map<String, Object> response = new HashMap<>();
        response.put("isValid", isValid);
        if (isValid) {
            response.put("message", "Verification code is valid ");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to send verification not valid");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ForgotPasswordRequest request ) {
        boolean resetSuccess = forgotPasswordService.resetPassword(request.getIdentifier(),request.getNewPassword());
        Map<String, Object> response = new HashMap<>();

        if (resetSuccess) {
            response.put("message", "Verification code is valid ");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to send verification not valid");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
