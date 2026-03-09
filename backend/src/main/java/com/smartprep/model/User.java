package com.smartprep.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 100)
    private String course;

    @Column(length = 20)
    private String year;

    @Column(name = "exam_type", length = 50)
    private String examType;

    @Column(name = "exam_date")
    private LocalDate examDate;

    @Column(name = "study_hours_per_day")
    private Integer studyHoursPerDay = 4;

    @Column(name = "preferred_study_time", length = 50)
    private String preferredStudyTime;

    @Column(name = "break_duration")
    private Integer breakDuration = 15;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exam> exams;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyPlan> studyPlans;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
