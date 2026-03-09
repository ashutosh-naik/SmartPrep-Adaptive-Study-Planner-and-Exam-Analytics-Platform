package com.smartprep.repository;

import com.smartprep.model.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {
    List<StudyPlan> findByUserId(Long userId);
    Optional<StudyPlan> findTopByUserIdOrderByCreatedAtDesc(Long userId);
}
