package com.example.backend.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketPrincipalConfig implements WebSocketMessageBrokerConfigurer {
    private final UserChannelInterceptor userChannelInterceptor;
    public WebSocketPrincipalConfig(UserChannelInterceptor userChannelInterceptor) {
        this.userChannelInterceptor = userChannelInterceptor;
    }
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(userChannelInterceptor);
    }
}
