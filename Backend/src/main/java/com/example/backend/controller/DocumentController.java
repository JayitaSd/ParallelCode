package com.example.backend.controller;

import com.example.backend.dto.document.DocRequest;
import com.example.backend.dto.document.DocResponse;
import com.example.backend.service.DocumentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents")
public class DocumentController {
    private final DocumentService documentService;
    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    //get all documents for current user
    @GetMapping
    public ResponseEntity<List<DocResponse>> getAllDocuments(Authentication auth) {
        String username = auth.getName();
        List<DocResponse> documents = documentService.getUserDocuments(username);
        return ResponseEntity.ok(documents);
    }

    //create document
    @PostMapping("/create")
    public ResponseEntity<DocResponse> createDocument(@Valid @RequestBody DocRequest docRequest, Authentication auth) {
        String username = auth.getName();
        DocResponse docResponse = documentService.createDocument(docRequest, username);
        return ResponseEntity.ok(docResponse);
    }
    //get document by id
    @GetMapping("/{id}")
    public ResponseEntity<DocResponse> getDocumentById(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        System.out.println("Current user: " + username);
        boolean hasAccess = documentService.hasAccessToDocument(id, username); // reuse for view access too
        if (!hasAccess) {
            return ResponseEntity.status(403).build();
        }
        DocResponse docResponse = documentService.getDocumentById(id);
        return ResponseEntity.ok(docResponse);
    }
    //get document by name
    /*@GetMapping("/title")
    public ResponseEntity<DocResponse> getDocumentByTitle(@RequestParam String title, Authentication auth) {
        System.out.println(auth);
        DocResponse docResponse = documentService.getDocBytitle(title);
        return ResponseEntity.ok(docResponse);
    }*/
    //delete document
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, Authentication auth) {
        String username = auth.getName();
        documentService.deleteDocument(id, username);
        return ResponseEntity.noContent().build();
    }
    //add members to the document
    @PostMapping("/{id}/members")
    public ResponseEntity<String> addMembers(@PathVariable Long id, @RequestParam String username) {
        documentService.addMembers(id, username);
        return ResponseEntity.ok("Member added successfully");
    }
    // Update document content (REST fallback for auto-save)
    @PutMapping("/{id}")
    public ResponseEntity<DocResponse> updateDocument(@PathVariable Long id, @RequestBody(required = false) DocRequest docRequest, Authentication auth) {

        String username = auth.getName();
        System.out.println("🔍 PUT /documents/" + id + " by user: " + username);
        if (!documentService.hasAccessToDocument(id, username)) {   // Use hasAccessToDocument
            return ResponseEntity.status(403).build();
        }
        // Handle missing or empty body gracefully
        String content = (docRequest != null && docRequest.getContent() != null) ? docRequest.getContent() : null;

        if (content == null) {
            System.out.println("⚠️ No content received in PUT request");
            // Still try to return current document
            DocResponse current = documentService.getDocumentById(id);
            return ResponseEntity.ok(current);
        }

        documentService.updateDocumentContent(id, content);

        DocResponse updatedDoc = documentService.getDocumentById(id);
        return ResponseEntity.ok(updatedDoc);
    }
}
