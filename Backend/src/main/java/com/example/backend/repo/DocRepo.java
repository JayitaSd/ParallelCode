package com.example.backend.repo;

import com.example.backend.entity.Document;
 import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface DocRepo extends JpaRepository<Document,Long> {
    Optional<Document> findBytitle(String title);
    List<Document> findByOwner(User owner);

    @Query("SELECT d FROM Document d JOIN d.members m WHERE m.user.username = :username")
    List<Document> findByMemberUsername(@Param("username") String username);
}
