package com.example.backend.service;

import com.example.backend.dto.auth.AuthResponse;
import com.example.backend.dto.auth.LoginRequest;
import com.example.backend.dto.auth.SignUpRequest;
import com.example.backend.entity.User;
import com.example.backend.repo.UserRepo;
import com.example.backend.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    public AuthService(UserRepo userRepo, PasswordEncoder passwordEncoder,  JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String signup(@Valid SignUpRequest request) {
        if(userRepo.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if(userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User u = new User(request.getUsername(), request.getEmail(), passwordEncoder.encode(request.getPassword()));
        userRepo.save(u);
        return "User registered successfully";

    }

    public AuthResponse login(@Valid LoginRequest request) {
        User u = userRepo.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        String token = jwtUtil.generateToken(u.getUsername());
        return new AuthResponse(token, u.getId(), u.getUsername(), u.getEmail());
    }
}
