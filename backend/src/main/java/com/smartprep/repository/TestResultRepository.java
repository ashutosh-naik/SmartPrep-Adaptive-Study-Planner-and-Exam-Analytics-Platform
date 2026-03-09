package com.smartprep.repository;

import com.smartprep.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserId(Long userId);
    List<TestResult> findByUserIdOrderByAttemptedAtDesc(Long userId);
    Optional<TestResult> findByUserIdAndMockTestId(Long userId, Long mockTestId);
    List<TestResult> findByMockTestId(Long mockTestId);

    @Query("SELECT AVG(tr.percentage) FROM TestResult tr WHERE tr.user.id = :userId")
    Double findAveragePercentageByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(DISTINCT tr.mockTest.id) FROM TestResult tr WHERE tr.user.id = :userId")
    long countDistinctMockTestsByUserId(@Param("userId") Long userId);
}
