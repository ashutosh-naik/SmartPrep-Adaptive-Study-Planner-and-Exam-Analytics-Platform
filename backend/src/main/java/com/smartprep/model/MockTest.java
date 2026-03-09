package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "mock_tests")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MockTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 20)
    private String difficulty;

    @Column(name = "total_questions")
    private Integer totalQuestions;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "is_locked")
    private Boolean isLocked = false;

    @OneToMany(mappedBy = "mockTest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestQuestion> questions;

    @OneToMany(mappedBy = "mockTest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestResult> results;
}
