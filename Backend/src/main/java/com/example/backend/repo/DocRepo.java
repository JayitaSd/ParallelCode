package com.example.backend.repo;

import com.example.backend.entity.Document;
 import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface DocRepo extends JpaRepository<Document,Long> {
    Optional<Document> findBytitle(String title);
    List<Document> findByOwner(User owner);
}
