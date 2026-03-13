import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  RotateCcw,
  Clock,
  CheckCircle,
  Play,
  LayoutGrid,
  Rows3,
  Sparkles,
  X,
  Zap,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { plannerService } from "../../services/plannerService";
import { taskService } from "../../services/taskService";
import {
  formatDayName,
  formatDayNumber,
  formatShortDate,
  getWeekDates,
  isDateToday,
  getDaysUntil,
} from "../../utils/dateUtils";
import { formatDuration } from "../../utils/calculationUtils";
import { STATUS_CONFIG } from "../../utils/constants";
import {
  addDays,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";
import toast from "react-hot-toast";
import PomodoroTimer from "../../components/PomodoroTimer";

/* ─── Client-side schedule generator ─── */
const DIFFICULTY_HOURS = { Hard: 1.5, Medium: 1, Easy: 0.75 };

function generateStudyPlan(subjects, examDateStr, hoursPerDay) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(examDateStr);
  examDate.setHours(0, 0, 0, 0);
  const totalDays = Math.max(1, Math.ceil((examDate - today) / 86400000));

  // Collect all INCOMPLETE topics
  const allTopics = [];
  subjects.forEach((subj) => {
    subj.topics.forEach((topic) => {
      if (!topic.done) {
        allTopics.push({
          subjectName: subj.name,
          topicName: topic.name,
          difficulty: subj.difficulty || "Medium",
          durationHours: DIFFICULTY_HOURS[subj.difficulty] || 1,
        });
      }
    });
  });

  if (allTopics.length === 0) return {};

  // Distribute topics across days
  const plan = {};
  let dayIdx = 0;
  let dayHours = 0;

  allTopics.forEach((topic) => {
    const dateKey = format(addDays(today, dayIdx + 1), "yyyy-MM-dd");
    if (!plan[dateKey]) plan[dateKey] = [];

    if (
      dayHours + topic.durationHours > hoursPerDay &&
      plan[dateKey].length > 0
    ) {
      dayIdx = Math.min(dayIdx + 1, totalDays - 1);
      dayHours = 0;
    }

    const finalDate = format(addDays(today, dayIdx + 1), "yyyy-MM-dd");
    if (!plan[finalDate]) plan[finalDate] = [];

    plan[finalDate].push({
      id: Date.now() + Math.random(),
      subjectName: topic.subjectName,
      topicName: topic.topicName,
      durationHours: topic.durationHours,
      difficulty: topic.difficulty,
      status: "pending",
      isBacklog: false,
    });
    dayHours += topic.durationHours;

    if (dayHours >= hoursPerDay) {
      dayIdx = Math.min(dayIdx + 1, totalDays - 1);
      dayHours = 0;
    }
  });

  return plan;
}

const StudyPlanner = () => {
  const { user } = useSelector((state) => state.auth);
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroTask, setPomodoroTask] = useState("Study Session");
  const [viewMode, setViewMode] = useState("week"); // 'week' | 'month'
  const [monthDate, setMonthDate] = useState(new Date());
  const [showGenModal, setShowGenModal] = useState(false);
  const [genHours, setGenHours] = useState(user?.studyHoursPerDay || 4);
  const [genExamDate, setGenExamDate] = useState(user?.examDate || "");
  const [hasPlan, setHasPlan] = useState(
    () => !!localStorage.getItem("sp_study_plan"),
  );

  useEffect(() => {
    setWeekDates(getWeekDates(weekStart));
  }, [weekStart]);

  useEffect(() => {
    fetchDailyTasks();
  }, [selectedDate]);

  const fetchDailyTasks = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await plannerService.getDailyPlan(dateStr);
      if (res.data && res.data.length > 0) {
        setDailyTasks(res.data);
      } else {
        throw new Error("empty");
      }
    } catch {
      // Fallback: read from local study plan
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      try {
        const plan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
        setDailyTasks(plan[dateStr] || []);
      } catch {
        setDailyTasks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    // Try backend first, then fallback to localStorage
    try {
      await taskService.completeTask(id);
    } catch {
      // Update in local plan
      const plan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
      Object.keys(plan).forEach((dateKey) => {
        plan[dateKey] = plan[dateKey].map((t) =>
          t.id === id ? { ...t, status: "completed" } : t,
        );
      });
      localStorage.setItem("sp_study_plan", JSON.stringify(plan));
    }
    toast.success("Task completed! 🎉");
    fetchDailyTasks();
  };

  const handleSkip = async (id) => {
    try {
      await taskService.skipTask(id);
    } catch {
      // Update in local plan
      const plan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
      Object.keys(plan).forEach((dateKey) => {
        plan[dateKey] = plan[dateKey].map((t) =>
          t.id === id ? { ...t, status: "skipped", isBacklog: true } : t,
        );
      });
      localStorage.setItem("sp_study_plan", JSON.stringify(plan));
    }
    toast.success("Task skipped — will be rescheduled");
    fetchDailyTasks();
  };

  const handleGeneratePlan = () => {
    const subjectsRaw = localStorage.getItem("sp_subjects");
    if (!subjectsRaw) {
      toast.error("No subjects found! Add subjects in Subject Manager first.");
      return;
    }
    const subjects = JSON.parse(subjectsRaw);
    if (!genExamDate) {
      toast.error("Please set your exam date.");
      return;
    }
    const plan = generateStudyPlan(subjects, genExamDate, genHours);
    const totalSessions = Object.values(plan).reduce((a, d) => a + d.length, 0);
    if (totalSessions === 0) {
      toast.error("All topics are already completed! Nothing to schedule.");
      return;
    }
    localStorage.setItem("sp_study_plan", JSON.stringify(plan));
    setHasPlan(true);
    setShowGenModal(false);
    toast.success(
      `Study plan generated! ${totalSessions} sessions across ${Object.keys(plan).length} days.`,
    );
    fetchDailyTasks();
  };

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));
  const goToday = () => {
    setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
    setSelectedDate(new Date());
  };

  // Build month grid rows for month view
  const buildMonthGrid = () => {
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const gridStart = startOfWeek(mStart, { weekStartsOn: 1 });
    const gridEnd = addDays(startOfWeek(mEnd, { weekStartsOn: 1 }), 6);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  };

  const handleMonthDayClick = (date) => {
    setSelectedDate(date);
    setWeekStart(startOfWeek(date, { weekStartsOn: 1 }));
    setViewMode("week");
  };

  return (
    <AnimatedPage>
      {showPomodoro && (
        <PomodoroTimer
          taskName={pomodoroTask}
          onClose={() => setShowPomodoro(false)}
        />
      )}

      {/* ── Generate Schedule Modal ── */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary-100 rounded-xl">
                  <Sparkles size={22} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black font-heading text-gray-900">
                    Generate Smart Schedule
                  </h2>
                  <p className="text-sm text-gray-500">
                    Auto-create a study plan from your subjects
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGenModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Subjects preview */}
            {(() => {
              const subs = JSON.parse(
                localStorage.getItem("sp_subjects") || "[]",
              );
              const incomplete = subs.reduce(
                (a, s) => a + s.topics.filter((t) => !t.done).length,
                0,
              );
              return (
                <div className="mb-6">
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    📚 Your Subjects ({subs.length} subjects, {incomplete}{" "}
                    incomplete topics)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subs.length > 0 ? (
                      subs.map((s) => (
                        <span
                          key={s.id}
                          className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full border border-primary-100"
                        >
                          {s.name} · {s.topics.filter((t) => !t.done).length}{" "}
                          left
                        </span>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-xl w-full">
                        <AlertTriangle size={16} />
                        <span className="text-sm font-semibold">
                          No subjects found. Go to Subject Manager to add
                          subjects first.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Exam Date */}
            <div className="mb-5">
              <label className="text-sm font-bold text-gray-700 mb-1.5 block">
                📅 Exam Date
              </label>
              <input
                type="date"
                value={genExamDate}
                onChange={(e) => setGenExamDate(e.target.value)}
                min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                className="input-field"
              />
              {genExamDate && (
                <p className="text-xs text-gray-500 mt-1 font-semibold">
                  {getDaysUntil(genExamDate)} days from now
                </p>
              )}
            </div>

            {/* Study Hours */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 mb-1.5 block">
                ⏱ Study Hours Per Day:{" "}
                <span className="text-primary-600">{genHours}h</span>
              </label>
              <input
                type="range"
                min={1}
                max={12}
                step={0.5}
                value={genHours}
                onChange={(e) => setGenHours(Number(e.target.value))}
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-gray-400 font-semibold">
                <span>1h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <Zap size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-700 leading-snug">
                  Topics are distributed evenly across days until your exam.{" "}
                  <strong>Hard subjects get 1.5h sessions</strong>, Medium get
                  1h, Easy get 45min. Already completed topics are skipped.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGeneratePlan}
                className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 text-base"
              >
                <Sparkles size={18} /> Generate Plan
              </button>
              <button
                onClick={() => setShowGenModal(false)}
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar title="Study Planner" subtitle="Your adaptive study schedule" />
      <div className="p-8 animate-fade-in">
        {/* ── Adaptive Learning Banner ── */}
        {(() => {
          const testResults = JSON.parse(
            localStorage.getItem("sp_test_results") || "[]",
          );
          if (testResults.length === 0) return null;
          // Aggregate topic scores
          const topicAgg = {};
          testResults.forEach((r) => {
            if (r.topicScores) {
              Object.entries(r.topicScores).forEach(([topic, score]) => {
                if (!topicAgg[topic]) topicAgg[topic] = [];
                topicAgg[topic].push(score);
              });
            }
          });
          const weakTopics = Object.entries(topicAgg)
            .map(([topic, scores]) => ({
              topic,
              avg: Math.round(
                scores.reduce((a, s) => a + s, 0) / scores.length,
              ),
            }))
            .filter((t) => t.avg < 60)
            .sort((a, b) => a.avg - b.avg)
            .slice(0, 3);

          if (weakTopics.length === 0) return null;

          return (
            <div className="mb-6 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-2xl p-5 animate-fade-in">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl shrink-0">
                    <Zap size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 font-heading mb-1">
                      ⚡ Adaptive Adjustment Needed
                    </h3>
                    <p className="text-sm text-gray-600 leading-snug">
                      Your test results show weak areas in{" "}
                      <strong className="text-red-700">
                        {weakTopics
                          .map((t) => `${t.topic} (${t.avg}%)`)
                          .join(", ")}
                      </strong>
                      . Add extra revision sessions to boost your scores.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const plan = JSON.parse(
                      localStorage.getItem("sp_study_plan") || "{}",
                    );
                    let added = 0;
                    weakTopics.forEach((wt) => {
                      // Add 2 revision sessions for each weak topic in next 3 days
                      for (let d = 1; d <= 2; d++) {
                        const dateKey = format(
                          addDays(new Date(), d),
                          "yyyy-MM-dd",
                        );
                        if (!plan[dateKey]) plan[dateKey] = [];
                        plan[dateKey].push({
                          id: Date.now() + Math.random(),
                          subjectName: wt.topic,
                          topicName: `${wt.topic} — Revision Session`,
                          durationHours: 1,
                          difficulty: "Hard",
                          status: "pending",
                          isBacklog: false,
                          isAdaptive: true,
                        });
                        added++;
                      }
                    });
                    localStorage.setItem("sp_study_plan", JSON.stringify(plan));
                    setHasPlan(true);
                    toast.success(
                      `Added ${added} extra revision sessions for weak topics!`,
                    );
                    fetchDailyTasks();
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shrink-0 shadow-md shadow-amber-600/20"
                >
                  <Sparkles size={16} /> Add {weakTopics.length * 2} Revision
                  Sessions
                </button>
              </div>
            </div>
          );
        })()}

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {viewMode === "week" ? (
              <>
                <button
                  onClick={prevWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="font-semibold text-text-primary text-sm md:text-base font-heading">
                  {formatShortDate(weekStart)} —{" "}
                  {formatShortDate(addDays(weekStart, 6))}
                </h3>
                <button
                  onClick={nextWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setMonthDate(addMonths(monthDate, -1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                >
                  <ChevronLeft size={20} />
                </button>
                <h3 className="font-semibold text-text-primary text-sm md:text-base font-heading">
                  {format(monthDate, "MMMM yyyy")}
                </h3>
                <button
                  onClick={() => setMonthDate(addMonths(monthDate, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {/* Generate Schedule button */}
            <button
              onClick={() => setShowGenModal(true)}
              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white text-xs md:text-sm py-2 md:py-2.5 px-3 md:px-5 rounded-xl font-bold shadow-md shadow-primary-600/20 flex items-center gap-1.5 transition-all hover:shadow-lg"
            >
              <Sparkles size={16} /> Generate Plan
            </button>
            {user?.examDate && (
              <div className="bg-blue-50 text-blue-700 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border border-blue-100 shadow-sm hidden sm:flex items-center gap-1.5">
                <CalIcon size={16} /> Exam in {getDaysUntil(user.examDate)} days
              </div>
            )}
            <button
              onClick={goToday}
              className="btn-secondary text-xs md:text-sm py-2 px-3 md:px-4 shadow-sm"
            >
              Today
            </button>
            <button
              onClick={() => {
                setPomodoroTask("Study Session");
                setShowPomodoro(true);
              }}
              className="btn-primary text-xs md:text-sm py-2 px-3 md:px-4 shadow-sm flex items-center gap-1.5 hidden sm:flex"
            >
              <Clock size={15} /> Focus
            </button>
            {/* View mode toggle */}
            <div className="flex items-center bg-surface-muted rounded-xl p-1 border border-border">
              <button
                onClick={() => setViewMode("week")}
                className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${viewMode === "week" ? "bg-white text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"}`}
              >
                <Rows3 size={15} className="hidden sm:block" /> Week
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all ${viewMode === "month" ? "bg-white text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"}`}
              >
                <LayoutGrid size={15} className="hidden sm:block" /> Month
              </button>
            </div>
          </div>
        </div>

        {/* ── Month Calendar View ── */}
        {viewMode === "month" && (
          <div className="card mb-8 animate-fade-in">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[11px] font-bold text-text-muted uppercase tracking-wider py-2"
                >
                  {d}
                </div>
              ))}
            </div>
            {/* Date cells */}
            <div className="grid grid-cols-7 gap-1">
              {buildMonthGrid().map((date, i) => {
                const inMonth = isSameMonth(date, monthDate);
                const isToday = isSameDay(date, new Date());
                const isSelected = isSameDay(date, selectedDate);
                return (
                  <button
                    key={i}
                    onClick={() => handleMonthDayClick(date)}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-primary-600 text-white shadow-md"
                        : isToday
                          ? "bg-primary-50 text-primary-600 border-2 border-primary-200"
                          : inMonth
                            ? "hover:bg-surface-muted text-text-primary"
                            : "text-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {format(date, "d")}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-600" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-text-muted text-center mt-4">
              Click any day to view its schedule in Week view
            </p>
          </div>
        )}

        {/* ── Week Strip (only when in week mode) ── */}
        {viewMode === "week" && (
          <div className="grid grid-cols-7 gap-2 mb-8">
            {weekDates.map((date, i) => {
              const isSelected =
                date.toDateString() === selectedDate.toDateString();
              const today = isDateToday(date);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center py-3 px-2 rounded-xl transition-all ${isSelected ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25" : today ? "bg-primary-50 text-primary-600" : "hover:bg-gray-100 text-text-primary"}`}
                >
                  <span
                    className={`text-xs font-medium ${isSelected ? "text-blue-200" : "text-text-muted"}`}
                  >
                    {formatDayName(date)}
                  </span>
                  <span className="text-lg font-bold font-mono">
                    {formatDayNumber(date)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Day Tasks */}
        {viewMode === "week" && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-text-primary font-heading">
                {isDateToday(selectedDate)
                  ? "Today's Schedule"
                  : `Schedule for ${formatShortDate(selectedDate)}`}
              </h3>
              <span className="text-sm font-semibold text-text-muted">
                {dailyTasks.filter((t) => t.status === "completed").length} of{" "}
                {dailyTasks.length} sessions completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-5 p-5 bg-white rounded-2xl border border-gray-100">
                      <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <Skeleton className="w-full h-full" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between items-start">
                        <div className="w-full">
                          <Skeleton className="w-20 h-4 mb-2 rounded-full" />
                          <Skeleton className="w-48 h-6 mb-2" />
                          <Skeleton className="w-32 h-4 mb-4" />
                        </div>
                        <Skeleton className="w-full h-10 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </>
              ) : dailyTasks.length > 0 ? (
                dailyTasks.map((task) => {
                  const isCompleted = task.status === "completed";
                  const imageIds = [1042, 1050, 1062, 1079, 1084]; // Realistic unspash placeholders
                  const randomId =
                    imageIds[Math.abs(task.id || 0) % imageIds.length];

                  return (
                    <div
                      key={task.id}
                      className={`flex flex-col sm:flex-row gap-5 p-5 bg-white rounded-2xl border ${isCompleted ? "border-gray-200 opacity-60" : "border-gray-100 hover:shadow-md hover:-translate-y-1 hover:border-primary-100"} transition-all duration-300 relative overflow-hidden group`}
                    >
                      {/* Subject Image */}
                      <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={`https://picsum.photos/id/${randomId}/400/300`}
                          alt={task.subjectName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between items-start">
                        <div className="w-full">
                          <div className="flex justify-between items-start mb-1 w-full">
                            <p className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                              {task.subjectName}
                            </p>
                            {isCompleted ? (
                              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                COMPLETED
                              </span>
                            ) : task.isBacklog ? (
                              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                RESCHEDULED
                              </span>
                            ) : (
                              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                NEXT UP
                              </span>
                            )}
                          </div>
                          <h4
                            className={`text-lg font-bold font-heading mb-1 ${isCompleted ? "line-through text-text-muted" : "text-text-primary"}`}
                          >
                            {task.topicName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium mb-4">
                            <Clock size={14} />{" "}
                            {formatDuration(task.durationHours)} session
                          </div>
                        </div>

                        <div className="w-full mt-auto">
                          {isCompleted ? (
                            <button
                              onClick={() => handleSkip(task.id)}
                              className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1.5 transition-colors"
                            >
                              <CheckCircle size={16} /> Mark as incomplete
                            </button>
                          ) : (
                            <div className="flex gap-2 w-full">
                              <button
                                onClick={() => handleComplete(task.id)}
                                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg py-2 text-sm font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm shadow-primary-600/20"
                              >
                                <Play size={16} /> Start Session
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Left Border Accent for Active Tasks */}
                      {!isCompleted && (
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${task.isBacklog ? "bg-amber-500" : "bg-primary-500"}`}
                        ></div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-16 bg-white border border-gray-100 rounded-2xl">
                  <CalIcon size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-text-muted font-medium mb-4">
                    {hasPlan
                      ? "No tasks scheduled for this day"
                      : "No study plan generated yet"}
                  </p>
                  {!hasPlan && (
                    <button
                      onClick={() => setShowGenModal(true)}
                      className="btn-primary mx-auto flex items-center gap-2 text-sm"
                    >
                      <Sparkles size={16} /> Generate Your First Schedule
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default StudyPlanner;
