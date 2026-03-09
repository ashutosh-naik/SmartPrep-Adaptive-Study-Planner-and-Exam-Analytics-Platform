package com.smartprep.service;

import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.*;
import com.smartprep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private StudyPlanRepository studyPlanRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getTasks(String email, String filter) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        if (plan == null)
            return new ArrayList<>();

        List<Task> tasks;
        LocalDate today = LocalDate.now();

        switch (filter != null ? filter.toLowerCase() : "all") {
            case "today":
                tasks = taskRepository.findByStudyPlanIdAndScheduledDate(plan.getId(), today);
                break;
            case "week":
                LocalDate weekEnd = today.plusDays(6);
                tasks = taskRepository.findByStudyPlanIdAndScheduledDateBetween(plan.getId(), today, weekEnd);
                break;
            default:
                tasks = taskRepository.findByStudyPlanId(plan.getId());
        }

        return tasks.stream().map(this::mapTask).collect(Collectors.toList());
    }

    public Map<String, Object> completeTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setStatus("completed");
        task.setCompletedAt(LocalDateTime.now());
        taskRepository.save(task);

        return mapTask(task);
    }

    public Map<String, Object> skipTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        task.setStatus("skipped");
        task.setIsBacklog(true);
        taskRepository.save(task);

        return mapTask(task);
    }

    public Map<String, Object> getTaskSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        Map<String, Object> summary = new HashMap<>();
        if (plan == null) {
            summary.put("total", 0);
            summary.put("completed", 0);
            summary.put("pending", 0);
            summary.put("skipped", 0);
            summary.put("completionRate", 0.0);
            return summary;
        }

        long total = taskRepository.countByStudyPlanId(plan.getId());
        long completed = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "completed");
        long pending = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "pending");
        long skipped = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "skipped");

        summary.put("total", total);
        summary.put("completed", completed);
        summary.put("pending", pending);
        summary.put("skipped", skipped);
        summary.put("completionRate", total > 0 ? Math.round((completed * 100.0 / total) * 100.0) / 100.0 : 0.0);

        return summary;
    }

    private Map<String, Object> mapTask(Task task) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", task.getId());
        map.put("topicName", task.getTopic() != null ? task.getTopic().getName() : "");
        map.put("subjectName",
                task.getTopic() != null && task.getTopic().getSubject() != null ? task.getTopic().getSubject().getName()
                        : "");
        map.put("scheduledDate", task.getScheduledDate());
        map.put("durationHours", task.getDurationHours());
        map.put("status", task.getStatus());
        map.put("isBacklog", task.getIsBacklog());
        map.put("originalDate", task.getOriginalDate());
        map.put("completedAt", task.getCompletedAt());
        return map;
    }
}
