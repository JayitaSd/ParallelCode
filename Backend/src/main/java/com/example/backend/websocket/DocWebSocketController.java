package com.example.backend.websocket;

import com.example.backend.dto.websocket.EditMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class DocWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ConcurrentHashMap<Long, String> docStore = new ConcurrentHashMap<>();

    public DocWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/edit")
    public void handleEdit(@Payload EditMessage message,
                           Principal principal) {

        if (principal == null) return;

        String username = principal.getName();

        // Apply change (last-write-wins)
        docStore.put(message.getDocId(), message.getContent());

        // Broadcast to all users in doc
        messagingTemplate.convertAndSend(
                "/topic/doc/" + message.getDocId(),
                message.getContent()
        );
    }

    // 🔥 JOIN DOCUMENT
    @MessageMapping("/join")
    public void joinDocument(@Payload EditMessage message,
                             Principal principal) {

        if (principal == null) return;

        String username = principal.getName();
        System.out.println("Principal: " + principal);
        String content = docStore.getOrDefault(message.getDocId(), "");

        // Send current doc ONLY to joining user
        messagingTemplate.convertAndSendToUser(
                username,
                "/queue/doc/" + message.getDocId(),
                content
        );
    }
}
