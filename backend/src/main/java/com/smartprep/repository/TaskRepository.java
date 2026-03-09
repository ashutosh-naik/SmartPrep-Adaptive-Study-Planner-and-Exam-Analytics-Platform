package com.smartprep.repository;

import com.smartprep.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStudyPlanIdAndScheduledDate(Long studyPlanId, LocalDate date);

    List<Task> findByStudyPlanIdAndScheduledDateBetween(Long studyPlanId, LocalDate startDate, LocalDate endDate);

    List<Task> findByStudyPlanId(Long studyPlanId);

    List<Task> findByStudyPlanIdAndStatus(Long studyPlanId, String status);

    List<Task> findByStudyPlanIdAndIsBacklogTrue(Long studyPlanId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.studyPlan.id = :planId")
    long countByStudyPlanId(@Param("planId") Long planId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.studyPlan.id = :planId AND t.status = :status")
    long countByStudyPlanIdAndStatus(@Param("planId") Long planId, @Param("status") String status);
}
