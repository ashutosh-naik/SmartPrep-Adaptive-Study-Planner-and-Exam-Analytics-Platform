import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Flag,
  X,
} from "lucide-react";
import Loader from "../../components/Loader";
import { testService } from "../../services/testService";
import toast from "react-hot-toast";

// ── Mock questions for offline/demo mode ──────────────────────────────────────
const MOCK_TESTS = {
  default: {
    id: "demo",
    title: "Data Structures & Algorithms — Chapter 1",
    subjectName: "Computer Science",
    durationMinutes: 30,
    questions: [
      {
        id: 1,
        questionText:
          "What is the time complexity of binary search on a sorted array of n elements?",
        optionA: "O(n)",
        optionB: "O(log n)",
        optionC: "O(n log n)",
        optionD: "O(1)",
        correctOption: "B",
      },
      {
        id: 2,
        questionText:
          "Which data structure uses LIFO (Last In, First Out) ordering?",
        optionA: "Queue",
        optionB: "Array",
        optionC: "Stack",
        optionD: "Linked List",
        correctOption: "C",
      },
      {
        id: 3,
        questionText: "In a max-heap, the parent node value is always:",
        optionA: "Less than its children",
        optionB: "Greater than or equal to its children",
        optionC: "Equal to its children",
        optionD: "Cannot be determined",
        correctOption: "B",
      },
      {
        id: 4,
        questionText: "What is the worst-case time complexity of QuickSort?",
        optionA: "O(n log n)",
        optionB: "O(n)",
        optionC: "O(n²)",
        optionD: "O(log n)",
        correctOption: "C",
      },
      {
        id: 5,
        questionText:
          "Which traversal of a Binary Search Tree gives nodes in sorted order?",
        optionA: "Pre-order",
        optionB: "Post-order",
        optionC: "Level-order",
        optionD: "In-order",
        correctOption: "D",
      },
      {
        id: 6,
        questionText:
          "The number of edges in a complete graph with n vertices is:",
        optionA: "n",
        optionB: "n²",
        optionC: "n(n-1)/2",
        optionD: "2n",
        correctOption: "C",
      },
      {
        id: 7,
        questionText:
          "Which algorithm is used to find the shortest path in a weighted graph?",
        optionA: "BFS",
        optionB: "DFS",
        optionC: "Dijkstra's Algorithm",
        optionD: "Topological Sort",
        correctOption: "C",
      },
      {
        id: 8,
        questionText: "A hash table with a load factor of 1 means:",
        optionA: "The table is empty",
        optionB: "The table is half full",
        optionC: "The number of entries equals the number of buckets",
        optionD: "The table is full",
        correctOption: "C",
      },
      {
        id: 9,
        questionText: "Dynamic programming is best used when a problem has:",
        optionA: "No subproblems",
        optionB: "Overlapping subproblems and optimal substructure",
        optionC: "Only greedy solutions",
        optionD: "No recursive structure",
        correctOption: "B",
      },
      {
        id: 10,
        questionText: "What is the space complexity of Merge Sort?",
        optionA: "O(1)",
        optionB: "O(log n)",
        optionC: "O(n)",
        optionD: "O(n log n)",
        correctOption: "C",
      },
    ],
  },
};

const TestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await testService.getTest(id);
        if (res.data && res.data.questions?.length > 0) {
          setTest(res.data);
          setTimeLeft((res.data.durationMinutes || 30) * 60);
        } else {
          throw new Error("No questions");
        }
      } catch {
        // Fall back to mock data for demo
        const mock = MOCK_TESTS.default;
        setTest(mock);
        setTimeLeft(mock.durationMinutes * 60);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
    return () => clearInterval(timerRef.current);
  }, [id]);

  // Timer tick
  useEffect(() => {
    if (!test || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [test]);

  const handleSubmit = useCallback(async () => {
    clearInterval(timerRef.current);
    if (isDemo) {
      // Calculate score locally for demo
      const questions = test?.questions || [];
      const score = questions.filter(
        (q) => answers[q.id] === q.correctOption,
      ).length;
      const percentage = Math.round((score / questions.length) * 100);
      const totalTime = Math.floor(
        ((test?.durationMinutes || 30) * 60 - timeLeft) / 60,
      );
      navigate(`/tests/${id}/result`, {
        state: {
          demo: true,
          result: {
            testTitle: test.title,
            subjectName: test.subjectName,
            score,
            totalMarks: questions.length,
            percentage,
            timeTakenMinutes: Math.max(1, totalTime),
            questions: questions.map((q) => ({
              ...q,
              userAnswer: answers[q.id],
            })),
          },
        },
      });
      return;
    }
    try {
      const totalTime =
        (test?.durationMinutes || 30) - Math.floor(timeLeft / 60);
      await testService.submitTest(id, {
        answers,
        timeTakenMinutes: totalTime,
      });
      toast.success("Test submitted!");
      navigate(`/tests/${id}/result`);
    } catch {
      toast.error("Submit failed — please try again");
    }
  }, [answers, id, isDemo, navigate, test, timeLeft]);

  if (loading) return <Loader text="Loading test..." />;
  if (!test) return null;

  const questions = test.questions || [];
  const q = questions[currentQ];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / questions.length) * 100);
  const isLowTime = timeLeft < 300;

  const toggleFlag = (qId) => {
    const next = new Set(flagged);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);
    setFlagged(next);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Bar ── */}
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-text-primary font-heading leading-tight text-sm">
              {test.title}
            </h1>
            <p className="text-xs text-text-muted">
              {test.subjectName} {isDemo && "· Demo Mode"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-text-muted">
              {answered}/{questions.length}
            </span>
          </div>
          {/* Timer */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm transition-all ${isLowTime ? "bg-red-100 text-red-600 animate-pulse" : "bg-primary-50 text-primary-700"}`}
          >
            <Clock size={16} />
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary text-sm py-2 px-4"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 flex gap-6">
        {/* ── Question Area ── */}
        <div className="flex-1 min-w-0">
          {q && (
            <div className="card mb-5 animate-fade-in">
              {/* Question header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                    Question {currentQ + 1} of {questions.length}
                  </span>
                </div>
                <button
                  onClick={() => toggleFlag(q.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${flagged.has(q.id) ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600"}`}
                >
                  <Flag size={13} /> {flagged.has(q.id) ? "Flagged" : "Flag"}
                </button>
              </div>
              <p className="text-lg font-semibold text-text-primary mb-7 leading-relaxed">
                {q.questionText}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {["A", "B", "C", "D"].map((opt) => {
                  const text = q[`option${opt}`];
                  if (!text) return null;
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                        selected
                          ? "border-primary-600 bg-primary-50 shadow-sm shadow-primary-600/10"
                          : "border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 bg-white"
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-all ${
                          selected
                            ? "bg-primary-600 text-white shadow-md shadow-primary-600/30"
                            : "bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600"
                        }`}
                      >
                        {opt}
                      </span>
                      <span
                        className={`font-medium ${selected ? "text-primary-800" : "text-text-primary"}`}
                      >
                        {text}
                      </span>
                      {selected && (
                        <CheckCircle2
                          size={18}
                          className="text-primary-600 ml-auto shrink-0"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
                <button
                  onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                  disabled={currentQ === 0}
                  className="btn-secondary text-sm py-2.5 px-5 flex items-center gap-2 disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentQ(Math.min(questions.length - 1, currentQ + 1))
                  }
                  disabled={currentQ >= questions.length - 1}
                  className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Question Navigator Sidebar ── */}
        <div className="w-56 shrink-0 hidden lg:block">
          <div className="card sticky top-24">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">
              Question Map
            </h3>
            <div className="grid grid-cols-5 gap-1.5 mb-5">
              {questions.map((ques, i) => {
                const isAnswered = !!answers[ques.id];
                const isFlagged = flagged.has(ques.id);
                const isCurrent = i === currentQ;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-primary-600 text-white shadow-md"
                        : isFlagged
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : isAnswered
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-text-muted hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary-600" />
                <span className="text-text-muted">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                <span className="text-text-muted">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200" />
                <span className="text-text-muted">Flagged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100" />
                <span className="text-text-muted">Unanswered</span>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-xs text-text-muted mb-1">
                <span className="font-bold text-green-600">{answered}</span>{" "}
                answered
              </p>
              <p className="text-xs text-text-muted mb-1">
                <span className="font-bold text-amber-600">{flagged.size}</span>{" "}
                flagged
              </p>
              <p className="text-xs text-text-muted">
                <span className="font-bold text-gray-500">
                  {questions.length - answered}
                </span>{" "}
                remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit Confirm Dialog ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-heading text-text-primary">
                Submit Test?
              </h2>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-2 hover:bg-surface-muted rounded-xl transition-colors"
              >
                <X size={18} className="text-text-muted" />
              </button>
            </div>
            <AlertTriangle
              size={48}
              className="text-amber-500 mx-auto mb-5 block"
            />
            <div className="text-center">
              <p className="text-text-primary mb-2 font-medium">
                You've answered{" "}
                <span className="font-black text-primary-600">{answered}</span>{" "}
                of <span className="font-black">{questions.length}</span>{" "}
                questions.
              </p>
              {answered < questions.length && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-amber-700 text-sm font-semibold">
                  ⚠️ {questions.length - answered} question
                  {questions.length - answered > 1 ? "s" : ""} left unanswered
                </div>
              )}
              {flagged.size > 0 && (
                <p className="text-sm text-text-muted mt-2">
                  You have {flagged.size} flagged question
                  {flagged.size > 1 ? "s" : ""} for review.
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 btn-secondary py-3"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 btn-primary py-3"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAttempt;
