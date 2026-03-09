package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "topics")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "estimated_hours", precision = 4, scale = 1)
    private BigDecimal estimatedHours;
}
