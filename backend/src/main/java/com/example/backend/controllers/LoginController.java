package com.example.backend.controllers;

import com.example.backend.dto.ForgotPasswordRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.entity.VerificationCode;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationCodeRepository;
import com.example.backend.services.EmailService;
import com.example.backend.services.ForgotPasswordService;
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
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
public class LoginController {
    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl etudiantService;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final ForgotPasswordService forgotPasswordService;
    private final JwtUtil jwtUtil;

    @Autowired
    public LoginController(AuthenticationManager authenticationManager, AuthService authService, OAuth2Authentication authentication, UserServiceImpl etudiantService, UserRepository userRepository, EmailService emailService, VerificationCodeRepository verificationCodeRepository, ForgotPasswordService forgotPasswordService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;

        this.etudiantService = etudiantService;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.verificationCodeRepository = verificationCodeRepository;
        this.forgotPasswordService = forgotPasswordService;
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
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check if user is verified
        if (!user.isVerified()) {
            // Resend verification email
            String verificationToken = generateRandomCode();
            LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(10);
            VerificationCode code = new VerificationCode();
            code.setCode(verificationToken);
            code.setExpirationDate(expirationDate);
            code.setIdentifier(user.getEmail());
            verificationCodeRepository.save(code);
            emailService.sendVerificationCode(user.getEmail() ,verificationToken);

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of(
                            "message", "Account not verified. A new verification email has been sent.",
                            "resend", true
                    )
            );
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


    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody ForgotPasswordRequest request) {
       try{ boolean isValid = forgotPasswordService.validateVerificationCode(request.getIdentifier(), request.getValidationCode());
        Map<String, Object> response = new HashMap<>();
        response.put("isValid", isValid);
        if (isValid) {
            User user = userRepository.findByEmail(request.getIdentifier())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            user.setVerified(true);
            userRepository.save(user);
            response.put("message", "Email verified successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to send verification not valid");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }  } catch (Exception e) {
           return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
       }




    }






    private String generateRandomCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);  // Generate a 6-digit number
        return String.valueOf(code);
    }


}
