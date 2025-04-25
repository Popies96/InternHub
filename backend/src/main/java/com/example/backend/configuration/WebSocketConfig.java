package com.example.backend.configuration;

import com.example.backend.entity.StompPrincipal;
import com.example.backend.utils.CustomHandshakeHandler;
import com.example.backend.utils.TokenHandshakeInterceptor;
import com.example.backend.utils.WebSocketAuthChannelInterceptorAdapter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import org.springframework.messaging.converter.DefaultContentTypeResolver;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


import java.security.Principal;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final CustomHandshakeHandler customHandshakeHandler;
    private final WebSocketAuthChannelInterceptorAdapter authInterceptor;
    private final TokenHandshakeInterceptor tokenInterceptor;

    @Autowired
    public WebSocketConfig(CustomHandshakeHandler customHandshakeHandler,
                           WebSocketAuthChannelInterceptorAdapter authInterceptor,
                           TokenHandshakeInterceptor tokenInterceptor) {
        this.customHandshakeHandler = customHandshakeHandler;
        this.authInterceptor = authInterceptor;
        this.tokenInterceptor = tokenInterceptor;
    }


    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/user","/topic");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")  // this matches ws://localhost:8088/ws
                .setHandshakeHandler(customHandshakeHandler)
                .addInterceptors(new TokenHandshakeInterceptor()) // extracts token
                .setAllowedOriginPatterns("*");
    }

    @Override
    public boolean configureMessageConverters(List<MessageConverter> messageConverters) {
        DefaultContentTypeResolver resolver = new DefaultContentTypeResolver();
        resolver.setDefaultMimeType(MimeTypeUtils.APPLICATION_JSON);
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setObjectMapper(new ObjectMapper());
        converter.setContentTypeResolver(resolver);
        messageConverters.add(converter);
        return false;
    }


    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(authInterceptor);
    }
}