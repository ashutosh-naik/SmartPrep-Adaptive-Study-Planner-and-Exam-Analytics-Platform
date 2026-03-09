package com.smartprep.service;

import com.smartprep.dto.PlannerRequest;
import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.*;
import com.smartprep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlannerService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private StudyPlanRepository studyPlanRepository;
    @Autowired
    private TaskRepository taskRepository;

    @Transactional
    public Map<String, Object> generateStudyPlan(String email, PlannerRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get or create exam
        Exam exam;
        if (request.getExamId() != null) {
            exam = examRepository.findById(request.getExamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        } else {
            exam = Exam.builder()
                    .user(user)
                    .name(user.getExamType() != null ? user.getExamType() : "Semester Exam")
                    .examDate(user.getExamDate() != null ? user.getExamDate() : LocalDate.now().plusDays(30))
                    .examType(user.getExamType())
                    .build();
            exam = examRepository.save(exam);
        }

        // Create subjects and topics from request
        if (request.getSubjects() != null) {
            for (PlannerRequest.SubjectInput si : request.getSubjects()) {
                Subject subject = Subject.builder()
                        .exam(exam)
                        .name(si.getName())
                        .difficulty(si.getDifficulty() != null ? si.getDifficulty() : "Medium")
                        .build();
                subject = subjectRepository.save(subject);

                if (si.getTopics() != null) {
                    for (PlannerRequest.TopicInput ti : si.getTopics()) {
                        Topic topic = Topic.builder()
                                .subject(subject)
                                .name(ti.getName())
                                .estimatedHours(
                                        BigDecimal.valueOf(ti.getEstimatedHours() != null ? ti.getEstimatedHours()
                                                : getDefaultHours(si.getDifficulty())))
                                .build();
                        topicRepository.save(topic);
                    }
                }
            }
        }

        // Generate study plan
        LocalDate startDate = LocalDate.now();
        LocalDate examDate = exam.getExamDate();
        long totalDays = ChronoUnit.DAYS.between(startDate, examDate);
        if (totalDays <= 0)
            totalDays = 30;

        int studyHoursPerDay = user.getStudyHoursPerDay() != null ? user.getStudyHoursPerDay() : 4;

        StudyPlan plan = StudyPlan.builder()
                .user(user)
                .startDate(startDate)
                .endDate(examDate)
                .build();
        plan = studyPlanRepository.save(plan);

        // Get all topics
        List<Subject> subjects = subjectRepository.findByExamId(exam.getId());
        List<Topic> allTopics = new ArrayList<>();
        for (Subject s : subjects) {
            allTopics.addAll(topicRepository.findBySubjectId(s.getId()));
        }

        // Sort: Hard topics first, then Medium, then Easy
        allTopics.sort((a, b) -> {
            int da = difficultyWeight(a.getSubject().getDifficulty());
            int db = difficultyWeight(b.getSubject().getDifficulty());
            return db - da;
        });

        // Reserve last 3 days for revision
        long planDays = Math.max(totalDays - 3, 1);

        // Distribute topics across days
        List<Task> tasks = new ArrayList<>();
        LocalDate currentDate = startDate;
        double dailyLoad = 0;

        for (Topic topic : allTopics) {
            double hours = topic.getEstimatedHours() != null ? topic.getEstimatedHours().doubleValue()
                    : getDefaultHours(topic.getSubject().getDifficulty());

            if (dailyLoad + hours > studyHoursPerDay) {
                currentDate = currentDate.plusDays(1);
                dailyLoad = 0;
                if (ChronoUnit.DAYS.between(startDate, currentDate) >= planDays) {
                    currentDate = startDate; // wrap around if needed
                }
            }

            Task task = Task.builder()
                    .studyPlan(plan)
                    .topic(topic)
                    .scheduledDate(currentDate)
                    .durationHours(BigDecimal.valueOf(hours))
                    .status("pending")
                    .isBacklog(false)
                    .build();
            tasks.add(task);
            dailyLoad += hours;
        }

        taskRepository.saveAll(tasks);

        Map<String, Object> result = new HashMap<>();
        result.put("planId", plan.getId());
        result.put("totalTasks", tasks.size());
        result.put("startDate", startDate);
        result.put("endDate", examDate);
        return result;
    }

    public List<Map<String, Object>> getWeeklyPlan(String email, LocalDate weekStart) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No study plan found. Generate one first."));

        LocalDate weekEnd = weekStart.plusDays(6);
        List<Task> tasks = taskRepository.findByStudyPlanIdAndScheduledDateBetween(plan.getId(), weekStart, weekEnd);

        // Group by date
        Map<LocalDate, List<Task>> grouped = tasks.stream()
                .collect(Collectors.groupingBy(Task::getScheduledDate));

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = weekStart.plusDays(i);
            List<Task> dayTasks = grouped.getOrDefault(date, new ArrayList<>());
            Map<String, Object> day = new HashMap<>();
            day.put("date", date);
            day.put("tasks", dayTasks.stream().map(this::mapTask).collect(Collectors.toList()));
            result.add(day);
        }
        return result;
    }

    public List<Map<String, Object>> getDailyPlan(String email, LocalDate date) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No study plan found"));

        List<Task> tasks = taskRepository.findByStudyPlanIdAndScheduledDate(plan.getId(), date);
        return tasks.stream().map(this::mapTask).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getBacklog(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        if (plan == null)
            return new ArrayList<>();

        List<Task> backlogTasks = taskRepository.findByStudyPlanIdAndIsBacklogTrue(plan.getId());
        return backlogTasks.stream().map(this::mapTask).collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> redistribute(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyPlan plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No study plan found"));

        int studyHoursPerDay = user.getStudyHoursPerDay() != null ? user.getStudyHoursPerDay() : 4;

        List<Task> skippedTasks = taskRepository.findByStudyPlanIdAndStatus(plan.getId(), "skipped");
        List<Task> allTasks = taskRepository.findByStudyPlanId(plan.getId());

        // Calculate daily loads for future days
        LocalDate today = LocalDate.now();
        Map<LocalDate, Double> dailyLoads = new HashMap<>();
        for (Task t : allTasks) {
            if (t.getScheduledDate().isAfter(today) && !"skipped".equals(t.getStatus())) {
                dailyLoads.merge(t.getScheduledDate(),
                        t.getDurationHours() != null ? t.getDurationHours().doubleValue() : 1.0, Double::sum);
            }
        }

        int redistributed = 0;
        for (Task skipped : skippedTasks) {
            // Find day with lowest load in next 5 days
            LocalDate bestDay = null;
            double lowestLoad = Double.MAX_VALUE;

            for (int i = 1; i <= 5; i++) {
                LocalDate candidate = today.plusDays(i);
                double load = dailyLoads.getOrDefault(candidate, 0.0);
                double duration = skipped.getDurationHours() != null ? skipped.getDurationHours().doubleValue() : 1.0;

                if (load + duration <= studyHoursPerDay && load < lowestLoad) {
                    lowestLoad = load;
                    bestDay = candidate;
                }
            }

            if (bestDay != null) {
                skipped.setOriginalDate(skipped.getScheduledDate());
                skipped.setScheduledDate(bestDay);
                skipped.setStatus("pending");
                skipped.setIsBacklog(true);
                dailyLoads.merge(bestDay,
                        skipped.getDurationHours() != null ? skipped.getDurationHours().doubleValue() : 1.0,
                        Double::sum);
                taskRepository.save(skipped);
                redistributed++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("redistributed", redistributed);
        result.put("total", skippedTasks.size());
        return result;
    }

    private double getDefaultHours(String difficulty) {
        if ("Hard".equalsIgnoreCase(difficulty))
            return 2.0;
        if ("Easy".equalsIgnoreCase(difficulty))
            return 1.0;
        return 1.5;
    }

    private int difficultyWeight(String difficulty) {
        if ("Hard".equalsIgnoreCase(difficulty))
            return 3;
        if ("Medium".equalsIgnoreCase(difficulty))
            return 2;
        return 1;
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
        return map;
    }
}
