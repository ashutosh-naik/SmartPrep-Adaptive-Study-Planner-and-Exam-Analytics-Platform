import { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  BookOpen,
  SkipForward,
} from "lucide-react";
import toast from "react-hot-toast";

const MODES = {
  work: {
    label: "Focus",
    duration: 25 * 60,
    color: "text-primary-600",
    bg: "from-primary-500 to-violet-500",
    ring: "stroke-primary-500",
  },
  short: {
    label: "Short Break",
    duration: 5 * 60,
    color: "text-green-600",
    bg: "from-green-400 to-emerald-500",
    ring: "stroke-green-500",
  },
  long: {
    label: "Long Break",
    duration: 15 * 60,
    color: "text-blue-600",
    bg: "from-blue-400 to-cyan-500",
    ring: "stroke-blue-500",
  },
};

const PomodoroTimer = ({ taskName = "Study Session", onClose }) => {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);
  const total = MODES[mode].duration;
  const progress = (timeLeft / total) * 100;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  // SVG circle math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === "work") {
              const newSessions = sessions + 1;
              setSessions(newSessions);
              // Log session to localStorage for study tracking
              try {
                const log = JSON.parse(
                  localStorage.getItem("sp_pomodoro_log") || "[]",
                );
                log.push({
                  timestamp: new Date().toISOString(),
                  minutes: 25,
                  taskName,
                });
                localStorage.setItem("sp_pomodoro_log", JSON.stringify(log));
              } catch {
                /* ignore */
              }
              const nextMode = newSessions % 4 === 0 ? "long" : "short";
              toast.success(
                `🎉 Session complete! Time for a ${nextMode === "long" ? "15-min" : "5-min"} break.`,
                { duration: 5000 },
              );
              setTimeout(() => {
                setMode(nextMode);
                setTimeLeft(MODES[nextMode].duration);
              }, 1000);
            } else {
              toast.success("🔔 Break over! Time to focus again.", {
                duration: 4000,
              });
              setTimeout(() => {
                setMode("work");
                setTimeLeft(MODES.work.duration);
              }, 1000);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode, sessions]);

  const switchMode = (m) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setMode(m);
    setTimeLeft(MODES[m].duration);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  const cfg = MODES[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div
          className={`bg-gradient-to-r ${cfg.bg} px-6 pt-6 pb-8 text-white relative`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">
            Pomodoro Timer
          </p>
          <h2 className="text-lg font-bold font-heading truncate">
            {taskName}
          </h2>
        </div>

        <div className="p-6">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            {Object.entries(MODES).map(([key, m]) => (
              <button
                key={key}
                onClick={() => switchMode(key)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${mode === key ? `bg-gradient-to-r ${m.bg} text-white shadow-md` : "bg-surface-muted text-text-muted hover:bg-gray-200"}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Circular progress */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <svg width="220" height="220" className="-rotate-90">
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="var(--surface-muted)"
                  strokeWidth="12"
                />
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke={
                    mode === "work"
                      ? "#7C3AED"
                      : mode === "short"
                        ? "#10B981"
                        : "#3B82F6"
                  }
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-black font-mono text-text-primary leading-none">
                  {mins}:{secs}
                </div>
                <div className={`text-sm font-bold mt-2 ${cfg.color}`}>
                  {cfg.label}
                </div>
                <div className="text-xs text-text-muted mt-1">
                  Session {sessions + 1}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={reset}
              className="p-3 rounded-xl bg-surface-muted hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={20} className="text-text-muted" />
            </button>
            <button
              onClick={() => setRunning(!running)}
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${cfg.bg} text-white shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center`}
            >
              {running ? (
                <Pause size={28} />
              ) : (
                <Play size={28} className="ml-1" />
              )}
            </button>
            <button
              onClick={() => switchMode(mode === "work" ? "short" : "work")}
              className="p-3 rounded-xl bg-surface-muted hover:bg-gray-200 transition-colors"
            >
              <SkipForward size={20} className="text-text-muted" />
            </button>
          </div>

          {/* Sessions counter */}
          <div className="flex items-center justify-center gap-2 py-3 bg-surface-muted rounded-xl">
            <BookOpen size={15} className="text-text-muted" />
            <span className="text-sm font-semibold text-text-primary">
              {sessions}
            </span>
            <span className="text-sm text-text-muted font-medium">
              sessions completed today
            </span>
            <Coffee size={15} className="text-text-muted ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
