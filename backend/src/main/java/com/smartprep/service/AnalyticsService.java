package com.smartprep.service;

import com.smartprep.dto.AnalyticsResponse;
import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.*;
import com.smartprep.repository.*;
import com.smartprep.util.ReadinessCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudyPlanRepository studyPlanRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TestResultRepository testResultRepository;
    @Autowired
    private MockTestRepository mockTestRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private ReadinessCalculator readinessCalculator;

    public Map<String, Object> getDashboardData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Map<String, Object> dashboard = new HashMap<>();

        // Days to exam
        if (user.getExamDate() != null) {
            long days = ChronoUnit.DAYS.between(LocalDate.now(), user.getExamDate());
            dashboard.put("daysToExam", Math.max(days, 0));
        } else {
            dashboard.put("daysToExam", 0L);
        }

        // Study plan info
        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId()).orElse(null);
        if (plan != null) {
            long total = taskRepository.countByStudyPlanId(plan.getId());
            long completed = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "completed");
            long skipped = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "skipped");

            dashboard.put("overallProgress", total > 0 ? Math.round(completed * 100.0 / total * 100.0) / 100.0 : 0.0);
            dashboard.put("backlogCount", skipped);

            // Today's tasks
            List<Task> todaysTasks = taskRepository.findByStudyPlanIdAndScheduledDate(plan.getId(), LocalDate.now());
            double studyHoursToday = todaysTasks.stream()
                    .filter(t -> "completed".equals(t.getStatus()))
                    .mapToDouble(t -> t.getDurationHours() != null ? t.getDurationHours().doubleValue() : 0)
                    .sum();
            dashboard.put("studyHoursToday", studyHoursToday);

            List<Map<String, Object>> todayTaskList = todaysTasks.stream().map(t -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", t.getId());
                m.put("topicName", t.getTopic() != null ? t.getTopic().getName() : "");
                m.put("subjectName",
                        t.getTopic() != null && t.getTopic().getSubject() != null ? t.getTopic().getSubject().getName()
                                : "");
                m.put("durationHours", t.getDurationHours());
                m.put("status", t.getStatus());
                return m;
            }).collect(Collectors.toList());
            dashboard.put("todaysTasks", todayTaskList);

            // Readiness
            dashboard.put("readinessScore", readinessCalculator.calculate(user.getId()));
        } else {
            dashboard.put("overallProgress", 0.0);
            dashboard.put("backlogCount", 0L);
            dashboard.put("studyHoursToday", 0.0);
            dashboard.put("todaysTasks", new ArrayList<>());
            dashboard.put("readinessScore", 0.0);
        }

        // Topics covered
        long totalTopics = 0;
        long coveredTopics = 0;
        List<Exam> exams = examRepository.findByUserId(user.getId());
        for (Exam exam : exams) {
            for (Subject subject : subjectRepository.findByExamId(exam.getId())) {
                totalTopics += topicRepository.findBySubjectId(subject.getId()).size();
            }
        }
        if (plan != null) {
            coveredTopics = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "completed");
        }
        dashboard.put("topicsCovered", coveredTopics);
        dashboard.put("totalTopics", totalTopics);

        return dashboard;
    }

    public AnalyticsResponse getPerformance(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<TestResult> results = testResultRepository.findByUserIdOrderByAttemptedAtDesc(user.getId());

        Double avgScore = testResultRepository.findAveragePercentageByUserId(user.getId());
        double bestScore = results.stream()
                .mapToDouble(r -> r.getPercentage() != null ? r.getPercentage().doubleValue() : 0)
                .max().orElse(0);

        // Calculate improvement (compare last 3 vs first 3)
        double improvement = 0;
        if (results.size() >= 6) {
            double recentAvg = results.subList(0, 3).stream()
                    .mapToDouble(r -> r.getPercentage().doubleValue()).average().orElse(0);
            double oldAvg = results.subList(results.size() - 3, results.size()).stream()
                    .mapToDouble(r -> r.getPercentage().doubleValue()).average().orElse(0);
            improvement = recentAvg - oldAvg;
        }

        // Score trends (mock weekly aggregation)
        List<AnalyticsResponse.ScoreTrend> trends = new ArrayList<>();
        Map<String, List<TestResult>> grouped = results.stream()
                .collect(Collectors.groupingBy(r -> {
                    LocalDateTime at = r.getAttemptedAt();
                    return "Week " + (at != null ? at.getDayOfYear() / 7 + 1 : 1);
                }));
        for (Map.Entry<String, List<TestResult>> entry : grouped.entrySet()) {
            double weekAvg = entry.getValue().stream()
                    .mapToDouble(r -> r.getPercentage() != null ? r.getPercentage().doubleValue() : 0)
                    .average().orElse(0);
            trends.add(AnalyticsResponse.ScoreTrend.builder()
                    .week(entry.getKey()).score(Math.round(weekAvg * 100.0) / 100.0).build());
        }

        // Subject-wise scores
        List<AnalyticsResponse.SubjectScore> subjectScores = new ArrayList<>();
        Map<String, List<TestResult>> bySubject = results.stream()
                .collect(Collectors
                        .groupingBy(r -> r.getMockTest().getSubject() != null ? r.getMockTest().getSubject().getName()
                                : "Unknown"));
        for (Map.Entry<String, List<TestResult>> entry : bySubject.entrySet()) {
            double subjAvg = entry.getValue().stream()
                    .mapToDouble(r -> r.getPercentage() != null ? r.getPercentage().doubleValue() : 0)
                    .average().orElse(0);
            subjectScores.add(AnalyticsResponse.SubjectScore.builder()
                    .subject(entry.getKey()).score(Math.round(subjAvg * 100.0) / 100.0).trend(0.0).build());
        }

        double readiness = readinessCalculator.calculate(user.getId());

        return AnalyticsResponse.builder()
                .avgScore(avgScore != null ? Math.round(avgScore * 100.0) / 100.0 : 0.0)
                .improvement(Math.round(improvement * 100.0) / 100.0)
                .bestScore(Math.round(bestScore * 100.0) / 100.0)
                .examReadyPercentage(readiness)
                .scoreTrends(trends)
                .subjectScores(subjectScores)
                .build();
    }

    public Map<String, Object> getReadiness(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        double readiness = readinessCalculator.calculate(user.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("percentage", readiness);
        result.put("topicsCovered", 0);
        result.put("totalTopics", 0);
        result.put("focusAreas", new ArrayList<>());

        // Compute topic coverage
        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId()).orElse(null);
        if (plan != null) {
            long total = taskRepository.countByStudyPlanId(plan.getId());
            long completed = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "completed");
            result.put("topicsCovered", completed);
            result.put("totalTopics", total);
        }

        return result;
    }
}
