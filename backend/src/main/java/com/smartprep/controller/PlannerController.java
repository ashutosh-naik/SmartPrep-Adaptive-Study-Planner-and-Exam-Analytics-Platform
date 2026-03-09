package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.dto.PlannerRequest;
import com.smartprep.service.PlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/planner")
public class PlannerController {

    @Autowired
    private PlannerService plannerService;

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generatePlan(
            Authentication auth, @RequestBody PlannerRequest request) {
        Map<String, Object> result = plannerService.generateStudyPlan(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success(result, "Study plan generated successfully"));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getWeeklyPlan(
            Authentication auth,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate week) {
        List<Map<String, Object>> plan = plannerService.getWeeklyPlan(auth.getName(), week);
        return ResponseEntity.ok(ApiResponse.success(plan));
    }

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDailyPlan(
            Authentication auth,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Map<String, Object>> tasks = plannerService.getDailyPlan(auth.getName(), date);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/backlog")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBacklog(Authentication auth) {
        List<Map<String, Object>> backlog = plannerService.getBacklog(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(backlog));
    }

    @PostMapping("/redistribute")
    public ResponseEntity<ApiResponse<Map<String, Object>>> redistribute(Authentication auth) {
        Map<String, Object> result = plannerService.redistribute(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(result, "Backlog redistributed"));
    }
}
