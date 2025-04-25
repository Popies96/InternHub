package com.example.backend.services;

import com.example.backend.entity.User;
import com.example.backend.entity.VerificationCode;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class ForgotPasswordService {
    @Autowired
    private UserRepository userRepository;
   @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private EmailService emailService;
    public boolean generateVerificationCode(String identifier, String method) {
        try {

            String verificationCode = generateRandomCode();


            LocalDateTime expirationDate = LocalDateTime.now().plusMinutes(10);


            VerificationCode code = new VerificationCode();
            code.setCode(verificationCode);
            code.setExpirationDate(expirationDate);
            code.setIdentifier(identifier);

            verificationCodeRepository.save(code);


            if ("email".equalsIgnoreCase(method)) {
                emailService.sendVerificationCode(identifier, verificationCode);  // Delegate to EmailService
            } else if ("sms".equalsIgnoreCase(method)) {

            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    private String generateRandomCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);  // Generate a 6-digit number
        return String.valueOf(code);
    }
    public boolean validateVerificationCode(String identifier, String validationCode) {
        System.out.println(identifier);
        Optional<VerificationCode> codeOptional = verificationCodeRepository.findByIdentifier(identifier);

        if (codeOptional.isPresent()) {
            VerificationCode code = codeOptional.get();
            if (code.getExpirationDate().isBefore(LocalDateTime.now())) {
                System.out.println("is expired");
                return false;
            }

            // Check if the code matches
            System.out.println("Stored Code: " + code.getCode());
            System.out.println("Validation Code: " + validationCode);
            return code.getCode().equals(validationCode);
        }

        return false;
    }

    public boolean resetPassword(String identifier, String newPassword) {
            Optional<User> userOptional = userRepository.findByEmail(identifier);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            }
        return false;
    }
}
