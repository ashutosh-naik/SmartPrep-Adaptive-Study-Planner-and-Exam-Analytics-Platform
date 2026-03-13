import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../store/authSlice";
import { analyticsService } from "../../services/analyticsService";
import { plannerService } from "../../services/plannerService";
import {
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Target,
  BookOpen,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const EXAM_TYPES = [
  { value: "gate", label: "GATE", emoji: "🎓" },
  { value: "cat", label: "CAT", emoji: "📊" },
  { value: "upsc", label: "UPSC", emoji: "🏛️" },
  { value: "jee", label: "JEE", emoji: "⚗️" },
  { value: "neet", label: "NEET", emoji: "🔬" },
  { value: "competitive", label: "Other Competitive", emoji: "🏆" },
  { value: "semester", label: "Semester Exam", emoji: "📚" },
  { value: "placement", label: "Placement Prep", emoji: "💼" },
];

const STUDY_HOURS = [2, 4, 6, 8, 10, 12];

const SUBJECTS_LIST = [
  "Data Structures",
  "Algorithms",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "Theory of Computation",
  "Mathematics",
  "Aptitude & Reasoning",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
];

const STEPS = [
  {
    id: 1,
    title: "Welcome to SmartPrep!",
    subtitle: "Let's personalize your experience in 3 quick steps.",
  },
  {
    id: 2,
    title: "What are you preparing for?",
    subtitle: "Pick your exam so we can tailor your plan.",
  },
  {
    id: 3,
    title: "Set your study goals",
    subtitle: "Tell us how much time you can dedicate each day.",
  },
  {
    id: 4,
    title: "Select your subjects",
    subtitle: "Choose the subjects you want to study.",
  },
  {
    id: 5,
    title: "You're all set! \uD83C\uDF89",
    subtitle: "SmartPrep will now build your adaptive study plan.",
  },
];

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [examType, setExamType] = useState("");
  const [examDate, setExamDate] = useState("");
  const [studyHours, setStudyHours] = useState(4);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [saving, setSaving] = useState(false);

  const totalSteps = STEPS.length;
  const pct = ((step - 1) / (totalSteps - 1)) * 100;

  const toggleSubject = (s) => {
    setSelectedSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      const payload = { examType, examDate, studyHoursPerDay: studyHours };
      const res = await analyticsService
        .updateProfile(payload)
        .catch(() => null);
      if (res?.data) dispatch(updateUser(res.data));

      // Auto-generate study plan with selected subjects
      if (selectedSubjects.length > 0) {
        const planPayload = {
          studyHoursPerDay: studyHours,
          subjects: selectedSubjects.map((s) => ({
            name: s,
            difficulty: "Medium",
            topics: [],
          })),
        };
        await plannerService.generatePlan(planPayload).catch(() => null);
      }

      localStorage.setItem("sp_onboarded", "true");
      toast.success("Welcome aboard! Your study plan is ready. 🚀", {
        duration: 5000,
      });
      navigate("/dashboard");
    } catch {
      localStorage.setItem("sp_onboarded", "true");
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const canNext = () => {
    if (step === 2) return !!examType;
    if (step === 3) return !!examDate;
    if (step === 4) return selectedSubjects.length > 0;
    return true;
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/20 to-violet-50/20 flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
            <GraduationCap size={22} className="text-white" />
          </div>
          <span className="text-xl font-black font-heading text-gray-900">
            SmartPrep
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(pct)}% complete</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-violet-600 p-6 text-white">
            <h1 className="text-xl font-black font-heading mb-1">
              {STEPS[step - 1].title}
            </h1>
            <p className="text-white/80 text-sm">{STEPS[step - 1].subtitle}</p>
          </div>

          <div className="p-6">
            {/* STEP 1 — Welcome */}
            {step === 1 && (
              <div className="text-center py-4">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">
                  Hey, {user?.name?.split(" ")[0] || "there"}!
                </h2>
                <p className="text-gray-500 leading-relaxed mb-6">
                  SmartPrep will help you build a personalized adaptive study
                  plan, track your progress, and crush your exam goals.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { emoji: "📅", label: "Adaptive Plan" },
                    { emoji: "📊", label: "Real Analytics" },
                    { emoji: "🏆", label: "Mock Tests" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="bg-primary-50 rounded-xl p-3 border border-primary-100"
                    >
                      <div className="text-2xl mb-1">{f.emoji}</div>
                      <p className="text-xs font-bold text-primary-700">
                        {f.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Exam Type */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {EXAM_TYPES.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => setExamType(e.value)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${examType === e.value ? "border-primary-600 bg-primary-50 shadow-sm" : "border-gray-100 hover:border-primary-200 bg-white"}`}
                  >
                    <span className="text-2xl">{e.emoji}</span>
                    <span className="font-bold text-sm text-gray-800">
                      {e.label}
                    </span>
                    {examType === e.value && (
                      <CheckCircle2
                        size={16}
                        className="text-primary-600 ml-auto shrink-0"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* STEP 3 — Study Goals */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    <Calendar
                      size={15}
                      className="inline mr-1.5 text-primary-600"
                    />
                    When is your exam?
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-field"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-sm font-bold text-gray-700">
                      <BookOpen
                        size={15}
                        className="inline mr-1.5 text-primary-600"
                      />
                      Daily study goal
                    </label>
                    <span className="text-primary-700 font-black font-mono bg-primary-100 px-3 py-1 rounded-lg text-lg">
                      {studyHours}h
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {STUDY_HOURS.map((h) => (
                      <button
                        key={h}
                        onClick={() => setStudyHours(h)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${studyHours === h ? "bg-primary-600 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600"}`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Subjects */}
            {step === 4 && (
              <div>
                <p className="text-xs text-gray-400 mb-3 font-medium">
                  Select {selectedSubjects.length} subjects · tap to toggle
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {SUBJECTS_LIST.map((s) => {
                    const sel = selectedSubjects.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSubject(s)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm font-semibold transition-all ${sel ? "border-primary-600 bg-primary-50 text-primary-800" : "border-gray-100 text-gray-600 hover:border-gray-200 bg-white"}`}
                      >
                        {sel && (
                          <CheckCircle2
                            size={14}
                            className="text-primary-600 shrink-0"
                          />
                        )}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 — Done */}
            {step === 5 && (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-green-400/30">
                  <Sparkles size={36} className="text-white" />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">
                  Your plan is ready!
                </h2>
                <p className="text-gray-500 mb-6">
                  SmartPrep has personalized your dashboard based on your exam
                  type, timeline, and daily goals.
                </p>
                <div className="space-y-2 text-left mb-6">
                  {[
                    {
                      label: "Exam",
                      value:
                        EXAM_TYPES.find((e) => e.value === examType)?.label ||
                        examType,
                    },
                    { label: "Daily Goal", value: `${studyHours} hours/day` },
                    {
                      label: "Subjects",
                      value: `${selectedSubjects.length} selected`,
                    },
                    { label: "Exam Date", value: examDate || "Not set" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-sm text-gray-500">{row.label}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-6 pb-6 flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary flex items-center gap-2 py-3"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                {saving ? "Setting up..." : "Go to Dashboard 🚀"}
              </button>
            )}
          </div>
        </div>

        {step < totalSteps && (
          <button
            onClick={handleFinish}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4 transition-colors"
          >
            Skip setup — I'll configure later
          </button>
        )}
      </div>
      </div>
    </AnimatedPage>
  );
};

export default Onboarding;
