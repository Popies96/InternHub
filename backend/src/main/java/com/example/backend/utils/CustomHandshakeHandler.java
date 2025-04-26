package com.example.backend.utils;

import com.example.backend.entity.StompPrincipal;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String token = (String) attributes.get("token");

        if (token != null && JwtUtil.validateTokenStatic(token)) {
            String username = JwtUtil.extractUsernameStatic(token);
            return new StompPrincipal(username);
        }

        return null; // denies the connection
    }


}