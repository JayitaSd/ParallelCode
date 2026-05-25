package com.example.backend.service;

import com.example.backend.entity.Document;
import com.example.backend.repo.DocRepo;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

/**
 * Save Redis document state into PostgreSQL
 */
@Service
public class DocPersistenceService {
    private static final Logger logger = LoggerFactory.getLogger(DocPersistenceService.class);
    private final DocRepo docRepo;

    public DocPersistenceService(DocRepo docRepo) {
        this.docRepo = docRepo;
    }

    /**
     * Persist document content from cache to database
     */
    public boolean persistDocumentContent(Long docId, String content) {
        try {
            Optional<Document> docOptional = docRepo.findById(docId);

            if (docOptional.isEmpty()) {
                logger.warn("⚠️ Document {} not found in database for persistence", docId);
                return false;
            }

            Document document = docOptional.get();
            document.setContent(content);
            docRepo.save(document);

            logger.info("✅ Persisted document {} to database | Content length: {} chars",
                    docId, content != null ? content.length() : 0);
            return true;
        } catch (Exception e) {
            logger.error("❌ Failed to persist document {}: {}", docId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * Batch persist multiple documents
     */
    public void persistMultipleDocuments(java.util.Map<Long, String> documentMap) {
        documentMap.forEach((docId, content) -> {
            try {
                persistDocumentContent(docId, content);
            } catch (Exception e) {
                logger.error("❌ Failed to persist document {} during batch operation: {}", docId, e.getMessage());
            }
        });
    }

    /**
     * Load document content from database
     */
    public String loadDocumentContentFromDatabase(Long docId) {
        try {
            Optional<Document> docOptional = docRepo.findById(docId);

            if (docOptional.isEmpty()) {
                logger.warn("⚠️ Document {} not found in database", docId);
                return null;
            }

            String content = docOptional.get().getContent();
            logger.info("✅ Loaded document {} from database | Content length: {} chars",
                    docId, content != null ? content.length() : 0);
            return content;
        } catch (Exception e) {
            logger.error("❌ Failed to load document {} from database: {}", docId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Check if document exists in database
     */
    public boolean documentExistsInDatabase(Long docId) {
        try {
            return docRepo.existsById(docId);
        } catch (Exception e) {
            logger.error("❌ Failed to check document existence {}: {}", docId, e.getMessage(), e);
            return false;
        }
    }
}
