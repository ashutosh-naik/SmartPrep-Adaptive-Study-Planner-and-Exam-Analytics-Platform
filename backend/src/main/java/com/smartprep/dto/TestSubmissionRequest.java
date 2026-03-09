package com.smartprep.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TestSubmissionRequest {
    private Map<Long, String> answers; // questionId -> selectedOption (A/B/C/D)
    private Integer timeTakenMinutes;
}
