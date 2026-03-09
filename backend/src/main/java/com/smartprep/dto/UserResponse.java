package com.smartprep.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String course;
    private String year;
    private String examType;
    private LocalDate examDate;
    private Integer studyHoursPerDay;
    private String preferredStudyTime;
    private Integer breakDuration;
}
