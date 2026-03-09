package com.smartprep.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AnalyticsResponse {

    // Dashboard
    private Double overallProgress;
    private Long daysToExam;
    private Double studyHoursToday;
    private Long backlogCount;

    // Performance
    private Double avgScore;
    private Double improvement;
    private Double bestScore;
    private Double examReadyPercentage;

    // Score Trends
    private List<ScoreTrend> scoreTrends;

    // Subject Scores
    private List<SubjectScore> subjectScores;

    // Weak Topics
    private List<WeakTopic> weakTopics;

    // Readiness
    private Integer topicsCovered;
    private Integer totalTopics;
    private List<String> focusAreas;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class ScoreTrend {
        private String week;
        private Double score;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class SubjectScore {
        private String subject;
        private Double score;
        private Double trend;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    @Builder
    public static class WeakTopic {
        private String topic;
        private String subject;
        private Double score;
        private String tip;
    }
}
