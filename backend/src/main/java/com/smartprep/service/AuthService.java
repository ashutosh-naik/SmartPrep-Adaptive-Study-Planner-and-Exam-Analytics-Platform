package com.smartprep.service;

import com.smartprep.dto.*;
import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.User;
import com.smartprep.repository.UserRepository;
import com.smartprep.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${google.client.id}")
    private String googleClientId;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .examType(request.getExamType())
                .studyHoursPerDay(4)
                .breakDuration(15)
                .build();

        User saved = userRepository.save(user);

        return mapToUserResponse(saved);
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", mapToUserResponse(user));
        return response;
    }

    public Map<String, Object> googleLogin(GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");

                // Find or create user
                User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = User.builder()
                            .name(name)
                            .email(email)
                            // Set a random impossible password for google-created accounts
                            .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .studyHoursPerDay(4)
                            .breakDuration(15)
                            .build();
                    return userRepository.save(newUser);
                });

                String token = jwtUtil.generateToken(user.getEmail());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", mapToUserResponse(user));
                return response;
            } else {
                throw new IllegalArgumentException("Invalid Google token");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed", e);
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .course(user.getCourse())
                .year(user.getYear())
                .examType(user.getExamType())
                .examDate(user.getExamDate())
                .studyHoursPerDay(user.getStudyHoursPerDay())
                .preferredStudyTime(user.getPreferredStudyTime())
                .breakDuration(user.getBreakDuration())
                .build();
    }
}
