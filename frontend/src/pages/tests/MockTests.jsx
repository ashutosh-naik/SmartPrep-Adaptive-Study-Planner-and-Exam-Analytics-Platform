import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Star,
  Clock,
  FileText,
  Lock,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import ProgressBar from "../../components/ProgressBar";
import EmptyState from "../../components/EmptyState";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import { testService } from "../../services/testService";

import {
  getDifficultyColor,
  formatMinutes,
} from "../../utils/calculationUtils";
import { useSelector } from "react-redux";
import { getDaysUntil } from "../../utils/dateUtils";

const MockTests = () => {
  const [tests, setTests] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    avgScore: 0,
    timeSpent: 0,
  });
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const [testsRes, summaryRes] = await Promise.all([
          testService.getAllTests(),
          testService.getTestSummary(),
        ]);
        setTests(testsRes.data || []);
        setSummary(summaryRes.data || summary);
      } catch {
        /* keep defaults */
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const subjects = [
    "All",
    ...new Set(tests.map((t) => t.subjectName).filter(Boolean)),
  ];
  const allFiltered =
    activeTab === "All"
      ? tests
      : tests.filter((t) => t.subjectName === activeTab);
  const filtered = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;
  const daysToExam = user?.examDate ? getDaysUntil(user.examDate) : null;

  const stats = [
    {
      label: "Total Tests",
      value: summary.total,
      icon: FileText,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Completed",
      value: summary.completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Avg Score",
      value: `${summary.avgScore}%`,
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Time Spent",
      value: formatMinutes(summary.timeSpent),
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <AnimatedPage>
      <Navbar
        title="Mock Tests"
        subtitle="Practice and improve your scores with timed assessments."
      />
      <div className="p-8 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted font-medium">
                  {s.label}
                </span>
                <div className={`p-2 rounded-lg ${s.bg}`}>
                  <s.icon size={16} className={s.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-text-primary font-mono">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Subject Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveTab(sub)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === sub ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25" : "bg-surface border border-gray-200 text-text-muted hover:border-primary-300"}`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Test Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <Skeleton className="w-full h-40" />
                <div className="p-5">
                  <div className="flex justify-between items-end mb-4">
                    <div className="flex gap-2">
                       <Skeleton className="w-16 h-6 rounded-md" />
                       <Skeleton className="w-16 h-6 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-12 rounded-xl mt-6" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((test) => {
                const diffColor = getDifficultyColor(test.difficulty);
                const imageIds = [1027, 1032, 1043, 1051, 1060, 1073];
                const randomId =
                  imageIds[Math.abs(test.id || 0) % imageIds.length];

                return (
                  <div
                    key={test.id}
                    className="bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Image Header */}
                    <div className="h-40 bg-gray-200 relative overflow-hidden">
                      <img
                        src={`https://picsum.photos/id/${randomId}/400/200`}
                        alt={test.subjectName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-gray-900/10"></div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <span
                          className={`${diffColor.bg} ${diffColor.text} px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-opacity-95 shadow-sm`}
                        >
                          {test.difficulty}
                        </span>
                        {test.isLocked && (
                          <span className="bg-gray-900/70 text-white backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                            <Lock size={12} /> LOCKED
                          </span>
                        )}
                      </div>

                      {/* Bottom Title */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-bold text-white font-heading text-xl mb-1 drop-shadow-md leading-tight">
                          {test.title}
                        </h3>
                        <p className="text-xs text-blue-100 font-semibold drop-shadow-md">
                          {test.subjectName}
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-md">
                            <FileText size={14} className="text-gray-400" />{" "}
                            {test.totalQuestions} Qs
                          </span>
                          <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1.5 rounded-md">
                            <Clock size={14} className="text-gray-400" />{" "}
                            {test.durationMinutes}m
                          </span>
                        </div>
                        {test.attempted && (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 font-bold uppercase mb-0.5 tracking-wider">
                              Score
                            </span>
                            <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                              {test.score}%
                            </span>
                          </div>
                        )}
                      </div>

                      {test.attempted && (
                        <ProgressBar
                          value={test.score}
                          color="bg-gradient-to-r from-green-400 to-green-600"
                          height="h-2"
                          className="mb-5 bg-gray-100"
                        />
                      )}

                      <button
                        onClick={() => navigate(`/tests/${test.id}`)}
                        disabled={test.isLocked}
                        className={`mt-1 w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          test.isLocked
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : test.attempted
                              ? "bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                              : "bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-600/25"
                        }`}
                      >
                        {test.isLocked
                          ? "Prerequisites Required"
                          : test.attempted
                            ? "Retake Test"
                            : "Start Test"}{" "}
                        {!test.isLocked && <ArrowRight size={18} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="bg-white border-2 border-gray-200 text-text-primary px-8 py-3 rounded-xl font-bold text-sm hover:border-gray-300 hover:bg-gray-50 flex items-center gap-2 mx-auto justify-center transition-colors shadow-sm"
                >
                  Load More Tests <ChevronDown size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            type="tests"
            title="No mock tests yet"
            subtitle="Your instructor hasn't added any tests. Try the built-in demo test to practice!"
            actionLabel="Try Demo Test →"
            onAction={() => navigate("/tests/demo")}
          />
        )}

        {/* CTA Banner */}
        <div className="mt-8 card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold font-heading">
                Ready for the Real Thing?
              </h3>
              <p className="text-blue-200 mt-1">
                Take a full-length timed mock exam
              </p>
            </div>
            <button
              onClick={() => {
                const firstTest = tests.find((t) => !t.isLocked);
                if (firstTest) navigate(`/tests/${firstTest.id}`);
                else navigate("/tests/demo");
              }}
              className="bg-surface text-primary-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              {tests.length > 0 ? "Start Full Mock Test" : "Try Demo Test →"}
            </button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default MockTests;
