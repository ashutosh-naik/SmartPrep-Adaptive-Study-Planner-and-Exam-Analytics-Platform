package com.smartprep.service;

import com.smartprep.dto.UserResponse;
import com.smartprep.exception.ResourceNotFoundException;
import com.smartprep.model.*;
import com.smartprep.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    public UserResponse getProfile(String email) {
        User user = findUserByEmail(email);
        return mapToResponse(user);
    }

    public UserResponse updateProfile(String email, Map<String, Object> updates) {
        User user = findUserByEmail(email);

        if (updates.containsKey("name"))
            user.setName((String) updates.get("name"));
        if (updates.containsKey("course"))
            user.setCourse((String) updates.get("course"));
        if (updates.containsKey("year"))
            user.setYear((String) updates.get("year"));
        if (updates.containsKey("examType"))
            user.setExamType((String) updates.get("examType"));
        if (updates.containsKey("examDate"))
            user.setExamDate(LocalDate.parse((String) updates.get("examDate")));
        if (updates.containsKey("studyHoursPerDay"))
            user.setStudyHoursPerDay((Integer) updates.get("studyHoursPerDay"));
        if (updates.containsKey("preferredStudyTime"))
            user.setPreferredStudyTime((String) updates.get("preferredStudyTime"));
        if (updates.containsKey("breakDuration"))
            user.setBreakDuration((Integer) updates.get("breakDuration"));

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public List<Map<String, Object>> getUserSubjects(String email) {
        User user = findUserByEmail(email);
        List<Exam> exams = examRepository.findByUserId(user.getId());

        return exams.stream()
                .flatMap(exam -> exam.getSubjects().stream())
                .map(subject -> Map.of(
                        "id", (Object) subject.getId(),
                        "name", subject.getName(),
                        "difficulty", subject.getDifficulty() != null ? subject.getDifficulty() : "Medium"))
                .collect(Collectors.toList());
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .course(user.getCourse())
                .year(user.getYear())
                .examType(user.getExamType())
                .examDate(user.getExamDate())
                .studyHoursPerDay(user.getStudyHoursPerDay())
                .preferredStudyTime(user.getPreferredStudyTime())
                .breakDuration(user.getBreakDuration())
                .build();
    }
}
