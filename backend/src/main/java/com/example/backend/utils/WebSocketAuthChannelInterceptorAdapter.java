package com.example.backend.utils;

import com.example.backend.services.authSerivce.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

@Component
public class WebSocketAuthChannelInterceptorAdapter implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Autowired
    public WebSocketAuthChannelInterceptorAdapter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);



        if (accessor == null) {
            return message;
        }

        // Handle CONNECT messages
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Get token from URL if it's passed as a query parameter
            String token = (String) accessor.getSessionAttributes().get("token");
            System.out.println("token: " + token);
            System.err.println("token: " + token);

            if (token == null || token.isEmpty()) {
                throw new MessagingException("Missing authorization token");
            }

            System.out.println("token: " + token);

            String username = jwtUtil.extractUsername(token);  // Extract the username from the token
            accessor.setUser(new UsernamePasswordAuthenticationToken(username, null, Collections.emptyList()));
        }

        // Handle SUBSCRIBE messages
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            Principal user = accessor.getUser();
            String destination = accessor.getDestination();

            if (user == null) {
                throw new AccessDeniedException("No user authenticated");
            }

            // Validate user-specific destinations
//            if (destination != null && destination.startsWith("/user/")) {
//                String requiredUser = destination.split("/")[2];  // Extract username from destination
//                if (!requiredUser.equals(user.getName())) {  // Ensure it matches the username
//                    throw new AccessDeniedException("User not authorized for this destination");
//                }
//            }
        }

        return message;
    }

}
