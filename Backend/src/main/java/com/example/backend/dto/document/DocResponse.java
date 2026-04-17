package com.example.backend.dto.document;

import java.util.List;

public class DocResponse {
    private Long id;
    private String title;
    private String content;
    private String owner_username;
    private List<String> members;

    public DocResponse() {
    }

    public DocResponse(Long id, String title, String content, String owner_username, List<String> members) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.owner_username = owner_username;
        this.members = members;
    }

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
}
