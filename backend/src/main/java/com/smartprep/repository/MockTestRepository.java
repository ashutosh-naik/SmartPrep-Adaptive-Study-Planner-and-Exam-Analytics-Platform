package com.smartprep.repository;

import com.smartprep.model.MockTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MockTestRepository extends JpaRepository<MockTest, Long> {
    List<MockTest> findBySubjectId(Long subjectId);
    List<MockTest> findBySubjectExamUserId(Long userId);
}
