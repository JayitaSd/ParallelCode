package com.example.backend.websocket;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Track which users are connected to which document
 */
@Service
public class DocumentSessionRegistry {
    private static final Logger logger = LoggerFactory.getLogger(DocumentSessionRegistry.class);

    private final ConcurrentHashMap<Long, Set<String>> documentSessions = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Set<Long>> userSessions = new ConcurrentHashMap<>();

    /**
     * Register a user to a document session
     */
    public synchronized void registerUserSession(Long docId, String username) {
        documentSessions
                .computeIfAbsent(docId, k -> ConcurrentHashMap.newKeySet())
                .add(username);

        userSessions
                .computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet())
                .add(docId);

        logger.info("✅ User '{}' registered for document {} | Active users: {}",
                username, docId, getDocumentUsers(docId).size());
    }

    /**
     * Unregister a user from a document session
     */
    public synchronized void unregisterUserSession(Long docId, String username) {
        Set<String> users = documentSessions.get(docId);
        if (users != null) {
            users.remove(username);
            if (users.isEmpty()) {
                documentSessions.remove(docId);
                logger.info("✅ Document {} has no active users", docId);
            }
        }

        Set<Long> docs = userSessions.get(username);
        if (docs != null) {
            docs.remove(docId);
            if (docs.isEmpty()) {
                userSessions.remove(username);
            }
        }

        logger.info("✅ User '{}' unregistered from document {} | Active users: {}",
                username, docId, getDocumentUsers(docId).size());
    }

    /**
     * Get all users connected to a document
     */
    public Set<String> getDocumentUsers(Long docId) {
        return documentSessions.getOrDefault(docId, Collections.emptySet());
    }

    /**
     * Get all documents connected by a user
     */
    public Set<Long> getUserDocuments(String username) {
        return userSessions.getOrDefault(username, Collections.emptySet());
    }

    /**
     * Check if a user is connected to a document
     */
    public boolean isUserConnectedToDocument(Long docId, String username) {
        Set<String> users = documentSessions.get(docId);
        return users != null && users.contains(username);
    }

    /**
     * Get active document count
     */
    public int getActiveDocumentCount() {
        return documentSessions.size();
    }

    /**
     * Get all active document IDs
     */
    public Set<Long> getActiveDocumentIds() {
        return new java.util.HashSet<>(documentSessions.keySet());
    }

    /**
     * Get total active user sessions
     */
    public int getTotalActiveSessions() {
        return documentSessions.values().stream().mapToInt(Set::size).sum();
    }

    /**
     * Clear all sessions
     */
    public void clearAllSessions() {
        documentSessions.clear();
        userSessions.clear();
        logger.info("✅ All sessions cleared");
    }
}
