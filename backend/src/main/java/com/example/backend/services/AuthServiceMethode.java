package com.example.backend.services;

import com.example.backend.dto.SignupRequest;
import com.example.backend.entity.Enterprise;
import com.example.backend.entity.Student;
import com.example.backend.entity.User;
import com.example.backend.entity.UserRole;
import com.example.backend.repository.EnterpriseRepository;
import com.example.backend.repository.StudentRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceMethode implements AuthService{
    private final StudentRepository studentRepository;
    private final EnterpriseRepository enterpriseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public AuthServiceMethode(StudentRepository studentRepository, EnterpriseRepository enterpriseRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.enterpriseRepository = enterpriseRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean createEtudiant(SignupRequest signupRequest) {
        //Check if etudiant already exist
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return false;
        }

        if (signupRequest.getRole() == null || signupRequest.getRole().isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }

        User user = new User();
        switch (signupRequest.getRole().toUpperCase()) {
            case "STUDENT":
                user = new Student();
                ((Student) user).setSchool(signupRequest.getSchool());
                ((Student) user).setCin(signupRequest.getCin());
                break;

            case "ENTERPRISE":
                user = new Enterprise();
                ((Enterprise) user).setCompanyName(signupRequest.getCompanyName());
                ((Enterprise) user).setCompanyAddress(signupRequest.getCompanyAddress());
                break;

            default:
                throw new IllegalArgumentException("Invalid role");
        }

        BeanUtils.copyProperties(signupRequest, user);

        if (signupRequest.getRole() != null) {
            user.setRole(UserRole.valueOf(signupRequest.getRole().toUpperCase()));
        }

        //Hash the password before saving
        String hashPassword = passwordEncoder.encode(signupRequest.getPassword());
        user.setPassword(hashPassword);
        userRepository.save(user);

        if (user instanceof Student) {
            studentRepository.save((Student) user);
        } else if (user instanceof Enterprise) {
            enterpriseRepository.save((Enterprise) user);
        }
        return true;
    }
}
