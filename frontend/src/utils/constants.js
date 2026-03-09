// SmartPrep Constants

export const API_BASE_URL = "/api";

export const EXAM_TYPES = [
  { value: "semester", label: "Semester Exam", desc: "University Exams" },
  { value: "competitive", label: "Competitive", desc: "Entrance Tests" },
];

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

export const STUDY_TIMES = [
  "Early Morning (5-8 AM)",
  "Morning (8-11 AM)",
  "Afternoon (12-3 PM)",
  "Evening (4-7 PM)",
  "Night (8-11 PM)",
];

export const BREAK_DURATIONS = [5, 10, 15, 20, 25, 30];

export const SUBJECT_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#EA580C",
  "#16A34A",
  "#0891B2",
  "#4F46E5",
  "#CA8A04",
  "#DC2626",
  "#059669",
  "#8B5CF6",
  "#F59E0B",
];

export const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "text-green-700",
    bg: "bg-green-100",
    icon: "✓",
  },
  pending: {
    label: "Pending",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: "○",
  },
  skipped: {
    label: "Skipped",
    color: "text-red-700",
    bg: "bg-red-100",
    icon: "✗",
  },
};
