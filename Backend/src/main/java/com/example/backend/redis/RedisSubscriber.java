package com.example.backend.redis;

import com.example.backend.dto.websocket.RedisDocMessage;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Receive document updates from Redis Pub/Sub
 */
@Service
public class RedisSubscriber {
    private static final Logger logger = LoggerFactory.getLogger(RedisSubscriber.class);
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisSubscriber(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Subscribe to a document's updates
     */
    public void subscribeToDocument(Long docId) {
        String channel = "doc:" + docId + ":updates";
        logger.info("📢 Subscribed to document updates: {}", channel);
    }

    /**
     * Unsubscribe from a document's updates
     */
    public void unsubscribeFromDocument(Long docId) {
        String channel = "doc:" + docId + ":updates";
        logger.info("📢 Unsubscribed from document updates: {}", channel);
    }
}
