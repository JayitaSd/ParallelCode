package com.example.backend.service;

import com.example.backend.dto.websocket.EditMessage;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

/**
 * Handle live document state storage/retrieval from Redis
 */
@Service
public class RedisDocService {
    private static final Logger logger = LoggerFactory.getLogger(RedisDocService.class);
    private static final String DOC_CONTENT_KEY_PREFIX = "doc:content:";
    private static final String DOC_TIMESTAMP_KEY_PREFIX = "doc:timestamp:";
    private static final long DOCUMENT_EXPIRY_HOURS = 24;

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisDocService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Store document content in Redis with expiry
     */
    public void saveDocumentToCache(Long docId, String content) {
        try {
            String contentKey = DOC_CONTENT_KEY_PREFIX + docId;
            String timestampKey = DOC_TIMESTAMP_KEY_PREFIX + docId;

            redisTemplate.opsForValue().set(contentKey, content);
            redisTemplate.opsForValue().set(timestampKey, System.currentTimeMillis());

            redisTemplate.expire(contentKey, DOCUMENT_EXPIRY_HOURS, TimeUnit.HOURS);
            redisTemplate.expire(timestampKey, DOCUMENT_EXPIRY_HOURS, TimeUnit.HOURS);

            logger.info("✅ Document {} cached in Redis", docId);
        } catch (Exception e) {
            logger.error("❌ Failed to cache document {} in Redis: {}", docId, e.getMessage(), e);
        }
    }

    /**
     * Retrieve document content from Redis cache
     */
    public String getDocumentFromCache(Long docId) {
        try {
            String contentKey = DOC_CONTENT_KEY_PREFIX + docId;
            Object cachedContent = redisTemplate.opsForValue().get(contentKey);

            if (cachedContent != null) {
                logger.info("✅ Retrieved document {} from Redis cache", docId);
                return cachedContent.toString();
            }
            return null;
        } catch (Exception e) {
            logger.error("❌ Failed to retrieve document {} from Redis: {}", docId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Update document timestamp in Redis
     */
    public void updateDocumentTimestamp(Long docId) {
        try {
            String timestampKey = DOC_TIMESTAMP_KEY_PREFIX + docId;
            String contentKey = DOC_CONTENT_KEY_PREFIX + docId;

            redisTemplate.opsForValue().set(timestampKey, System.currentTimeMillis());
            redisTemplate.expire(timestampKey, DOCUMENT_EXPIRY_HOURS, TimeUnit.HOURS);
            redisTemplate.expire(contentKey, DOCUMENT_EXPIRY_HOURS, TimeUnit.HOURS);

            logger.debug("✅ Updated timestamp for document {}", docId);
        } catch (Exception e) {
            logger.error("❌ Failed to update timestamp for document {}: {}", docId, e.getMessage(), e);
        }
    }

    /**
     * Get last update timestamp for a document
     */
    public Long getDocumentTimestamp(Long docId) {
        try {
            String timestampKey = DOC_TIMESTAMP_KEY_PREFIX + docId;
            Object timestamp = redisTemplate.opsForValue().get(timestampKey);

            if (timestamp != null) {
                return Long.parseLong(timestamp.toString());
            }
            return null;
        } catch (Exception e) {
            logger.error("❌ Failed to get timestamp for document {}: {}", docId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Check if document exists in Redis cache
     */
    public boolean documentExistsInCache(Long docId) {
        try {
            String contentKey = DOC_CONTENT_KEY_PREFIX + docId;
            Boolean exists = redisTemplate.hasKey(contentKey);
            return exists != null && exists;
        } catch (Exception e) {
            logger.error("❌ Failed to check document existence {}: {}", docId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Delete document from Redis cache
     */
    public void deleteDocumentFromCache(Long docId) {
        try {
            String contentKey = DOC_CONTENT_KEY_PREFIX + docId;
            String timestampKey = DOC_TIMESTAMP_KEY_PREFIX + docId;

            redisTemplate.delete(contentKey);
            redisTemplate.delete(timestampKey);

            logger.info("✅ Deleted document {} from Redis cache", docId);
        } catch (Exception e) {
            logger.error("❌ Failed to delete document {} from Redis: {}", docId, e.getMessage(), e);
        }
    }

    /**
     * Store an EditMessage object in Redis for quick access
     */
    public void storeEditMessage(Long docId, EditMessage message) {
        try {
            String key = "doc:message:" + docId;
            redisTemplate.opsForValue().set(key, message);
            redisTemplate.expire(key, DOCUMENT_EXPIRY_HOURS, TimeUnit.HOURS);
            logger.debug("✅ Stored EditMessage for document {}", docId);
        } catch (Exception e) {
            logger.error("❌ Failed to store EditMessage for document {}: {}", docId, e.getMessage(), e);
        }
    }

    /**
     * Retrieve the last EditMessage for a document
     */
    public EditMessage getLastEditMessage(Long docId) {
        try {
            String key = "doc:message:" + docId;
            Object msg = redisTemplate.opsForValue().get(key);
            if (msg instanceof EditMessage) {
                return (EditMessage) msg;
            }
            return null;
        } catch (Exception e) {
            logger.error("❌ Failed to retrieve EditMessage for document {}: {}", docId, e.getMessage(), e);
            return null;
        }
    }
}
