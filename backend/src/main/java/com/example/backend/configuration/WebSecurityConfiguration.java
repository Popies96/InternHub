package com.example.backend.configuration;

import com.example.backend.entity.User;
import com.example.backend.services.authSerivce.UserServiceImpl;
import com.example.backend.utils.JwtAuthenticationFilter;
import com.example.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public WebSecurityConfiguration(JwtAuthenticationFilter jwtAuthenticationFilter, UserServiceImpl userService, JwtUtil jwtUtil) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userService = userService;

        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity security ) throws Exception {
        security
                .cors()  // Enable CORS
                .and()
                .csrf().disable()
                .headers()
                .addHeaderWriter(
                        new StaticHeadersWriter("Access-Control-Allow-Origin", "http://localhost:4200")
                ).and()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login","/signup","/forgotPassword/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/internship/**").hasAnyRole("ENTERPRISE", "STUDENT")
                        .requestMatchers("/student/**").hasRole("STUDENT")
                        .requestMatchers("/internshipAi/**").hasRole("STUDENT")
                        .anyRequest().authenticated()
                )

                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
//                .oauth2Login(oauth2 -> oauth2
//                        .successHandler((request, response, authentication) -> {
//                            System.out.println("OAuth2 Login Success: " + authentication.getPrincipal());
//                            User user = userService.loginRegisterByGoogleOAuth2((OAuth2AuthenticationToken) authentication);
//                            System.out.println(user.getRole());
//
//
//                            if (user.getRole() == null){
//                              String token =  jwtUtil.generateTokenWithoutRole((OAuth2AuthenticationToken) authentication);
//                                response.sendRedirect("http://localhost:4200/onboard?token=" + token);
//
//                            }else {
//                                UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
//                                System.out.println(userDetails.getUsername());
//                                String token =  jwtUtil.generateToken(userDetails);
//                                response.sendRedirect("http://localhost:4200/dashboard?token=" + token);
//
//                            }
//
//                        })
//                        .failureUrl("/loginFailure"))
//                .logout(logout -> logout
//                        .logoutUrl("/logout")
//                        .logoutSuccessUrl("/login/local") // Redirect to homepage after logout
//                        .invalidateHttpSession(true)
//                        .clearAuthentication(true)
//                        .deleteCookies("JSESSIONID")
//                        .permitAll())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return security.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
       return configuration.getAuthenticationManager();
    }
}
