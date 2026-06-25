package com.example.backend.dto.document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class DocResponse {
    private Long id;
    private String title;
    private String content;
    private String language;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String owner_username;
    private List<String> members;
    private Set<String> activeUsers = new HashSet<>();

    public DocResponse() {
    }

    public DocResponse(Long id, String title, String content, String language, LocalDateTime createdAt, LocalDateTime updatedAt, String owner_username, List<String> members,  Set<String> activeUsers) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.language = language;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.owner_username = owner_username;
        this.members = members;
        this.activeUsers = activeUsers;
    }
    public DocResponse(Long id, String title, String content, String language, LocalDateTime createdAt, LocalDateTime updatedAt, String owner_username, List<String> members) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.language = language;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.owner_username = owner_username;
        this.members = members;
    }


    // ... existing code...
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getOwner_username() {
        return owner_username;
    }

    public void setOwner_username(String owner_username) {
        this.owner_username = owner_username;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public Set<String> getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(Set<String> activeUsers) {
        this.activeUsers = activeUsers;
    }
}
