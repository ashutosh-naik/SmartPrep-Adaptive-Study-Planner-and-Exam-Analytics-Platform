import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Minus,
} from "lucide-react";
import Loader from "../../components/Loader";
import ProgressBar from "../../components/ProgressBar";
import { testService } from "../../services/testService";

const TestResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQs, setExpandedQs] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Demo mode — result passed via location state
    if (location.state?.demo && location.state?.result) {
      setResult(location.state.result);
      saveTestResult(location.state.result);
      setLoading(false);
      return;
    }
    const fetchResult = async () => {
      try {
        const res = await testService.getTestResult(id);
        setResult(res.data);
        saveTestResult(res.data);
      } catch {
        navigate("/tests");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  // Persist result to localStorage for analytics
  const saveTestResult = (r) => {
    if (!r) return;
    try {
      const all = JSON.parse(localStorage.getItem("sp_test_results") || "[]");
      // Build topic-wise scores from questions
      const topicScores = {};
      (r.questions || []).forEach((q) => {
        const topic = q.topic || q.subject || r.testName || "General";
        if (!topicScores[topic]) topicScores[topic] = { correct: 0, total: 0 };
        topicScores[topic].total++;
        if (q.isCorrect || q.selectedOption === q.correctAnswer) {
          topicScores[topic].correct++;
        }
      });
      const topicPct = {};
      Object.entries(topicScores).forEach(([t, d]) => {
        topicPct[t] = Math.round((d.correct / d.total) * 100);
      });
      all.push({
        testId: id || Date.now(),
        testName: r.testName || "Practice Test",
        date: new Date().toISOString(),
        percentage: r.percentage || 0,
        score: r.score || 0,
        totalMarks: r.totalMarks || 0,
        topicScores: topicPct,
      });
      localStorage.setItem("sp_test_results", JSON.stringify(all));
    } catch {
      /* ignore */
    }
  };

  if (loading) return <Loader text="Calculating your score..." />;
  if (!result) return null;

  const percentage = result.percentage || 0;
  const passed = percentage >= 50;
  const wrong = (result.totalMarks || 0) - (result.score || 0);
  const unanswered =
    (result.questions?.length || 0) - (result.score || 0) - wrong;

  // Grade
  const grade =
    percentage >= 90
      ? { label: "A+", color: "text-green-600", bg: "bg-green-50" }
      : percentage >= 80
        ? { label: "A", color: "text-green-600", bg: "bg-green-50" }
        : percentage >= 70
          ? { label: "B", color: "text-blue-600", bg: "bg-blue-50" }
          : percentage >= 60
            ? { label: "C", color: "text-amber-600", bg: "bg-amber-50" }
            : percentage >= 50
              ? { label: "D", color: "text-orange-600", bg: "bg-orange-50" }
              : { label: "F", color: "text-red-600", bg: "bg-red-50" };

  // Motivational message
  const message =
    percentage >= 90
      ? "🏆 Outstanding! You nailed it!"
      : percentage >= 75
        ? "🎉 Great job! Keep up the momentum!"
        : percentage >= 60
          ? "👍 Decent attempt — review weak areas!"
          : percentage >= 50
            ? "✅ You passed! But there's room for improvement."
            : "📚 Don't give up — review the concepts and retake!";

  const toggleQ = (i) => {
    const next = new Set(expandedQs);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setExpandedQs(next);
  };

  const questions = result.questions || [];
  const displayQs = showAll ? questions : questions.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 animate-fade-in">
        {/* ── Score Card ── */}
        <div
          className={`card mb-6 border-2 overflow-hidden relative ${passed ? "border-green-200" : "border-red-200"}`}
        >
          {/* Background decoration */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${passed ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-red-400 to-rose-500"}`}
          />
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-5 bg-current" />

          <div className="text-center pt-4">
            {/* Grade badge */}
            <div
              className={`inline-flex w-20 h-20 rounded-full items-center justify-center ${grade.bg} mb-4 border-4 ${passed ? "border-green-100" : "border-red-100"}`}
            >
              <span className={`text-3xl font-black ${grade.color}`}>
                {grade.label}
              </span>
            </div>

            <p className="text-lg font-bold text-gray-700 mb-1">{message}</p>
            <h2 className="text-xl font-bold font-heading text-text-primary mb-1">
              {result.testTitle}
            </h2>
            <p className="text-sm text-text-muted mb-6">{result.subjectName}</p>

            {/* Big percentage */}
            <div
              className={`text-7xl font-black font-mono mb-2 ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {percentage}%
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <p className="text-xl font-black text-gray-900 font-mono">
                    {result.score}
                  </p>
                </div>
                <p className="text-xs text-text-muted font-semibold">CORRECT</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle size={16} className="text-red-500" />
                  <p className="text-xl font-black text-red-600 font-mono">
                    {wrong}
                  </p>
                </div>
                <p className="text-xs text-text-muted font-semibold">WRONG</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Minus size={16} className="text-gray-400" />
                  <p className="text-xl font-black text-gray-500 font-mono">
                    {unanswered > 0 ? unanswered : 0}
                  </p>
                </div>
                <p className="text-xs text-text-muted font-semibold">SKIPPED</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock size={16} className="text-blue-500" />
                  <p className="text-xl font-black text-blue-600 font-mono">
                    {result.timeTakenMinutes}m
                  </p>
                </div>
                <p className="text-xs text-text-muted font-semibold">TIME</p>
              </div>
            </div>

            <div className="mt-6 px-4 pb-4">
              <ProgressBar
                value={percentage}
                color={
                  passed
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gradient-to-r from-red-400 to-rose-500"
                }
                height="h-3"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1 font-medium">
                <span>0%</span>
                <span className="text-amber-600 font-bold">Pass: 50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Performance Insights ── */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: Trophy,
              label: "Accuracy",
              value: `${percentage}%`,
              sub:
                percentage >= 75
                  ? "Excellent"
                  : percentage >= 50
                    ? "Moderate"
                    : "Needs Work",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              icon: Target,
              label: "Score",
              value: `${result.score}/${result.totalMarks}`,
              sub: "Questions correct",
              color: "text-primary-600",
              bg: "bg-primary-50",
            },
            {
              icon: TrendingUp,
              label: "Speed",
              value:
                result.totalMarks > 0
                  ? `${Math.round((result.timeTakenMinutes * 60) / result.totalMarks)}s`
                  : "-",
              sub: "Avg per question",
              color: "text-green-600",
              bg: "bg-green-50",
            },
          ].map((card, i) => (
            <div key={i} className="card text-center">
              <div className={`inline-flex p-2 rounded-lg ${card.bg} mb-2`}>
                <card.icon size={18} className={card.color} />
              </div>
              <p className={`text-2xl font-black font-mono ${card.color}`}>
                {card.value}
              </p>
              <p className="text-xs text-text-muted font-semibold mt-0.5">
                {card.label}
              </p>
              <p className="text-[10px] text-text-muted">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Answer Review ── */}
        {questions.length > 0 && (
          <div className="card mb-6">
            <h3 className="font-bold text-text-primary font-heading mb-5">
              Answer Review
            </h3>
            <div className="space-y-3">
              {displayQs.map((q, i) => {
                const userAns = q.userAnswer;
                const correct = q.correctOption;
                const isCorrect = userAns === correct;
                const isSkipped = !userAns;
                const expanded = expandedQs.has(i);

                return (
                  <div
                    key={i}
                    className={`rounded-xl border-2 overflow-hidden transition-all ${isCorrect ? "border-green-100" : isSkipped ? "border-gray-100" : "border-red-100"}`}
                  >
                    <button
                      onClick={() => toggleQ(i)}
                      className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${isCorrect ? "bg-green-50/50 hover:bg-green-50" : isSkipped ? "bg-gray-50 hover:bg-gray-100" : "bg-red-50/50 hover:bg-red-50"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCorrect ? "bg-green-500 text-white" : isSkipped ? "bg-gray-300 text-white" : "bg-red-500 text-white"}`}
                      >
                        {isCorrect ? "✓" : isSkipped ? "—" : "✗"}
                      </div>
                      <p className="text-sm font-semibold text-text-primary flex-1 line-clamp-1">
                        {q.questionText}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!isSkipped && (
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                          >
                            Your ans: {userAns}
                          </span>
                        )}
                        {expanded ? (
                          <ChevronUp size={15} className="text-text-muted" />
                        ) : (
                          <ChevronDown size={15} className="text-text-muted" />
                        )}
                      </div>
                    </button>
                    {expanded && (
                      <div className="p-4 border-t border-gray-100 bg-white">
                        <p className="text-sm text-text-primary mb-3 font-medium">
                          {q.questionText}
                        </p>
                        <div className="space-y-2">
                          {["A", "B", "C", "D"].map((opt) => {
                            const text = q[`option${opt}`];
                            if (!text) return null;
                            const isCorrectOpt = opt === correct;
                            const isUserPick = opt === userAns;
                            return (
                              <div
                                key={opt}
                                className={`flex items-center gap-3 p-3 rounded-lg text-sm ${isCorrectOpt ? "bg-green-100 text-green-800 font-semibold" : isUserPick && !isCorrectOpt ? "bg-red-50 text-red-700" : "bg-gray-50 text-text-muted"}`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCorrectOpt ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}
                                >
                                  {opt}
                                </span>
                                <span className="flex-1">{text}</span>
                                {isCorrectOpt && (
                                  <CheckCircle2
                                    size={15}
                                    className="text-green-600 shrink-0"
                                  />
                                )}
                                {isUserPick && !isCorrectOpt && (
                                  <XCircle
                                    size={15}
                                    className="text-red-500 shrink-0"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {q.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700 border border-blue-100">
                            <span className="font-bold">Explanation:</span>{" "}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {questions.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-4 py-3 text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center justify-center gap-2 border-t border-border transition-colors"
              >
                {showAll ? (
                  <>
                    <ChevronUp size={16} /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} /> Show All {questions.length}{" "}
                    Questions
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/tests")}
            className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Tests
          </button>
          <button
            onClick={() => navigate(`/tests/${id}`)}
            className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Retake Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
