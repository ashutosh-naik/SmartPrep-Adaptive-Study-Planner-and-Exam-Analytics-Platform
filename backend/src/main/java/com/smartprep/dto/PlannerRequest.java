package com.smartprep.dto;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlannerRequest {
    private Long examId;
    private List<SubjectInput> subjects;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class SubjectInput {
        private String name;
        private String difficulty;
        private List<TopicInput> topics;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class TopicInput {
        private String name;
        private Double estimatedHours;
    }
}
