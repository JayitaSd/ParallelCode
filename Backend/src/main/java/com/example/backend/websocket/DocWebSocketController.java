package com.example.backend.websocket;

import com.example.backend.dto.websocket.EditMessage;
import com.example.backend.service.DocCollabService;
import com.example.backend.service.DocumentService;
import com.example.backend.service.RedisDocService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Replace ConcurrentHashMap with Redis service
 */
@Controller
public class DocWebSocketController {
    private static final Logger logger = LoggerFactory.getLogger(DocWebSocketController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final DocumentService documentService;
    private final RedisDocService redisDocService;
    private final DocCollabService collaborationService;

    public DocWebSocketController(
            SimpMessagingTemplate messagingTemplate,
            DocumentService documentService,
            RedisDocService redisDocService,
            DocCollabService collaborationService) {
        this.messagingTemplate = messagingTemplate;
        this.documentService = documentService;
        this.redisDocService = redisDocService;
        this.collaborationService = collaborationService;
    }

    @MessageMapping("/edit")
    public void handleEdit(@Payload EditMessage message,
                           SimpMessageHeaderAccessor headerAccessor) {

        String username = extractUsername(headerAccessor);

        if (username == null) {
            logger.error("❌ Username could not be extracted from headers");
            return;
        }

        message.setUsername(username);
        message.setTimestamp(System.currentTimeMillis());

        try {
            collaborationService.applyEditAndBroadcast(message);
            logger.info("✅ Edit broadcast from {} for document {}", username, message.getDocId());

        } catch (Exception e) {
            logger.error("❌ Failed to handle edit: {}", e.getMessage(), e);
            sendErrorToUser(username, message.getDocId(), "Edit failed");
        }
    }

    @MessageMapping("/join")
    public void joinDocument(@Payload EditMessage message,
                             SimpMessageHeaderAccessor headerAccessor) {

        String username = extractUsername(headerAccessor);

        if (username == null) {
            logger.error("❌ Username could not be extracted on join");
            return;
        }

        Long docId = message.getDocId();
        logger.info("✅ User {} joining document: {}", username, docId);

        try {
            collaborationService.handleUserJoinDocument(docId, username);

            String content = redisDocService.getDocumentFromCache(docId);

            if (content == null) {
                var docResponse = documentService.getDocumentById(docId);
                content = docResponse.getContent();
                redisDocService.saveDocumentToCache(docId, content);
            }

            EditMessage currentDoc = new EditMessage(
                    docId,
                    content,
                    "system",
                    System.currentTimeMillis()
            );

            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/doc/" + docId,
                    currentDoc
            );

            logger.info("✅ Sent document content to user: {} from cache/database", username);

        } catch (Exception e) {
            logger.error("❌ Failed to load document {}: {}", docId, e.getMessage(), e);
            sendErrorToUser(username, docId, "Failed to load document");
        }
    }

    @MessageMapping("/leave")
    public void leaveDocument(@Payload EditMessage message,
                              SimpMessageHeaderAccessor headerAccessor) {

        String username = extractUsername(headerAccessor);

        if (username == null) {
            logger.error("❌ Username could not be extracted on leave");
            return;
        }

        Long docId = message.getDocId();
        logger.info("✅ User {} leaving document: {}", username, docId);

        try {
            collaborationService.handleUserLeaveDocument(docId, username);
            logger.info("✅ User {} left document {}", username, docId);

        } catch (Exception e) {
            logger.error("❌ Failed to handle user leave: {}", e.getMessage(), e);
        }
    }

    /**
     * Extract username from WebSocket message headers
     */
    private String extractUsername(SimpMessageHeaderAccessor headerAccessor) {
        if (headerAccessor == null) {
            return null;
        }

        if (headerAccessor.getUser() != null) {
            return headerAccessor.getUser().getName();
        }

        if (headerAccessor.getSessionAttributes() != null) {
            return (String) headerAccessor.getSessionAttributes().get("username");
        }

        return null;
    }

    /**
     * Send error message to specific user
     */
    private void sendErrorToUser(String username, Long docId, String errorMsg) {
        try {
            EditMessage error = new EditMessage(docId, null, "error", System.currentTimeMillis());
            messagingTemplate.convertAndSendToUser(
                    username,
                    "/queue/doc/" + docId,
                    error
            );
        } catch (Exception e) {
            logger.error("❌ Failed to send error to user: {}", e.getMessage());
        }
    }
}
