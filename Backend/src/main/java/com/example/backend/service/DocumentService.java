package com.example.backend.service;

import com.example.backend.dto.document.DocRequest;
import com.example.backend.dto.document.DocResponse;
import com.example.backend.entity.Document;
import com.example.backend.entity.DocumentMember;
import com.example.backend.entity.User;
import com.example.backend.repo.DocRepo;
import com.example.backend.repo.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {
    private final UserRepo userRepo;
    private final DocRepo docRepo;

    public DocumentService(UserRepo userRepo, DocRepo docRepo) {
        this.userRepo = userRepo;
        this.docRepo = docRepo;
    }

    public DocResponse createDocument(DocRequest docRequest, String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("User not found"));
        Document document = new Document(docRequest.getTitle(), docRequest.getContent(), user);
        docRepo.save(document);
        return new DocResponse(
                document.getId(),
                document.getTitle(),
                document.getContent(),
                user.getUsername(),
                List.of()
        );
    }

    public DocResponse getDocumentById(Long id) {
        Document document =  docRepo.findById(id)
                .orElseThrow(()-> new RuntimeException("Document not found"));
        List<String> members = document.getMembers()
                .stream()
                .map(m -> m.getUser().getUsername())
                .collect(Collectors.toList());
        return new DocResponse(
                document.getId(),
                document.getTitle(),
                document.getContent(),
                document.getOwner().getUsername(),
                members
        );
    }

    /*public DocResponse getDocBytitle(String title) {
        Document document = docRepo.findBytitle(title)
                .orElseThrow(()-> new RuntimeException("Document not found"));
        List<String> members = document.getMembers()
                .stream()
                .map(m -> m.getUser().getUsername())
                .collect(Collectors.toList());
        return new DocResponse(
                document.getId(),
                document.getTitle(),
                document.getContent(),
                document.getOwner().getUsername(),
                members
        );
    }*/

    public void addMembers(Long id, String username) {
        Document document =  docRepo.findById(id)
                .orElseThrow(()-> new RuntimeException("Document not found"));
        User user = userRepo.findByUsername(username)
                .orElseThrow(()-> new RuntimeException("User not found"));
        DocumentMember member = new  DocumentMember(document, user);
        document.getMembers().add(member);
        docRepo.save(document);
    }
}
