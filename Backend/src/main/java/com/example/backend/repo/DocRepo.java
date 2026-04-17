package com.example.backend.repo;

import com.example.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface DocRepo extends JpaRepository<Document,Long> {
    Optional<Document> findBytitle(String title);
}
