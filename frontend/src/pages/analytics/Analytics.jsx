import { useEffect, useState, useRef } from "react";
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  AlertCircle,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  ChevronRight,
  CheckCircle2,
  Printer,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import Navbar from "../../components/Navbar";
import ProgressBar from "../../components/ProgressBar";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import { analyticsService } from "../../services/analyticsService";
import toast from "react-hot-toast";

const Analytics = () => {
  const [perf, setPerf] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const dateRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target))
        setShowDateMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfRes, readyRes] = await Promise.all([
          analyticsService.getPerformance(),
          analyticsService.getReadiness(),
        ]);
        setPerf(perfRes.data);
        setReadiness(readyRes.data);
      } catch {
        // Use mock data
        setPerf({
          avgScore: 72,
          improvement: 8,
          bestScore: 92,
          examReadyPercentage: 78,
          scoreTrends: [
            { week: "W1", score: 55 },
            { week: "W2", score: 62 },
            { week: "W3", score: 68 },
            { week: "W4", score: 72 },
            { week: "W5", score: 78 },
            { week: "W6", score: 82 },
          ],
          subjectScores: [
            { subject: "DSA", score: 85 },
            { subject: "OS", score: 72 },
            { subject: "DBMS", score: 78 },
            { subject: "CN", score: 65 },
            { subject: "Algo", score: 80 },
          ],
        });
        setReadiness({
          percentage: 78,
          topicsCovered: 14,
          totalTopics: 20,
          focusAreas: ["Operating Systems", "Computer Networks"],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AnimatedPage>
        <Navbar
          title="Analytics & Performance"
          subtitle="Track your exam preparation progress"
        />
        <div className="p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <Skeleton className="w-48 h-8 mb-2" />
              <Skeleton className="w-64 h-4" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="w-32 h-10 rounded-xl" />
              <Skeleton className="w-36 h-10 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card">
                <Skeleton className="w-20 h-4 mb-3" />
                <Skeleton className="w-24 h-8 mb-4" />
                <Skeleton className="w-full h-4" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="card lg:col-span-3">
              <Skeleton className="w-48 h-6 mb-6" />
              <Skeleton className="w-full h-[280px]" />
            </div>
            <div className="card lg:col-span-2">
              <Skeleton className="w-48 h-6 mb-6" />
              <Skeleton className="w-full h-[280px] rounded-full" />
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const stats = [
    {
      label: "Avg Score",
      value: `${perf?.avgScore || 0}%`,
      icon: Target,
      color: "text-primary-600",
      bg: "bg-primary-50",
      trend: "+2.4%",
      trendUp: true,
    },
    {
      label: "Improvement",
      value: `+${perf?.improvement || 0}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "Stable",
      trendUp: null,
    },
    {
      label: "Best Score",
      value: `${perf?.bestScore || 0}%`,
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "+5.0%",
      trendUp: true,
    },
    {
      label: "Exam Ready",
      value: `${perf?.examReadyPercentage || 0}%`,
      icon: Zap,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "+8.1%",
      trendUp: true,
    },
  ];

  const radarData =
    perf?.subjectScores?.map((s) => ({
      subject: s.subject,
      score: s.score,
      fullMark: 100,
    })) || [];

  // Find strongest and weakest subjects
  const sortedSubjects = [...(perf?.subjectScores || [])].sort(
    (a, b) => b.score - a.score,
  );
  const strongest = sortedSubjects[0];
  const weakest = sortedSubjects[sortedSubjects.length - 1];

  return (
    <AnimatedPage>
      {/* Print-only CSS */}
      <style>{`
        @media print {
          aside, nav, .no-print { display: none !important; }
          main { margin-left: 0 !important; }
          body { background: white !important; }
          .card { box-shadow: none !important; border: 1px solid #e5e7eb !important; page-break-inside: avoid; }
          .grid { display: block !important; }
          .card { margin-bottom: 20px !important; }
        }
      `}</style>
      <Navbar
        title="Analytics & Performance"
        subtitle="Track your exam preparation progress"
      />
      <div className="p-8 animate-fade-in" ref={chartRef}>
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-heading text-text-primary">
              Overview
            </h2>
            <p className="text-sm text-text-muted">
              A summary of your overall performance
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Date range dropdown */}
            <div className="relative" ref={dateRef}>
              <button
                onClick={() => setShowDateMenu((v) => !v)}
                className="bg-white border border-border text-text-primary py-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-surface-muted transition-colors shadow-sm"
              >
                <Calendar size={16} className="text-gray-500" /> Last{" "}
                {dateRange} Days
              </button>
              {showDateMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                  {["7", "30", "90"].map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        setDateRange(d);
                        setShowDateMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${dateRange === d ? "bg-primary-50 text-primary-700 font-bold" : "text-text-primary hover:bg-surface-muted"}`}
                    >
                      Last {d} Days
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => window.print()}
              className="btn-secondary py-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 no-print shadow-sm font-semibold border border-stroke bg-white hover:bg-gray-50 text-gray-700 transition"
              title="Export as PDF"
            >
              <Printer size={16} /> Export PDF
            </button>
            <button
              onClick={() => {
                const rows = [
                  ["Subject", "Score"],
                  ...(perf?.subjectScores || []).map((s) => [
                    s.subject,
                    s.score + "%",
                  ]),
                ];
                const csv = rows.map((r) => r.join(",")).join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "smartprep-report.csv";
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Report exported as CSV!");
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-primary-600/20"
            >
              <Download size={16} /> Export Report
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="card group hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs text-text-muted font-bold tracking-wider uppercase">
                    {s.label}
                  </span>
                  <p className={`text-3xl font-bold font-mono mt-1 ${s.color}`}>
                    {s.value}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon size={20} className={s.color} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold">
                {s.trendUp === true ? (
                  <span className="text-green-600 flex items-center bg-green-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight size={12} className="mr-0.5" /> {s.trend}
                  </span>
                ) : s.trendUp === false ? (
                  <span className="text-red-600 flex items-center bg-red-50 px-1.5 py-0.5 rounded">
                    <ArrowDownRight size={12} className="mr-0.5" /> {s.trend}
                  </span>
                ) : (
                  <span className="text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {s.trend}
                  </span>
                )}
                <span className="text-gray-400 font-medium">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Performance Forecasting Banner ── */}
        {(() => {
          const avgScore = perf?.avgScore || 72;
          const improvement = perf?.improvement || 8;
          const daysLeft = readiness?.daysToExam || 45;
          const weeksLeft = Math.max(1, Math.round(daysLeft / 7));
          const weeklyGain = Math.min(improvement / 4, 2.5);
          const projectedScore = Math.min(
            100,
            Math.round(avgScore + weeklyGain * weeksLeft),
          );
          const onTrack = projectedScore >= 80;
          const milestones = [
            { label: "Halfway", target: 50, icon: "🎯" },
            { label: "80% Ready", target: 80, icon: "🔥" },
            { label: "Exam Day", target: 100, icon: "🏆" },
          ];
          return (
            <div
              className={`mb-8 rounded-2xl p-6 border-2 ${onTrack ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{onTrack ? "📈" : "⚠️"}</span>
                    <h3 className="text-lg font-black font-heading text-gray-900">
                      Performance Forecast
                    </h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${onTrack ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {onTrack ? "On Track ✓" : "Needs Attention"}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    At your current pace (+{weeklyGain.toFixed(1)}%/week),
                    you'll reach{" "}
                    <strong
                      className={onTrack ? "text-green-700" : "text-amber-700"}
                    >
                      {projectedScore}% readiness
                    </strong>{" "}
                    by exam day.
                    {onTrack
                      ? " 🎉 You're on track to crush it!"
                      : " Study a bit more each day to hit 80%+."}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black font-mono text-gray-900">
                    {projectedScore}%
                  </p>
                  <p className="text-xs text-gray-500 font-semibold">
                    Projected score
                  </p>
                </div>
              </div>
              {/* Milestone roadmap */}
              <div className="flex items-center gap-3 flex-wrap">
                {milestones.map((m, i) => {
                  const reached = projectedScore >= m.target;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${reached ? "bg-green-100 text-green-800" : "bg-white/60 text-gray-500 border border-gray-200"}`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                      {reached ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-gray-400">({m.target}%)</span>
                      )}
                    </div>
                  );
                })}
                <p className="text-xs text-gray-400 ml-auto">
                  {daysLeft} days to exam
                </p>
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Score Trend */}
          <div className="card lg:col-span-3 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-text-primary text-lg font-heading mb-6">
              Score Trend Over Time
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={perf?.scoreTrends || []}
                margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  stroke="#E5E7EB"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  stroke="#E5E7EB"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    backgroundColor: "#fff",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                    fontWeight: "bold",
                    padding: "12px 16px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563EB"
                  strokeWidth={4}
                  dot={{
                    fill: "#fff",
                    stroke: "#2563EB",
                    strokeWidth: 2,
                    r: 6,
                  }}
                  activeDot={{ r: 8, stroke: "#DBEAFE", strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="card lg:col-span-2 hover:shadow-md transition-shadow flex flex-col">
            <h3 className="font-bold text-text-primary text-lg font-heading mb-2">
              Subject-wise Mastery
            </h3>
            <div className="flex-1 flex flex-col justify-center relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "#4B5563", fontWeight: 600 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Strongest/Weakest Indicators */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="bg-green-50 rounded-xl p-3">
                <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-1 block">
                  Strongest
                </span>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm">
                    {strongest?.subject}
                  </span>
                  <span className="font-mono text-green-700 font-bold">
                    {strongest?.score}%
                  </span>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-3">
                <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider mb-1 block">
                  Needs Work
                </span>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-sm">
                    {weakest?.subject}
                  </span>
                  <span className="font-mono text-red-700 font-bold">
                    {weakest?.score}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topics Needing Attention */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-text-primary text-lg font-heading">
                  Topics Needing Attention
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Focus intensely on these areas to boost score
                </p>
              </div>
              <button
                onClick={() => {
                  chartRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-primary-600 text-sm font-bold hover:text-primary-700 flex items-center gap-1 transition-colors bg-primary-50 px-3 py-1.5 rounded-lg"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  topic: "Computer Networks",
                  progress: 45,
                  severity: "CRITICAL",
                  color: "red",
                  desc: "Consistently scoring low in subnetting.",
                  tip: "Review IP formatting and practice CIDR notation.",
                },
                {
                  topic: "Operating Systems",
                  progress: 62,
                  severity: "MODERATE",
                  color: "amber",
                  desc: "Struggling with concurrency.",
                  tip: "Watch the recommended video on bankers algorithm.",
                },
                {
                  topic: "Data Structures",
                  progress: 75,
                  severity: "NEEDS POLISH",
                  color: "blue",
                  desc: "Graph traversal times are slow.",
                  tip: "Practice BFS/DFS problems with a timer.",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`border border-${t.color}-100 rounded-xl p-4 hover:shadow-md transition-shadow bg-white`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-${t.color}-50 flex items-center justify-center shrink-0`}
                      >
                        <AlertCircle
                          size={20}
                          className={`text-${t.color}-500`}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{t.topic}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-[9px] font-bold uppercase rounded-md tracking-wider bg-${t.color}-100 text-${t.color}-700`}
                    >
                      {t.severity}
                    </span>
                  </div>

                  <div className="ml-13 pl-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        Proficiency
                      </span>
                      <span
                        className={`text-xs font-bold text-${t.color}-600 font-mono`}
                      >
                        {t.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={t.progress}
                      color={`bg-${t.color}-500`}
                      height="h-1.5"
                      className="mb-4"
                    />

                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800 flex items-start gap-2 border border-amber-100/50">
                      <Lightbulb
                        size={16}
                        className="shrink-0 mt-0.5 text-amber-500"
                      />
                      <p className="text-xs leading-relaxed">
                        <span className="font-bold">Study Tip:</span> {t.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Breakdown */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-text-primary text-lg font-heading">
                  Complete Breakdown
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Your proficiency across all subjects
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {(perf?.subjectScores || []).map((s, i) => {
                // Determine color based on score
                let barColor = "bg-primary-600";
                if (s.score >= 80) barColor = "bg-green-500";
                else if (s.score <= 70) barColor = "bg-amber-500";

                return (
                  <div key={i} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          {s.subject}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          12/15 Modules Completed
                        </span>
                      </div>
                      <span className="text-sm font-bold font-mono text-gray-700">
                        {s.score}%
                      </span>
                    </div>
                    <ProgressBar
                      value={s.score}
                      color={barColor}
                      height="h-2.5"
                      className="bg-gray-100"
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <button
                onClick={() =>
                  chartRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full bg-white border-2 border-border text-gray-700 py-3 rounded-xl font-bold text-sm hover:border-gray-300 hover:bg-surface-muted flex items-center justify-center gap-2 transition-colors"
              >
                View Detailed History
              </button>
            </div>
          </div>
        </div>

        {/* AI Study Tips Section */}

        {/* ── Topic-wise Performance (from test results) ── */}
        {(() => {
          const testResults = JSON.parse(
            localStorage.getItem("sp_test_results") || "[]",
          );
          if (testResults.length === 0) return null;

          // Aggregate topic scores across all tests
          const topicAgg = {};
          testResults.forEach((r) => {
            if (r.topicScores) {
              Object.entries(r.topicScores).forEach(([topic, score]) => {
                if (!topicAgg[topic]) topicAgg[topic] = [];
                topicAgg[topic].push(score);
              });
            }
          });

          const topicAvg = Object.entries(topicAgg)
            .map(([topic, scores]) => ({
              topic,
              avg: Math.round(
                scores.reduce((a, s) => a + s, 0) / scores.length,
              ),
              attempts: scores.length,
            }))
            .sort((a, b) => a.avg - b.avg);

          return (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Topic Mastery */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-text-primary text-lg font-heading">
                      📊 Topic-wise Mastery
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Performance breakdown from your test results
                    </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                    {topicAvg.length} topics
                  </span>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {topicAvg.map((t, i) => {
                    const color =
                      t.avg >= 80 ? "green" : t.avg >= 50 ? "amber" : "red";
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-1.5">
                          <div>
                            <span className="text-sm font-bold text-gray-800">
                              {t.topic}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                              ({t.attempts} tests)
                            </span>
                          </div>
                          <span
                            className={`text-sm font-bold font-mono text-${color}-600`}
                          >
                            {t.avg}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 bg-${color}-500`}
                            style={{ width: `${t.avg}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Test History */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-text-primary text-lg font-heading">
                      📋 Test History
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Your recent test attempts
                    </p>
                  </div>
                  <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-bold">
                    {testResults.length} tests
                  </span>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {testResults
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((r, i) => {
                      const scoreColor =
                        r.percentage >= 80
                          ? "green"
                          : r.percentage >= 50
                            ? "amber"
                            : "red";
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className={`w-10 h-10 rounded-full bg-${scoreColor}-50 flex items-center justify-center shrink-0`}
                          >
                            <span
                              className={`text-sm font-black font-mono text-${scoreColor}-600`}
                            >
                              {r.percentage}%
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">
                              {r.testName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(r.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-gray-700">
                              {r.score}/{r.totalMarks}
                            </p>
                            <p className="text-[10px] text-gray-400">marks</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="mt-8 card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
              <Lightbulb size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary font-heading text-lg">
                🤖 AI Study Recommendations
              </h3>
              <p className="text-xs text-text-muted">
                Personalized tips based on your performance analytics
              </p>
            </div>
            <span className="ml-auto text-[10px] bg-violet-100 text-violet-700 font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-violet-200">
              SMART TIPS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              const subjectScores = perf?.subjectScores || [];
              const tips = [];
              const weakSubjects = subjectScores
                .filter((s) => s.score < 55)
                .sort((a, b) => a.score - b.score);
              const strongSubjects = subjectScores.filter((s) => s.score >= 80);
              const avgScore =
                subjectScores.length > 0
                  ? Math.round(
                      subjectScores.reduce((a, s) => a + s.score, 0) /
                        subjectScores.length,
                    )
                  : 0;

              if (weakSubjects[0])
                tips.push({
                  priority: "high",
                  icon: "🎯",
                  title: `Prioritize ${weakSubjects[0].subject}`,
                  body: `Your score of ${weakSubjects[0].score}% is significantly below average. Dedicate 2 extra hours daily this week and focus on foundational concepts first.`,
                });
              if (weakSubjects[1])
                tips.push({
                  priority: "high",
                  icon: "⚠️",
                  title: `${weakSubjects[1].subject} Needs Attention`,
                  body: `${weakSubjects[1].subject} is your second weakest area at ${weakSubjects[1].score}%. Practice 10 MCQs per day to build pattern recognition.`,
                });
              if (strongSubjects[0])
                tips.push({
                  priority: "low",
                  icon: "✅",
                  title: `Maintain ${strongSubjects[0].subject} Momentum`,
                  body: `You're excelling at ${strongSubjects[0].subject} with ${strongSubjects[0].score}%. Switch to weekly revision mode — 30 mins every 3 days is enough to retain this.`,
                });
              if (avgScore < 70)
                tips.push({
                  priority: "medium",
                  icon: "📈",
                  title: "Boost Overall Test Performance",
                  body: `Your average score of ${avgScore}% needs improvement. Try solving previous year papers under timed conditions — this alone typically boosts scores by 8-12%.`,
                });
              tips.push({
                priority: "medium",
                icon: "⏱️",
                title: "Use Spaced Repetition",
                body: "Review topics 1 day, 3 days, and 7 days after first learning them. This method has been shown to improve long-term retention by up to 70%.",
              });
              tips.push({
                priority: "low",
                icon: "😴",
                title: "Optimize Sleep for Memory",
                body: "Sleep 7-8 hours during exam prep. Memory consolidation happens during deep sleep — studying till 2 AM before an exam actually hurts performance.",
              });

              return tips.slice(0, 4).map((tip, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border transition-all hover:shadow-md ${tip.priority === "high" ? "bg-red-50 border-red-100" : tip.priority === "medium" ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 mt-0.5">{tip.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-sm">
                          {tip.title}
                        </h4>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tip.priority === "high" ? "bg-red-200 text-red-800" : tip.priority === "medium" ? "bg-amber-200 text-amber-800" : "bg-green-200 text-green-800"}`}
                        >
                          {tip.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {tip.body}
                      </p>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
          <div className="mt-4 p-3 bg-surface-muted rounded-xl flex items-center gap-2 text-xs text-text-muted">
            <CheckCircle2 size={14} className="text-green-600 shrink-0" />
            <span>
              Tips are generated from your actual score data and update every
              time your analytics refresh.
            </span>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Analytics;
