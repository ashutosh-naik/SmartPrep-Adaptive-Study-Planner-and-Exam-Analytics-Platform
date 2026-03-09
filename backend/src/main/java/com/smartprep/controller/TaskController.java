package com.smartprep.controller;

import com.smartprep.dto.ApiResponse;
import com.smartprep.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTasks(
            Authentication auth,
            @RequestParam(defaultValue = "all") String filter) {
        List<Map<String, Object>> tasks = taskService.getTasks(auth.getName(), filter);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Map<String, Object>>> completeTask(@PathVariable Long id) {
        Map<String, Object> task = taskService.completeTask(id);
        return ResponseEntity.ok(ApiResponse.success(task, "Task completed"));
    }

    @PutMapping("/{id}/skip")
    public ResponseEntity<ApiResponse<Map<String, Object>>> skipTask(@PathVariable Long id) {
        Map<String, Object> task = taskService.skipTask(id);
        return ResponseEntity.ok(ApiResponse.success(task, "Task skipped"));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTaskSummary(Authentication auth) {
        Map<String, Object> summary = taskService.getTaskSummary(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
