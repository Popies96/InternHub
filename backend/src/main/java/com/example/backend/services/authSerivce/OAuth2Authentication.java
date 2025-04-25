package com.example.backend.services.authSerivce;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;


@Component
public class OAuth2Authentication extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserServiceImpl userService;


    public OAuth2Authentication(JwtUtil jwtUtil, UserRepository userRepository, UserRepository userRepository1, UserServiceImpl userService) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository1;
        this.userService = userService;
    }

//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//                                        Authentication authentication) throws IOException {
//        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
//        String email = oAuth2User.getAttribute("email");
//        try {
//            UserDetails userDetails = userService.loadUserByUsername(email);
//            String token = jwtUtil.generateToken(userDetails);
//            response.setContentType("application/json");
//            new ObjectMapper().writeValue(response.getWriter(), Map.of("token", token));
//
//        } catch (UsernameNotFoundException e) {
//            response.setContentType("application/json");
//            new ObjectMapper().writeValue(response.getWriter(), Map.of("email", email, "newUser", true));
//        }
//
//
//    }


}
