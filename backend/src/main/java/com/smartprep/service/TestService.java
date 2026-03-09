package com.smartprep.service;

import com.smartprep.dto.TestSubmissionRequest;
import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.*;
import com.smartprep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TestService {

    @Autowired
    private MockTestRepository mockTestRepository;
    @Autowired
    private TestResultRepository testResultRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getAllTests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<MockTest> tests = mockTestRepository.findBySubjectExamUserId(user.getId());
        List<TestResult> userResults = testResultRepository.findByUserId(user.getId());

        Map<Long, TestResult> resultMap = userResults.stream()
                .collect(Collectors.toMap(r -> r.getMockTest().getId(), r -> r, (a, b) -> b));

        return tests.stream().map(test -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", test.getId());
            map.put("title", test.getTitle());
            map.put("subjectName", test.getSubject() != null ? test.getSubject().getName() : "");
            map.put("difficulty", test.getDifficulty());
            map.put("totalQuestions", test.getTotalQuestions());
            map.put("durationMinutes", test.getDurationMinutes());
            map.put("isLocked", test.getIsLocked());

            TestResult result = resultMap.get(test.getId());
            if (result != null) {
                map.put("attempted", true);
                map.put("score", result.getPercentage());
            } else {
                map.put("attempted", false);
                map.put("score", null);
            }
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getTestWithQuestions(Long testId) {
        MockTest test = mockTestRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found"));

        Map<String, Object> result = new HashMap<>();
        result.put("id", test.getId());
        result.put("title", test.getTitle());
        result.put("subjectName", test.getSubject() != null ? test.getSubject().getName() : "");
        result.put("difficulty", test.getDifficulty());
        result.put("totalQuestions", test.getTotalQuestions());
        result.put("durationMinutes", test.getDurationMinutes());

        List<Map<String, Object>> questions = test.getQuestions().stream().map(q -> {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("optionA", q.getOptionA());
            qMap.put("optionB", q.getOptionB());
            qMap.put("optionC", q.getOptionC());
            qMap.put("optionD", q.getOptionD());
            // Don't send correct option during test
            return qMap;
        }).collect(Collectors.toList());

        result.put("questions", questions);
        return result;
    }

    public Map<String, Object> submitTest(String email, Long testId, TestSubmissionRequest submission) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        MockTest test = mockTestRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test not found"));

        // Calculate score
        int correct = 0;
        int total = test.getQuestions().size();

        Map<Long, String> correctAnswers = new HashMap<>();
        for (TestQuestion q : test.getQuestions()) {
            correctAnswers.put(q.getId(), q.getCorrectOption());
        }

        for (Map.Entry<Long, String> entry : submission.getAnswers().entrySet()) {
            String correctOpt = correctAnswers.get(entry.getKey());
            if (correctOpt != null && correctOpt.equalsIgnoreCase(entry.getValue())) {
                correct++;
            }
        }

        BigDecimal percentage = total > 0
                ? BigDecimal.valueOf(correct * 100.0 / total).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        TestResult testResult = TestResult.builder()
                .user(user)
                .mockTest(test)
                .score(correct)
                .totalMarks(total)
                .percentage(percentage)
                .timeTakenMinutes(submission.getTimeTakenMinutes())
                .build();
        testResultRepository.save(testResult);

        Map<String, Object> result = new HashMap<>();
        result.put("score", correct);
        result.put("totalMarks", total);
        result.put("percentage", percentage);
        result.put("timeTakenMinutes", submission.getTimeTakenMinutes());
        return result;
    }

    public Map<String, Object> getTestResult(String email, Long testId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TestResult result = testResultRepository.findByUserIdAndMockTestId(user.getId(), testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test result not found"));

        MockTest test = result.getMockTest();

        Map<String, Object> response = new HashMap<>();
        response.put("score", result.getScore());
        response.put("totalMarks", result.getTotalMarks());
        response.put("percentage", result.getPercentage());
        response.put("timeTakenMinutes", result.getTimeTakenMinutes());
        response.put("testTitle", test.getTitle());
        response.put("subjectName", test.getSubject() != null ? test.getSubject().getName() : "");

        // Include questions with answers for review
        List<Map<String, Object>> questionReview = test.getQuestions().stream().map(q -> {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("optionA", q.getOptionA());
            qMap.put("optionB", q.getOptionB());
            qMap.put("optionC", q.getOptionC());
            qMap.put("optionD", q.getOptionD());
            qMap.put("correctOption", q.getCorrectOption());
            return qMap;
        }).collect(Collectors.toList());

        response.put("questions", questionReview);
        return response;
    }

    public Map<String, Object> getTestSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<TestResult> results = testResultRepository.findByUserId(user.getId());
        List<MockTest> tests = mockTestRepository.findBySubjectExamUserId(user.getId());

        Map<String, Object> summary = new HashMap<>();
        summary.put("total", tests.size());
        summary.put("completed", results.size());

        Double avgScore = testResultRepository.findAveragePercentageByUserId(user.getId());
        summary.put("avgScore", avgScore != null ? Math.round(avgScore * 100.0) / 100.0 : 0.0);

        int totalTime = results.stream()
                .mapToInt(r -> r.getTimeTakenMinutes() != null ? r.getTimeTakenMinutes() : 0)
                .sum();
        summary.put("timeSpent", totalTime);

        return summary;
    }
}
