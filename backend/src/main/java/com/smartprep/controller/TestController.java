package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.dto.TestSubmissionRequest;
import com.smartprep.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    @Autowired
    private TestService testService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllTests(Authentication auth) {
        List<Map<String, Object>> tests = testService.getAllTests(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(tests));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTest(@PathVariable Long id) {
        Map<String, Object> test = testService.getTestWithQuestions(id);
        return ResponseEntity.ok(ApiResponse.success(test));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitTest(
            Authentication auth, @PathVariable Long id, @RequestBody TestSubmissionRequest request) {
        Map<String, Object> result = testService.submitTest(auth.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success(result, "Test submitted successfully"));
    }

    @GetMapping("/{id}/result")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTestResult(
            Authentication auth, @PathVariable Long id) {
        Map<String, Object> result = testService.getTestResult(auth.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTestSummary(Authentication auth) {
        Map<String, Object> summary = testService.getTestSummary(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
