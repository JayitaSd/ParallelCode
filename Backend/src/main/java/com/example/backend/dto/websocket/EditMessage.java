package com.example.backend.dto.websocket;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditMessage {
    private Long docId;
    private String content;
    private String username;
    private Long timestamp;

    public EditMessage() {
    }

    public EditMessage(Long docId, String content, String username, Long timestamp) {
        this.docId = docId;
        this.content = content;
        this.username = username;
        this.timestamp = timestamp;
    }

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
}
