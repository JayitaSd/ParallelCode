package com.example.backend.redis;

import com.example.backend.dto.websocket.RedisDocMessage;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Publish document updates to Redis channels
 */
@Service
public class RedisPublisher {
    private static final Logger logger = LoggerFactory.getLogger(RedisPublisher.class);
    private final RedisTemplate<String, Object> redisTemplate;

    public RedisPublisher(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Publish a document update message to Redis
     */
    public void publishDocumentUpdate(RedisDocMessage message) {
        try {
            String channel = "doc:" + message.getDocId() + ":updates";
            redisTemplate.convertAndSend(channel, message);
            logger.info("✅ Published message to channel: {} | Action: {} | User: {}",
                    channel, message.getAction(), message.getUsername());
        } catch (Exception e) {
            logger.error("❌ Failed to publish document update: {}", e.getMessage(), e);
        }
    }

    /**
     * Publish a message to a specific channel
     */
    public void publishToChannel(String channel, RedisDocMessage message) {
        try {
            redisTemplate.convertAndSend(channel, message);
            logger.info("✅ Published to channel: {}", channel);
        } catch (Exception e) {
            logger.error("❌ Failed to publish to channel {}: {}", channel, e.getMessage(), e);
        }
    }

    /**
     * Broadcast to all instances
     */
    public void broadcastSync(RedisDocMessage message) {
        publishDocumentUpdate(message);
    }
}
