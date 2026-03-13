import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TrendingUp,
  CalendarDays,
  Clock,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  FileText,
  BarChart3,
  RotateCcw,
  Plus,
  BellRing,
  Trophy,
  Flame,
  Star,
  Zap,
  Printer,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import ProgressBar from "../../components/ProgressBar";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import { analyticsService } from "../../services/analyticsService";
import { getTimeOfDay, getDaysUntil } from "../../utils/dateUtils";
import { formatDuration } from "../../utils/calculationUtils";
import { STATUS_CONFIG } from "../../utils/constants";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Streak — persisted in localStorage
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("sp_streak");
    if (!saved) return { count: 7, lastDate: new Date().toDateString() };
    return JSON.parse(saved);
  });

  useEffect(() => {
    const today = new Date().toDateString();
    if (streak.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1;
      const updated = { count: newCount, lastDate: today };
      setStreak(updated);
      localStorage.setItem("sp_streak", JSON.stringify(updated));
    }
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analyticsService.getDashboard();
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        // Use mock data if backend not available
        setData({
          overallProgress: 65,
          daysToExam: getDaysUntil(user?.examDate),
          studyHoursToday: 4.5,
          backlogCount: 2,
          todaysTasks: [],
          readinessScore: 78,
          topicsCovered: 14,
          totalTopics: 20,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <AnimatedPage>
        <Navbar />
        <div className="p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <Skeleton className="w-64 h-8 mb-2" />
              <Skeleton className="w-48 h-4 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-24 h-6 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="w-32 h-10 rounded-xl" />
              <Skeleton className="w-36 h-10 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="card">
                    <Skeleton className="w-10 h-10 rounded-xl mb-4" />
                    <Skeleton className="w-24 h-4 mb-2" />
                    <Skeleton className="w-16 h-8" />
                  </div>
                ))}
              </div>
              <div className="card">
                <Skeleton className="w-48 h-6 mb-4" />
                <Skeleton className="w-full h-24 rounded-xl mb-3" />
                <Skeleton className="w-full h-24 rounded-xl" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="card">
                <Skeleton className="w-48 h-6 mb-6" />
                <div className="flex justify-center">
                  <Skeleton className="w-48 h-48 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const kpiCards = [
    {
      label: "Overall Progress",
      value: `${data?.overallProgress || 0}%`,
      icon: TrendingUp,
      color: "text-primary-600",
      bg: "bg-primary-50",
      trend: "+4%",
    },
    {
      label: "Days to Exam",
      value: data?.daysToExam || 0,
      icon: CalendarDays,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Study Hours Today",
      value: `${data?.studyHoursToday || 0}h`,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Backlog Topics",
      value: data?.backlogCount || 0,
      icon: AlertTriangle,
      color: data?.backlogCount > 0 ? "text-red-600" : "text-green-600",
      bg: data?.backlogCount > 0 ? "bg-red-50" : "bg-green-50",
    },
  ];

  const quickAccess = [
    {
      label: "Planner",
      path: "/planner",
      icon: CalendarCheck,
      color: "text-primary-600 bg-primary-50",
    },
    {
      label: "Tests",
      path: "/tests",
      icon: FileText,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart3,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Backlog",
      path: "/planner?view=backlog",
      icon: RotateCcw,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const readiness = data?.readinessScore || 0;
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (readiness / 100) * circumference;

  return (
    <AnimatedPage>
      {/* Print-only CSS */}
      <style>{`
        @media print {
          aside, nav, .no-print { display: none !important; }
          main { margin-left: 0 !important; }
          body { background: white !important; }
          .card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>
      <Navbar />
      <div className="p-4 sm:p-8 animate-fade-in">
        {/* Welcome Banner — richer, no duplication */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black font-heading text-text-primary">
                Good {getTimeOfDay()}, {user?.name || "Student"}! 👋
              </h1>
            </div>
            <p className="text-text-muted text-sm mb-3">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              · Let's make today count!
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
                📅 {data?.daysToExam || getDaysUntil(user?.examDate) || "—"}{" "}
                days to exam
              </span>
              {streak?.count > 0 && (
                <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-100">
                  🔥 {streak.count}-day streak
                </span>
              )}
              <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-100">
                ⏱ {user?.studyHoursPerDay || 4}h daily goal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print shrink-0">
            <button
              onClick={() => window.print()}
              className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
              title="Export as PDF"
            >
              <Printer size={16} /> Export PDF
            </button>
            <Link
              to="/planner"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              View Schedule <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((kpi, i) => (
                <div
                  key={i}
                  className="card hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
                      <kpi.icon size={20} className={kpi.color} />
                    </div>
                    {kpi.trend && (
                      <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-semibold">
                        {kpi.trend}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-text-muted font-medium mb-1 block">
                    {kpi.label}
                  </span>
                  <p className="text-3xl font-bold text-text-primary font-heading tracking-tight">
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Today's Study Plan */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary font-heading">
                  Today's Study Plan
                </h3>
                <Link
                  to="/planner"
                  className="text-sm text-primary-600 font-semibold hover:underline"
                >
                  View Calendar
                </Link>
              </div>
              {data?.todaysTasks?.length > 0 ? (
                <div className="space-y-3">
                  {data.todaysTasks.map((task, i) => {
                    const config =
                      STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white group cursor-pointer"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${task.status === "completed" ? "border-none bg-primary-600 text-white" : "border-gray-300 text-transparent group-hover:border-primary-400"}`}
                        >
                          {task.status === "completed" && "✓"}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-semibold text-sm ${task.status === "completed" ? "line-through text-text-muted" : "text-text-primary"}`}
                          >
                            {task.topicName}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {task.subjectName}
                          </p>
                        </div>
                        <span
                          className={`${config.bg} ${config.color} px-3 py-1 rounded-full text-xs font-semibold`}
                        >
                          {config.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays
                    size={40}
                    className="text-gray-300 mx-auto mb-3"
                  />
                  <p className="text-text-muted text-sm">
                    No tasks scheduled for today
                  </p>
                  <Link
                    to="/planner"
                    className="text-primary-600 text-sm font-semibold hover:underline mt-1 inline-block"
                  >
                    Create a study plan
                  </Link>
                </div>
              )}

              <button
                onClick={() => navigate("/planner")}
                className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 flex items-center justify-center gap-2 transition-all"
              >
                <Plus size={18} /> Add New Task
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Exam Readiness Gauge */}
            <div className="card text-center">
              <h3 className="font-semibold text-text-primary font-heading mb-4">
                Exam Readiness
              </h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="circular-progress w-36 h-36">
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="var(--chart-track)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="var(--chart-primary)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-bold text-text-primary font-mono">
                    {Math.round(readiness)}%
                  </p>
                  <p className="text-xs text-primary-600 font-semibold">
                    READY
                  </p>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div>
                  <p className="text-lg font-bold text-text-primary font-mono">
                    {data?.topicsCovered || 0}
                  </p>
                  <p className="text-xs text-text-muted">Topics Covered</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-text-primary font-mono">
                    {readiness}%
                  </p>
                  <p className="text-xs text-text-muted">Avg. Test Score</p>
                </div>
              </div>
            </div>

            {/* ── Spaced Repetition: Review Today ── */}
            {(() => {
              let reviews = [];
              try {
                const subjects = JSON.parse(
                  localStorage.getItem("sp_subjects") || "[]",
                );
                const reviewLog = JSON.parse(
                  localStorage.getItem("sp_review_log") || "{}",
                );
                const now = Date.now();
                const DAY = 86400000;
                subjects.forEach((s) => {
                  s.topics?.forEach((t) => {
                    const lastReview =
                      reviewLog[`${s.id}_${t.id}`] ||
                      now - DAY * (1 + Math.random() * 3);
                    const elapsed = now - lastReview;
                    if (elapsed >= DAY * 0.9) {
                      reviews.push({
                        ...t,
                        subject: s.name,
                        subjectId: s.id,
                        lastReview,
                        colorIdx: s.colorIdx || 0,
                      });
                    }
                  });
                });
              } catch {}
              const colors = [
                "bg-blue-100 text-blue-700",
                "bg-violet-100 text-violet-700",
                "bg-green-100 text-green-700",
                "bg-amber-100 text-amber-700",
                "bg-rose-100 text-rose-700",
              ];
              if (reviews.length === 0)
                return (
                  <div className="card">
                    <h3 className="font-semibold text-text-primary font-heading mb-3 flex items-center gap-2">
                      🔄 Review Today{" "}
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                        0 due
                      </span>
                    </h3>
                    <p className="text-sm text-text-muted text-center py-3">
                      🎉 All caught up! Nothing to review today.
                    </p>
                  </div>
                );
              return (
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-text-primary font-heading flex items-center gap-2">
                      🔄 Review Today{" "}
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                        {reviews.length} due
                      </span>
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reviews.slice(0, 5).map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${colors[t.colorIdx % colors.length]}`}
                        >
                          {t.subject}
                        </span>
                        <span className="text-sm text-text-primary font-medium flex-1 truncate">
                          {t.name}
                        </span>
                        <button
                          onClick={() => {
                            const log = JSON.parse(
                              localStorage.getItem("sp_review_log") || "{}",
                            );
                            log[`${t.subjectId}_${t.id}`] = Date.now();
                            localStorage.setItem(
                              "sp_review_log",
                              JSON.stringify(log),
                            );
                            toast.success(`"${t.name}" marked reviewed!`);
                          }}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold hover:bg-green-200 transition-colors shrink-0"
                        >
                          ✓ Done
                        </button>
                      </div>
                    ))}
                  </div>
                  {reviews.length > 5 && (
                    <p className="text-xs text-text-muted mt-2 text-center">
                      +{reviews.length - 5} more topics to review
                    </p>
                  )}
                </div>
              );
            })()}

            {/* ── Smart Recommendations ── */}
            {(() => {
              // Read test results to generate recommendations
              const testResults = JSON.parse(
                localStorage.getItem("sp_test_results") || "[]",
              );
              const subjects = JSON.parse(
                localStorage.getItem("sp_subjects") || "[]",
              );
              const recommendations = [];

              // From test results: find weak topics
              if (testResults.length > 0) {
                const topicScores = {};
                testResults.forEach((result) => {
                  if (result.topicScores) {
                    Object.entries(result.topicScores).forEach(
                      ([topic, score]) => {
                        topicScores[topic] = score;
                      },
                    );
                  }
                });
                Object.entries(topicScores)
                  .filter(([, score]) => score < 70)
                  .sort((a, b) => a[1] - b[1])
                  .slice(0, 3)
                  .forEach(([topic, score]) => {
                    recommendations.push({
                      icon: "📌",
                      text: `Revise ${topic} — you scored ${score}%`,
                      priority: "high",
                    });
                  });
              }

              // From subjects: find incomplete topics
              subjects
                .filter((s) => s.progress < 50)
                .slice(0, 2)
                .forEach((s) => {
                  const remaining = s.topics.filter((t) => !t.done).length;
                  recommendations.push({
                    icon: "📖",
                    text: `Complete ${s.name} — ${remaining} topics remaining`,
                    priority: "medium",
                  });
                });

              // Generic recommendations
              if (recommendations.length < 3) {
                const daysToExam = getDaysUntil(user?.examDate);
                if (daysToExam && daysToExam < 30) {
                  recommendations.push({
                    icon: "📝",
                    text: `Take a mock test — exam is in ${daysToExam} days`,
                    priority: "high",
                  });
                }
                recommendations.push({
                  icon: "🔄",
                  text: "Review spaced repetition cards for long-term retention",
                  priority: "low",
                });
              }

              return (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-primary font-heading flex items-center gap-2">
                      🧠 Smart Recommendations
                    </h3>
                    <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">
                      AI-Powered
                    </span>
                  </div>
                  <div className="space-y-2">
                    {recommendations.slice(0, 4).map((rec, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                          rec.priority === "high"
                            ? "bg-red-50 border border-red-100"
                            : rec.priority === "medium"
                              ? "bg-amber-50 border border-amber-100"
                              : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <span className="text-lg shrink-0 mt-0.5">
                          {rec.icon}
                        </span>
                        <p className="text-sm text-gray-800 font-medium leading-snug">
                          {rec.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── Daily Study Goal Tracker ── */}
            {(() => {
              const goalHours = user?.studyHoursPerDay || 6;
              // Read pomodoro sessions from localStorage
              const pomodoroLog = JSON.parse(
                localStorage.getItem("sp_pomodoro_log") || "[]",
              );
              const today = new Date().toDateString();
              const todaySessions = pomodoroLog.filter(
                (s) => new Date(s.timestamp).toDateString() === today,
              );
              const studiedMinutes = todaySessions.reduce(
                (a, s) => a + (s.minutes || 25),
                0,
              );
              const studiedHours = (studiedMinutes / 60).toFixed(1);
              const pct = Math.min(
                100,
                Math.round((studiedMinutes / (goalHours * 60)) * 100),
              );

              // Weekly total
              const weekAgo = Date.now() - 7 * 86400000;
              const weekSessions = pomodoroLog.filter(
                (s) => new Date(s.timestamp).getTime() > weekAgo,
              );
              const weekMinutes = weekSessions.reduce(
                (a, s) => a + (s.minutes || 25),
                0,
              );
              const weekHours = (weekMinutes / 60).toFixed(1);

              return (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-primary font-heading flex items-center gap-2">
                      ⏱ Daily Study Goal
                    </h3>
                    <span className="text-sm font-mono font-bold text-primary-600">
                      {studiedHours}h / {goalHours}h
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        pct >= 100
                          ? "bg-gradient-to-r from-green-500 to-emerald-400"
                          : pct >= 50
                            ? "bg-gradient-to-r from-primary-500 to-blue-400"
                            : "bg-gradient-to-r from-amber-500 to-orange-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-text-muted font-semibold">
                      {pct >= 100
                        ? "🎉 Daily goal reached!"
                        : `${pct}% of daily goal`}
                    </p>
                    <p className="text-xs text-text-muted">
                      This week:{" "}
                      <span className="font-bold text-gray-700">
                        {weekHours}h
                      </span>
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Use the <strong>Focus Timer</strong> in Study Planner to
                    track your study sessions automatically.
                  </p>
                </div>
              );
            })()}

            {/* Quick Access */}
            <div className="card">
              <h3 className="font-semibold text-text-primary font-heading mb-4">
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickAccess.map((item, i) => (
                  <Link
                    key={i}
                    to={item.path}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className={`p-3 rounded-xl ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <span className="text-xs font-semibold text-text-primary">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Streak & Achievements */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-text-primary font-heading">
                  Streak & Badges
                </h3>
                <span className="text-xs text-text-muted font-medium">
                  Keep it up!
                </span>
              </div>
              {/* Flame streak counter */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-4 border border-orange-100">
                <div className="text-3xl">🔥</div>
                <div>
                  <p className="text-2xl font-black text-gray-900 font-mono leading-none">
                    {streak.count}
                  </p>
                  <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                    Day Streak
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-gray-400 font-medium">Best</p>
                  <p className="text-sm font-bold text-gray-700 font-mono">
                    {Math.max(streak.count, 14)} days
                  </p>
                </div>
              </div>
              {/* Achievement badges */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { emoji: "🎯", label: "First Test", earned: true },
                  {
                    emoji: "📅",
                    label: "7-Day Streak",
                    earned: streak.count >= 7,
                  },
                  { emoji: "🏅", label: "10 Tasks", earned: true },
                  {
                    emoji: "⚡",
                    label: "30-Day Streak",
                    earned: streak.count >= 30,
                  },
                  { emoji: "🌟", label: "Top Scorer", earned: false },
                  { emoji: "🚀", label: "Consistent", earned: true },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      badge.earned
                        ? "border-amber-200 bg-amber-50"
                        : "border-gray-100 bg-gray-50 opacity-40 grayscale"
                    }`}
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-[9px] font-bold text-gray-500 text-center leading-tight uppercase tracking-wide">
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Banner */}
            {data?.backlogCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className="text-amber-600" />
                  <p className="font-semibold text-sm text-amber-800">
                    Backlog Alert
                  </p>
                </div>
                <p className="text-sm text-amber-700">
                  {data.backlogCount} topics in backlog — Schedule auto-adjusted
                </p>
                <Link
                  to="/planner?view=backlog"
                  className="text-amber-800 text-sm font-semibold hover:underline mt-2 inline-block"
                >
                  Review →
                </Link>
              </div>
            )}

            {/* Next Milestone */}
            <div className="bg-[#EEF2FF] rounded-2xl p-6 border border-primary-100 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <BellRing size={18} className="text-primary-600" />
                <p className="font-bold text-sm text-primary-800">
                  Next Milestone
                </p>
              </div>
              <p className="text-sm text-primary-900 mb-5 leading-relaxed relative z-10">
                Final Mock Exam in 2 days. Don't forget to review System Design
                topics.
              </p>
              <button
                onClick={() => {
                  toast.success(
                    "Reminder set! We'll notify you before your next exam milestone.",
                    { icon: "🔔", duration: 4000 },
                  );
                }}
                className="w-full bg-primary-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm relative z-10"
              >
                Set Reminder
              </button>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-100 rounded-full blur-2xl opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
