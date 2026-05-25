package com.example.backend.dto.websocket;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;

/**
 * Standard message object for Redis Pub/Sub communication
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RedisDocMessage implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long docId;
    private String content;
    private String username;
    private Long timestamp;
    private String action;
    private String messageId;

    public RedisDocMessage() {
    }

    public RedisDocMessage(Long docId, String content, String username, Long timestamp, String action) {
        this.docId = docId;
        this.content = content;
        this.username = username;
        this.timestamp = timestamp;
        this.action = action;
        this.messageId = System.nanoTime() + "-" + username;
    }

    // Getters and Setters
    public Long getDocId() {
        return docId;
    }

    public void setDocId(Long docId) {
        this.docId = docId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    @Override
    public String toString() {
        return "RedisDocMessage{" +
                "docId=" + docId +
                ", username='" + username + '\'' +
                ", timestamp=" + timestamp +
                ", action='" + action + '\'' +
                ", messageId='" + messageId + '\'' +
                '}';
    }
}
