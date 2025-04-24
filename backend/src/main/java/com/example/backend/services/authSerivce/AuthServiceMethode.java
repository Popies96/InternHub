package com.example.backend.services.authSerivce;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
    public User createEtudiant(SignupRequest signupRequest) {
        //Check if etudiant already exist
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return null;
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
        user.setPhone(signupRequest.getPhone());
        user.setNom(signupRequest.getNom());
        user.setPrenom(signupRequest.getPrenom());
        if (signupRequest.getRole() != null) {
            user.setRole(UserRole.valueOf(signupRequest.getRole().toUpperCase()));
        }

        //Hash the password before saving
        String hashPassword = passwordEncoder.encode(signupRequest.getPassword());
        user.setPassword(hashPassword);
        System.out.println(user.getEmail());
        userRepository.save(user);

        if (user instanceof Student) {
            studentRepository.save((Student) user);
        } else if (user instanceof Enterprise) {
            enterpriseRepository.save((Enterprise) user);
        }
        return user;
    }
    public User updateUser(SignupRequest signupRequest, OAuth2AuthenticationToken auth2AuthenticationToken) {
        // Find the user by email
        OAuth2User oAuth2User = auth2AuthenticationToken.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        User existingUser = userRepository.findByEmail(email).orElse(null);
        System.out.println(existingUser);
        if (existingUser == null) {
            return null;
        }

        existingUser.setPhone(signupRequest.getPhone());
        existingUser.setNom(name);

        if (signupRequest.getRole() != null && !signupRequest.getRole().isEmpty()) {
            existingUser.setRole(UserRole.valueOf(signupRequest.getRole().toUpperCase()));

            switch (signupRequest.getRole().toUpperCase()) {
                case "STUDENT":
                        Student student = new Student();
                        BeanUtils.copyProperties(existingUser, student);
                        student.setSchool(signupRequest.getSchool());
                        student.setCin(signupRequest.getCin());
                        existingUser = student;
                    break;

                case "ENTERPRISE":
                        Enterprise enterprise = new Enterprise();
                        enterprise.setCompanyName(signupRequest.getCompanyName());
                        enterprise.setCompanyAddress(signupRequest.getCompanyAddress());
                        existingUser = enterprise;

                    break;

                default:
                    throw new IllegalArgumentException("Invalid role");
            }
        }
        userRepository.save(existingUser);
        if (existingUser instanceof Student) {
            studentRepository.save((Student) existingUser);
        } else if (existingUser instanceof Enterprise) {
            enterpriseRepository.save((Enterprise) existingUser);
        }
        // Save the updated user

        return existingUser;
    }

}
