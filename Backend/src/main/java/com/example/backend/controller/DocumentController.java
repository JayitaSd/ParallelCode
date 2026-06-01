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
    @GetMapping("/id/{id}")
    public ResponseEntity<DocResponse> getDocumentById(@PathVariable Long id) {
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
}
