package com.example.backend.websocket;

import com.example.backend.dto.websocket.EditMessage;
import com.example.backend.service.DocumentService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.concurrent.ConcurrentHashMap;

@Controller
public class DocWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;
    private final DocumentService documentService;
    private final ConcurrentHashMap<Long, EditMessage> docStore = new ConcurrentHashMap<>();

    public DocWebSocketController(SimpMessagingTemplate messagingTemplate, DocumentService documentService) {
        this.messagingTemplate = messagingTemplate;
        this.documentService = documentService;
    }

    @MessageMapping("/edit")
    public void handleEdit(@Payload EditMessage message,
                           SimpMessageHeaderAccessor headerAccessor) {

        // Extract username from message headers
        String username = null;

        if (headerAccessor.getUser() != null) {
            username = headerAccessor.getUser().getName();
        } else if (headerAccessor.getSessionAttributes() != null) {
            username = (String) headerAccessor.getSessionAttributes().get("username");
        }

        if (username == null) {
            System.out.println("❌ Username could not be extracted from headers");
            return;
        }

        // Enrich message with username and timestamp
        message.setUsername(username);
        message.setTimestamp(System.currentTimeMillis());

        // Store in memory
        docStore.put(message.getDocId(), message);

        // ✅ PERSIST TO DATABASE
        try {
            documentService.updateDocumentContent(message.getDocId(), message.getContent());
            System.out.println("✅ Document " + message.getDocId() + " saved to database");
        } catch (Exception e) {
            System.out.println("❌ Failed to save document to database: " + e.getMessage());
        }

        // Broadcast to ALL users subscribed to this document
        messagingTemplate.convertAndSend(
                "/topic/doc/" + message.getDocId(),
                message
        );
        System.out.println("✅ Broadcasting edit from " + username + " to /topic/doc/" + message.getDocId());
    }

    // 🔥 JOIN DOCUMENT
    @MessageMapping("/join")
    public void joinDocument(@Payload EditMessage message,
                             SimpMessageHeaderAccessor headerAccessor) {

        // Extract username from message headers
        String username = null;

        if (headerAccessor.getUser() != null) {
            username = headerAccessor.getUser().getName();
        } else if (headerAccessor.getSessionAttributes() != null) {
            username = (String) headerAccessor.getSessionAttributes().get("username");
        }

        if (username == null) {
            System.out.println("❌ Username could not be extracted on join");
            return;
        }

        Long docId = message.getDocId();
        System.out.println("✅ User " + username + " joining document: " + docId);

        try {
            // Load document from database
            var docResponse = documentService.getDocumentById(docId);

            // Create response message with database content
            EditMessage currentDoc = new EditMessage(
                    docId,
                    docResponse.getContent(),
                    docResponse.getOwner_username(),
                    System.currentTimeMillis()
            );

            // Also cache in memory for faster subsequent access
            docStore.put(docId, currentDoc);

            // Send current doc ONLY to joining user via private queue
            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/doc/" + docId,
                    currentDoc
            );
            System.out.println("✅ Sent document content to user: " + username + " from database");
        } catch (Exception e) {
            System.out.println("❌ Failed to load document " + docId + ": " + e.getMessage());
            // Send error message to user
            EditMessage errorMsg = new EditMessage(docId, null, "error", System.currentTimeMillis());
            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/doc/" + docId,
                    errorMsg
            );
        }
    }
}
