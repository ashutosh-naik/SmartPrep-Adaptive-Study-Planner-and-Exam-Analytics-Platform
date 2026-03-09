package com.smartprep.util;

import com.smartprep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ReadinessCalculator {

    @Autowired
    private StudyPlanRepository studyPlanRepository;
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TestResultRepository testResultRepository;

    public double calculate(Long userId) {
        var plan = studyPlanRepository.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);

        double completionRate = 0;
        if (plan != null) {
            long total = taskRepository.countByStudyPlanId(plan.getId());
            long completed = taskRepository.countByStudyPlanIdAndStatus(plan.getId(), "completed");
            completionRate = total > 0 ? (double) completed / total : 0;
        }

        Double avgTestScore = testResultRepository.findAveragePercentageByUserId(userId);
        double normalizedTestScore = avgTestScore != null ? avgTestScore / 100.0 : 0;

        double topicCoverage = completionRate; // simplified

        double readiness = (completionRate * 0.4 + normalizedTestScore * 0.4 + topicCoverage * 0.2) * 100;
        return Math.round(readiness * 100.0) / 100.0;
    }
}
