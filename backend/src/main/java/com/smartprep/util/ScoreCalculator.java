package com.smartprep.util;

import org.springframework.stereotype.Component;

@Component
public class ScoreCalculator {

    public double calculatePercentage(int correct, int total) {
        if (total == 0)
            return 0;
        return Math.round((correct * 100.0 / total) * 100.0) / 100.0;
    }

    public String getGrade(double percentage) {
        if (percentage >= 90)
            return "A+";
        if (percentage >= 80)
            return "A";
        if (percentage >= 70)
            return "B";
        if (percentage >= 60)
            return "C";
        if (percentage >= 50)
            return "D";
        return "F";
    }
}
