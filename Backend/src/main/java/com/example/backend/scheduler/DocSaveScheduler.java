package com.example.backend.scheduler;

import com.example.backend.service.DocCollabService;
import com.example.backend.service.RedisDocService;
import com.example.backend.websocket.DocumentSessionRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Periodically persist active Redis documents into PostgreSQL
 */
@Service
@EnableScheduling
@ConditionalOnProperty(
        name = "app.document.persistence.enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class DocSaveScheduler {
    private static final Logger logger = LoggerFactory.getLogger(DocSaveScheduler.class);

    private final DocCollabService collaborationService;
    private final RedisDocService redisDocService;
    private final DocumentSessionRegistry sessionRegistry;

    @Value("${app.document.persistence.interval:30000}")
    private long persistenceInterval;

    public DocSaveScheduler(
            DocCollabService collaborationService,
            RedisDocService redisDocService,
            DocumentSessionRegistry sessionRegistry) {
        this.collaborationService = collaborationService;
        this.redisDocService = redisDocService;
        this.sessionRegistry = sessionRegistry;
    }

    /**
     * Scheduled task to persist active documents from Redis to database
     */
    @Scheduled(fixedRateString = "${app.document.persistence.interval:30000}")
    public void persistActiveDocuments() {
        try {
            logger.debug("🔄 Starting document persistence scheduler...");

            int activeDocCount = sessionRegistry.getActiveDocumentCount();

            if (activeDocCount == 0) {
                logger.debug("⏭️  No active documents to persist");
                return;
            }

            // Get all active document IDs and persist them
            java.util.Set<Long> activeDocIds = sessionRegistry.getActiveDocumentIds();

            logger.info("📝 Persisting {} active documents to database", activeDocCount);

            int persistedCount = 0;
            for (Long docId : activeDocIds) {
                try {
                    collaborationService.persistDocumentIfNeeded(docId);
                    persistedCount++;
                } catch (Exception e) {
                    logger.error("❌ Failed to persist document {}: {}", docId, e.getMessage());
                }
            }

            logger.info("✅ Successfully persisted {} out of {} documents", persistedCount, activeDocCount);

        } catch (Exception e) {
            logger.error("❌ Error in document persistence scheduler: {}", e.getMessage(), e);
        }
    }

    /**
     * Persist a specific document immediately
     */
    public void persistDocumentNow(Long docId) {
        try {
            collaborationService.persistDocumentIfNeeded(docId);
            logger.info("✅ Document {} persisted immediately", docId);
        } catch (Exception e) {
            logger.error("❌ Failed to persist document {} immediately: {}", docId, e.getMessage(), e);
        }
    }
}
