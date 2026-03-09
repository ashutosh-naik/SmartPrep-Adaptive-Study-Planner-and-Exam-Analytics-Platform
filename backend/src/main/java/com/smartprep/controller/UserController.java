package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.dto.UserResponse;
import com.smartprep.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Authentication auth) {
        UserResponse user = userService.getProfile(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication auth, @RequestBody Map<String, Object> updates) {
        UserResponse user = userService.updateProfile(auth.getName(), updates);
        return ResponseEntity.ok(ApiResponse.success(user, "Profile updated successfully"));
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSubjects(Authentication auth) {
        List<Map<String, Object>> subjects = userService.getUserSubjects(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(subjects));
    }
}
