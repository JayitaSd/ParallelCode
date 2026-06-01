package com.example.backend.dto.document;

import jakarta.validation.constraints.NotBlank;

public class DocRequest {
    @NotBlank(message="Title is required")
    private String title;
    private String content;
    private String language;

    public DocRequest() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLanguage() {
        return language != null ? language : "javascript";
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
