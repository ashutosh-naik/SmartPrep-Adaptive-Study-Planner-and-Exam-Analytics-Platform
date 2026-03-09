package com.smartprep.controller;

import com.smartprep.dto.AnalyticsResponse;
import com.smartprep.dto.ApiResponse;
import com.smartprep.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard(Authentication auth) {
        Map<String, Object> data = analyticsService.getDashboardData(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/performance")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getPerformance(Authentication auth) {
        AnalyticsResponse perf = analyticsService.getPerformance(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(perf));
    }

    @GetMapping("/readiness")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReadiness(Authentication auth) {
        Map<String, Object> readiness = analyticsService.getReadiness(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(readiness));
    }
}
