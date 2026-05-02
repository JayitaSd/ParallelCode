package com.example.backend.websocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;

public class UserChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        if(StompCommand.CONNECT.equals(accessor.getCommand())) {
            String username =(String) accessor.getSessionAttributes().get("username");
            if(username!=null) {
                accessor.setUser(new StompPrincipal(username));
            }
        }
        return message;
    }
}
