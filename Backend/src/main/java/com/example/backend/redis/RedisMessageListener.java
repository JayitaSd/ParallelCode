package com.example.backend.redis;

import com.example.backend.dto.websocket.RedisDocMessage;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.databind.ObjectMapper;

/**
 * Listen for Redis messages and forward them to WebSocket clients
 */
@Service
public class RedisMessageListener implements MessageListener {
    private static final Logger logger = LoggerFactory.getLogger(RedisMessageListener.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public RedisMessageListener(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Handle incoming Redis Pub/Sub messages
     */
    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String payload = new String(message.getBody());
            RedisDocMessage docMessage = objectMapper.readValue(payload, RedisDocMessage.class);

            if (docMessage == null || docMessage.getDocId() == null) {
                logger.warn("❌ Invalid or null message received from Redis");
                return;
            }

            String destination = "/topic/doc/" + docMessage.getDocId();
            messagingTemplate.convertAndSend(destination, docMessage);

            logger.info("✅ Forwarded Redis message to WebSocket: {}  Action: {}",
                    destination, docMessage.getAction());

        } catch (Exception e) {
            logger.error("❌ Error processing Redis message: {}", e.getMessage(), e);
        }
    }
}
