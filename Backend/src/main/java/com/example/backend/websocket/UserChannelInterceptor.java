package com.example.backend.websocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
public class UserChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // Set principal on CONNECT
        if(StompCommand.CONNECT.equals(accessor.getCommand())) {
            String username =(String) accessor.getSessionAttributes().get("username");
            if(username!=null) {
                accessor.setUser(new StompPrincipal(username));
                System.out.println("✅ Principal set on CONNECT: " + username);
            }else{
                System.out.println("⚠️ No username in session attributes");
            }
        }
        // For other messages (SEND, SUBSCRIBE, etc), fetch from session attributes and set principal
        else {
            String username = (String) accessor.getSessionAttributes().get("username");
            if(username != null && accessor.getUser() == null) {
                accessor.setUser(new StompPrincipal(username));
                System.out.println("✅ Principal set on " + accessor.getCommand() + ": " + username);
            }
        }

        return message;
    }
}
