package com.smartprep.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TaskUpdateRequest {
    private String status; // completed, skipped
}
