import { useState } from "react";
import {
  Users,
  FileText,
  BarChart3,
  Plus,
  Upload,
  Eye,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Priya Sharma",
    rollNo: "CS21001",
    progress: 94,
    streak: 42,
    tasksCompleted: 38,
    testAvg: 89,
    status: "On Track",
    lastActive: "2h ago",
  },
  {
    id: 2,
    name: "Rahul Verma",
    rollNo: "CS21002",
    progress: 79,
    streak: 15,
    tasksCompleted: 28,
    testAvg: 76,
    status: "On Track",
    lastActive: "5h ago",
  },
  {
    id: 3,
    name: "Anjali Gupta",
    rollNo: "CS21003",
    progress: 62,
    streak: 4,
    tasksCompleted: 19,
    testAvg: 61,
    status: "At Risk",
    lastActive: "1d ago",
  },
  {
    id: 4,
    name: "Karthik Nair",
    rollNo: "CS21004",
    progress: 88,
    streak: 30,
    tasksCompleted: 35,
    testAvg: 84,
    status: "On Track",
    lastActive: "1h ago",
  },
  {
    id: 5,
    name: "Sneha Patel",
    rollNo: "CS21005",
    progress: 45,
    streak: 2,
    tasksCompleted: 12,
    testAvg: 48,
    status: "Critical",
    lastActive: "3d ago",
  },
  {
    id: 6,
    name: "Arjun Singh",
    rollNo: "CS21006",
    progress: 73,
    streak: 21,
    tasksCompleted: 26,
    testAvg: 71,
    status: "On Track",
    lastActive: "4h ago",
  },
];

const MOCK_TESTS = [
  {
    id: 1,
    title: "Data Structures — Chapter 1",
    subject: "DSA",
    questions: 20,
    duration: 30,
    attempts: 4,
    avgScore: 74,
    created: "2 days ago",
  },
  {
    id: 2,
    title: "Operating Systems Concepts",
    subject: "OS",
    questions: 25,
    duration: 45,
    attempts: 3,
    avgScore: 68,
    created: "5 days ago",
  },
  {
    id: 3,
    title: "Computer Networks Basics",
    subject: "CN",
    questions: 15,
    duration: 25,
    attempts: 5,
    avgScore: 81,
    created: "1 week ago",
  },
];

const StatusBadge = ({ status }) => {
  const colors = {
    "On Track": "bg-green-100 text-green-700",
    "At Risk": "bg-amber-100 text-amber-700",
    Critical: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${colors[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
};

const InstructorPortal = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpload, setShowUpload] = useState(false);
  const [newTest, setNewTest] = useState({
    title: "",
    subject: "",
    questions: 20,
    duration: 30,
  });

  const avgProgress = Math.round(
    MOCK_STUDENTS.reduce((a, s) => a + s.progress, 0) / MOCK_STUDENTS.length,
  );
  const atRisk = MOCK_STUDENTS.filter((s) => s.status !== "On Track").length;
  const avgScore = Math.round(
    MOCK_STUDENTS.reduce((a, s) => a + s.testAvg, 0) / MOCK_STUDENTS.length,
  );

  const TABS = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "Students", icon: Users },
    { id: "tests", label: "Tests", icon: FileText },
  ];

  return (
    <AnimatedPage>
      <Navbar
        title="Instructor Portal"
        subtitle="Manage students, upload tests, and track class performance"
      />
      <div className="p-4 sm:p-8 animate-fade-in">
        {/* Role badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-violet-100 text-violet-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
            <Star size={15} /> Instructor View
          </div>
          <p className="text-text-muted text-sm">
            CS Department · Semester VI · 2025-26
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-muted p-1 rounded-2xl mb-8 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === t.id ? "bg-white text-primary-700 shadow-sm" : "text-text-muted hover:text-text-primary"}`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Students",
                  value: MOCK_STUDENTS.length,
                  icon: "👥",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  label: "Avg. Progress",
                  value: `${avgProgress}%`,
                  icon: "📈",
                  color: "bg-green-50 text-green-600",
                },
                {
                  label: "At Risk",
                  value: atRisk,
                  icon: "⚠️",
                  color: "bg-amber-50 text-amber-600",
                },
                {
                  label: "Avg. Test Score",
                  value: `${avgScore}%`,
                  icon: "📝",
                  color: "bg-violet-50 text-violet-600",
                },
              ].map((s, i) => (
                <div key={i} className="card flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl text-lg ${s.color}`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xl font-black font-mono text-text-primary">
                      {s.value}
                    </p>
                    <p className="text-xs text-text-muted font-semibold">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 className="font-bold font-heading text-text-primary mb-4">
                Class Progress Overview
              </h3>
              <div className="space-y-3">
                {MOCK_STUDENTS.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-semibold text-text-primary truncate">
                      {s.name.split(" ")[0]}
                    </div>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${s.progress >= 80 ? "bg-green-500" : s.progress >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm font-bold text-text-primary">
                      {s.progress}%
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {activeTab === "students" && (
          <div className="space-y-3 animate-fade-in">
            {MOCK_STUDENTS.map((s) => (
              <div key={s.id} className="card hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 text-white font-black flex items-center justify-center shrink-0">
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-text-primary">{s.name}</p>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="text-xs text-text-muted">
                      {s.rollNo} · Last active {s.lastActive} · 🔥 {s.streak}d
                      streak
                    </p>
                  </div>
                  <div className="flex items-center gap-8 shrink-0">
                    <div className="text-center">
                      <p className="text-lg font-black font-mono text-text-primary">
                        {s.progress}%
                      </p>
                      <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                        Progress
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black font-mono text-text-primary">
                        {s.testAvg}%
                      </p>
                      <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                        Avg Score
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black font-mono text-text-primary">
                        {s.tasksCompleted}
                      </p>
                      <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                        Tasks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TESTS TAB */}
        {activeTab === "tests" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold font-heading text-text-primary">
                Your Tests
              </h3>
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="btn-primary flex items-center gap-2 text-sm py-2.5 px-4"
              >
                <Plus size={16} /> Create New Test
              </button>
            </div>

            {showUpload && (
              <div className="card mb-4 border-2 border-primary-200 bg-primary-50/20 animate-fade-in">
                <h4 className="font-bold mb-4">New Test</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <input
                    className="input-field"
                    placeholder="Test title"
                    value={newTest.title}
                    onChange={(e) =>
                      setNewTest((t) => ({ ...t, title: e.target.value }))
                    }
                  />
                  <input
                    className="input-field"
                    placeholder="Subject (e.g., DSA)"
                    value={newTest.subject}
                    onChange={(e) =>
                      setNewTest((t) => ({ ...t, subject: e.target.value }))
                    }
                  />
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">
                      Questions: {newTest.questions}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={newTest.questions}
                      onChange={(e) =>
                        setNewTest((t) => ({
                          ...t,
                          questions: +e.target.value,
                        }))
                      }
                      className="w-full accent-primary-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 mb-1 block">
                      Duration: {newTest.duration} min
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="180"
                      step="5"
                      value={newTest.duration}
                      onChange={(e) =>
                        setNewTest((t) => ({ ...t, duration: +e.target.value }))
                      }
                      className="w-full accent-primary-600"
                    />
                  </div>
                </div>
                <div className="border-2 border-dashed border-primary-200 rounded-xl p-6 text-center mb-4 cursor-pointer hover:bg-primary-50 transition-colors">
                  <Upload size={24} className="text-primary-400 mx-auto mb-2" />
                  <p className="text-sm text-text-muted">
                    Upload question bank (CSV, JSON, DOCX)
                  </p>
                  <p className="text-xs text-primary-600 font-semibold mt-1">
                    Click to browse or drag & drop
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toast.success(
                        "Test created! Students can now attempt it.",
                      );
                      setShowUpload(false);
                      setNewTest({
                        title: "",
                        subject: "",
                        questions: 20,
                        duration: 30,
                      });
                    }}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    Create Test
                  </button>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {MOCK_TESTS.map((t) => (
                <div key={t.id} className="card hover:shadow-md transition-all">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-primary">{t.title}</p>
                      <p className="text-xs text-text-muted">
                        {t.subject} · {t.questions} questions · {t.duration} min
                        · Created {t.created}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-black font-mono text-text-primary">
                          {t.attempts}
                        </p>
                        <p className="text-[10px] text-text-muted uppercase font-bold">
                          Attempts
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black font-mono text-text-primary">
                          {t.avgScore}%
                        </p>
                        <p className="text-[10px] text-text-muted uppercase font-bold">
                          Avg Score
                        </p>
                      </div>
                      <button className="btn-secondary text-sm py-2 px-3 flex items-center gap-1">
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default InstructorPortal;
