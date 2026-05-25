package com.example.backend.service;

import com.example.backend.dto.websocket.EditMessage;
import com.example.backend.dto.websocket.RedisDocMessage;
import com.example.backend.redis.RedisPublisher;
import com.example.backend.websocket.DocumentSessionRegistry;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Centralize collaboration logic (edit apply, broadcast, sync)
 */
@Service
public class DocCollabService {
    private static final Logger logger = LoggerFactory.getLogger(DocCollabService.class);

    private final RedisDocService redisDocService;
    private final RedisPublisher redisPublisher;
    private final DocumentSessionRegistry sessionRegistry;
    private final DocPersistenceService persistenceService;

    public DocCollabService(
            RedisDocService redisDocService,
            RedisPublisher redisPublisher,
            DocumentSessionRegistry sessionRegistry,
            DocPersistenceService persistenceService) {
        this.redisDocService = redisDocService;
        this.redisPublisher = redisPublisher;
        this.sessionRegistry = sessionRegistry;
        this.persistenceService = persistenceService;
    }

    /**
     * Apply an edit to a document and broadcast to other users
     */
    public void applyEditAndBroadcast(EditMessage editMessage) {
        try {
            Long docId = editMessage.getDocId();
            String content = editMessage.getContent();
            String username = editMessage.getUsername();

            if (docId == null || content == null || username == null) {
                logger.warn("❌ Invalid edit message: docId={}, content={}, username={}",
                        docId, content != null ? "provided" : "null", username);
                return;
            }

            // Store in Redis cache
            redisDocService.saveDocumentToCache(docId, content);
            redisDocService.storeEditMessage(docId, editMessage);

            // Create Redis publish message
            RedisDocMessage pubMessage = new RedisDocMessage(
                    docId,
                    content,
                    username,
                    System.currentTimeMillis(),
                    "edit"
            );

            // Publish to Redis for distributed broadcasting
            redisPublisher.publishDocumentUpdate(pubMessage);

            // Immediately persist to database for real-time updates
            persistenceService.persistDocumentContent(docId, content);

            logger.info("✅ Edit applied and broadcast for document {} by user {}",
                    docId, username);

        } catch (Exception e) {
            logger.error("❌ Failed to apply and broadcast edit: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle user joining a document
     */
    public void handleUserJoinDocument(Long docId, String username) {
        try {
            sessionRegistry.registerUserSession(docId, username);

            String cachedContent = redisDocService.getDocumentFromCache(docId);
            if (cachedContent == null) {
                cachedContent = persistenceService.loadDocumentContentFromDatabase(docId);
                if (cachedContent != null) {
                    redisDocService.saveDocumentToCache(docId, cachedContent);
                }
            }

            RedisDocMessage joinMessage = new RedisDocMessage(
                    docId,
                    null,
                    username,
                    System.currentTimeMillis(),
                    "join"
            );
            redisPublisher.publishDocumentUpdate(joinMessage);

            logger.info("✅ User {} joined document {} | Active users: {}",
                    username, docId, sessionRegistry.getDocumentUsers(docId).size());

        } catch (Exception e) {
            logger.error("❌ Failed to handle user join: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle user leaving a document
     */
    public void handleUserLeaveDocument(Long docId, String username) {
        try {
            sessionRegistry.unregisterUserSession(docId, username);

            int activeUsers = sessionRegistry.getDocumentUsers(docId).size();

            RedisDocMessage leaveMessage = new RedisDocMessage(
                    docId,
                    null,
                    username,
                    System.currentTimeMillis(),
                    "leave"
            );
            redisPublisher.publishDocumentUpdate(leaveMessage);

            if (activeUsers == 0) {
                persistDocumentIfNeeded(docId);
            }

            logger.info("✅ User {} left document {} | Remaining active users: {}",
                    username, docId, activeUsers);

        } catch (Exception e) {
            logger.error("❌ Failed to handle user leave: {}", e.getMessage(), e);
        }
    }

    /**
     * Synchronize document state across instances
     */
    public void syncDocumentState(Long docId) {
        try {
            String cachedContent = redisDocService.getDocumentFromCache(docId);

            if (cachedContent != null) {
                RedisDocMessage syncMessage = new RedisDocMessage(
                        docId,
                        cachedContent,
                        "system",
                        System.currentTimeMillis(),
                        "sync"
                );
                redisPublisher.publishDocumentUpdate(syncMessage);

                logger.info("✅ Document {} synchronized", docId);
            }
        } catch (Exception e) {
            logger.error("❌ Failed to sync document {}: {}", docId, e.getMessage(), e);
        }
    }

    /**
     * Persist document to database if needed
     */
    public void persistDocumentIfNeeded(Long docId) {
        try {
            String cachedContent = redisDocService.getDocumentFromCache(docId);

            if (cachedContent != null) {
                boolean persisted = persistenceService.persistDocumentContent(docId, cachedContent);
                if (persisted) {
                    logger.info("✅ Document {} persisted to database", docId);
                }
            }
        } catch (Exception e) {
            logger.error("❌ Failed to persist document {}: {}", docId, e.getMessage(), e);
        }
    }

    /**
     * Get all active users for a document
     */
    public java.util.Set<String> getDocumentUsers(Long docId) {
        return sessionRegistry.getDocumentUsers(docId);
    }

    /**
     * Check if user is connected to document
     */
    public boolean isUserConnected(Long docId, String username) {
        return sessionRegistry.isUserConnectedToDocument(docId, username);
    }

    /**
     * Get document statistics
     */
    public java.util.Map<String, Object> getDocumentStats(Long docId) {
        var stats = new java.util.HashMap<String, Object>();
        stats.put("docId", docId);
        stats.put("activeUsers", sessionRegistry.getDocumentUsers(docId).size());
        stats.put("cached", redisDocService.documentExistsInCache(docId));
        stats.put("lastTimestamp", redisDocService.getDocumentTimestamp(docId));
        return stats;
    }
}

