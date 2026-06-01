package com.example.backend.service;

import com.example.backend.dto.document.DocRequest;
import com.example.backend.dto.document.DocResponse;
import com.example.backend.entity.Document;
import com.example.backend.entity.DocumentMember;
import com.example.backend.entity.User;
import com.example.backend.repo.DocRepo;
import com.example.backend.repo.UserRepo;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Integrate Redis + persistence logic
 */
@Service
public class DocumentService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private final UserRepo userRepo;
    private final DocRepo docRepo;
    private final RedisDocService redisDocService;
    private final DocPersistenceService persistenceService;

    public DocumentService(
            UserRepo userRepo,
            DocRepo docRepo,
            RedisDocService redisDocService,
            DocPersistenceService persistenceService) {
        this.userRepo = userRepo;
        this.docRepo = docRepo;
        this.redisDocService = redisDocService;
        this.persistenceService = persistenceService;
    }

    public DocResponse createDocument(DocRequest docRequest, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Document document = new Document(docRequest.getTitle(), docRequest.getContent(), user);
        document.setLanguage(docRequest.getLanguage());
        docRepo.save(document);

        redisDocService.saveDocumentToCache(document.getId(), document.getContent());

        return new DocResponse(
                document.getId(),
                document.getTitle(),
                document.getContent(),
                document.getLanguage(),
                document.getCreatedAt(),
                document.getUpdatedAt(),
                user.getUsername(),
                List.of()
        );
    }

    public DocResponse getDocumentById(Long id) {
        Document document = docRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        List<String> members = document.getMembers()
                .stream()
                .map(m -> m.getUser().getUsername())
                .collect(Collectors.toList());
        return new DocResponse(
                document.getId(),
                document.getTitle(),
                document.getContent(),
                document.getLanguage(),
                document.getCreatedAt(),
                document.getUpdatedAt(),
                document.getOwner().getUsername(),
                members
        );
    }

    public void addMembers(Long id, String username) {
        Document document = docRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        DocumentMember member = new DocumentMember(document, user);
        document.getMembers().add(member);
        docRepo.save(document);
    }

    /**
     * Get all documents owned by the user
     */
    public List<DocResponse> getUserDocuments(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Document> documents = docRepo.findByOwner(user);
        return documents.stream()
                .map(document -> {
                    List<String> members = document.getMembers()
                            .stream()
                            .map(m -> m.getUser().getUsername())
                            .collect(Collectors.toList());
                    return new DocResponse(
                            document.getId(),
                            document.getTitle(),
                            document.getContent(),
                            document.getLanguage(),
                            document.getCreatedAt(),
                            document.getUpdatedAt(),
                            document.getOwner().getUsername(),
                            members
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * Update document content with Redis + database persistence
     */
    public void updateDocumentContent(Long docId, String content) {
        try {
            Document document = docRepo.findById(docId)
                    .orElseThrow(() -> new RuntimeException("Document not found"));
            document.setContent(content);
            docRepo.save(document);

            redisDocService.saveDocumentToCache(docId, content);

            logger.info("✅ Document {} content updated and cached", docId);
        } catch (Exception e) {
            logger.error("❌ Failed to update document {}: {}", docId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Get document content, preferring Redis cache
     */
    public String getDocumentContent(Long docId) {
        String cachedContent = redisDocService.getDocumentFromCache(docId);
        if (cachedContent != null) {
            logger.debug("✅ Retrieved document {} from Redis cache", docId);
            return cachedContent;
        }

        String dbContent = persistenceService.loadDocumentContentFromDatabase(docId);
        if (dbContent != null) {
            redisDocService.saveDocumentToCache(docId, dbContent);
        }
        return dbContent;
    }
    public void deleteDocument(Long id, String username) {
        Document doc = docRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!doc.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this document");
        }

        docRepo.delete(doc);
    }
}
