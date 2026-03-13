import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../../components/ThemeToggle";
import {
  Brain,
  Calendar,
  BarChart3,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  BookOpen,
  Trophy,
  Users,
  ChevronRight,
  Play,
  Sparkles,
  GraduationCap,
  Bell,
  RotateCcw,
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";

const LandingPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const ctaLink = isAuthenticated ? "/dashboard" : "/register";

  const features = [
    {
      icon: Brain,
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      title: "AI-Adaptive Planning",
      desc: "SmartPrep builds a personalized daily schedule based on your syllabus, exam date, and past performance. It auto-adjusts when you fall behind.",
    },
    {
      icon: BarChart3,
      color: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      title: "Deep Analytics",
      desc: "Track score trends, subject mastery, and exam readiness with beautiful real-time charts. Know exactly where to focus next.",
    },
    {
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      title: "Mock Test Engine",
      desc: "Take timed subject-wise mock tests, review your answers, and track improvement over time with detailed result breakdowns.",
    },
    {
      icon: RotateCcw,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
      title: "Smart Backlog Recovery",
      desc: "Missed a session? SmartPrep automatically redistributes skipped topics across your remaining schedule — no stress, no manual rescheduling.",
    },
    {
      icon: Bell,
      color: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
      title: "Exam Countdown & Alerts",
      desc: "Stay on track with smart reminders, milestone alerts, and a live countdown to your exam day. Never miss a deadline again.",
    },
    {
      icon: Trophy,
      color: "from-yellow-500 to-amber-600",
      bg: "bg-yellow-50",
      title: "Streaks & Achievements",
      desc: "Build habits with daily streaks, consistency badges, and progress milestones. Studying becomes a game you actually want to play.",
    },
  ];

  const stats = [
    { value: "50,000+", label: "Students Preparing" },
    { value: "92%", label: "Improved Their Scores" },
    { value: "4.9 ★", label: "Average Rating" },
    { value: "200+", label: "Competitive Exams" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "GATE 2025 – AIR 42",
      avatar: "PS",
      color: "bg-violet-500",
      text: "SmartPrep changed how I study completely. The adaptive planner made sure I covered every topic without burning out. Cleared GATE in my first attempt!",
    },
    {
      name: "Rahul Mehta",
      role: "CAT 2025 – 99.2 percentile",
      avatar: "RM",
      color: "bg-blue-500",
      text: "The mock test analytics showed me exactly which sections were dragging my score. Went from 85 percentile to 99.2 in 3 months. Unbelievable product.",
    },
    {
      name: "Ananya Patel",
      role: "UPSC Prelims – Cleared",
      avatar: "AP",
      color: "bg-green-500",
      text: "UPSC has such a vast syllabus — I was overwhelmed. SmartPrep broke it down week by week and tracked my backlog automatically. Completely worth it.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Set Your Exam & Syllabus",
      desc: "Tell SmartPrep your exam date and add your subjects. Takes under 2 minutes.",
    },
    {
      num: "02",
      title: "Get Your Study Plan",
      desc: "AI generates a day-by-day schedule optimized for your timeline and strengths.",
    },
    {
      num: "03",
      title: "Study & Track Daily",
      desc: "Follow your plan, take mock tests, and watch your readiness score climb.",
    },
    {
      num: "04",
      title: "Crack the Exam",
      desc: "Walk in confident, fully prepared, and score higher than you thought possible.",
    },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background text-text-primary font-body">
        {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity tracking-wide"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-black font-heading text-text-primary">
                SmartPrep
              </span>
              <span className="hidden sm:block text-[10px] text-text-muted leading-none font-medium mt-0.5">
                Adaptive Study Platform
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-muted">
            <a
              href="#features"
              className="hover:text-text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-text-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="hover:text-text-primary transition-colors"
            >
              Reviews
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle compact={true} />
            <Link
              to="/login"
              className="text-sm font-semibold text-text-muted hover:text-text-primary transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to={ctaLink}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-primary-50 via-violet-50/50 to-transparent rounded-full blur-3xl opacity-80" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 left-10 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 text-primary-700 text-sm font-bold px-4 py-2 rounded-full mb-8 shadow-sm">
            <Sparkles size={14} className="text-primary-500" />
            AI-Powered Exam Preparation Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-heading text-text-primary leading-tight mb-6">
            Study Smarter.
            <span className="relative inline-block ml-3">
              <span className="bg-gradient-to-r from-primary-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">
                Score Higher.
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M2 9 Q75 2 150 9 Q225 16 298 9"
                  stroke="url(#grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            SmartPrep builds your personalized study plan, tracks your progress
            with real analytics, and adapts automatically — so you walk into
            your exam confident and fully prepared.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ctaLink}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-primary-600/30 hover:shadow-primary-600/50 transition-all hover:-translate-y-1"
            >
              Start Preparing Free <ArrowRight size={20} />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-gray-600 font-bold text-lg px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Play size={18} className="text-primary-600" /> See How It Works
            </a>
          </div>

          <p className="text-sm text-gray-400 mt-5 font-medium">
            Free to get started · No credit card required · 50,000+ students
            trust SmartPrep
          </p>
        </div>

        {/* Hero Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="bg-surface rounded-3xl border border-border shadow-2xl overflow-hidden">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-muted/80">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1 mx-4 bg-surface rounded-md px-3 py-1 text-xs text-text-muted border border-border text-center">
                app.smartprep.study/dashboard
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="flex h-[380px] bg-surface-muted">
              {/* Sidebar mock */}
              <div className="w-48 bg-gray-900 p-4 flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg"></div>
                  <span className="text-white font-bold text-sm">
                    SmartPrep
                  </span>
                </div>
                {[
                  "Dashboard",
                  "Study Planner",
                  "Task Tracking",
                  "Mock Tests",
                  "Analytics",
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${i === 0 ? "bg-primary-600 text-white" : "text-gray-400"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-gray-600"}`}
                    ></div>
                    {item}
                  </div>
                ))}
              </div>
              {/* Main area mock */}
              <div className="flex-1 p-5 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="h-5 w-52 bg-gray-200 rounded-lg animate-pulse mb-1.5"></div>
                    <div className="h-3 w-36 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="h-9 w-36 bg-primary-600 rounded-xl opacity-80"></div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    ["78%", "Progress", "primary"],
                    ["12", "Days Left", "amber"],
                    ["4.5h", "Today", "blue"],
                    ["2", "Backlog", "red"],
                  ].map(([v, l, c], i) => (
                    <div
                      key={i}
                      className="bg-surface rounded-xl p-3 border border-border shadow-sm"
                    >
                      <div
                        className={`text-lg font-bold font-mono text-${c}-600`}
                      >
                        {v}
                      </div>
                      <div className="text-xs text-gray-400">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-surface rounded-xl p-4 border border-border shadow-sm">
                    <div className="text-xs font-bold text-text-muted mb-3">
                      Today's Study Plan
                    </div>
                    {[
                      "Data Structures - Arrays",
                      "OS - Process Scheduling",
                      "DBMS - Normalization",
                    ].map((t, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0"
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${i === 0 ? "bg-primary-600 border-primary-600" : "border-gray-300"}`}
                        >
                          {i === 0 && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span
                          className={`text-xs ${i === 0 ? "line-through text-gray-400" : "text-gray-700 font-medium"}`}
                        >
                          {t}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-surface rounded-xl p-4 border border-border shadow-sm flex flex-col items-center justify-center">
                    <div className="text-xs font-bold text-text-muted mb-2">
                      Exam Readiness
                    </div>
                    <div className="relative w-20 h-20">
                      <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          fill="none"
                          stroke="#EDE9FE"
                          strokeWidth="8"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          fill="none"
                          stroke="#7C3AED"
                          strokeWidth="8"
                          strokeDasharray="201"
                          strokeDashoffset="50"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-base font-black text-text-primary">
                          75%
                        </span>
                        <span className="text-[8px] text-violet-600 font-bold">
                          READY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating badges */}
          <div className="absolute -left-6 top-1/4 bg-surface rounded-2xl shadow-xl border border-border p-3 flex items-center gap-3 hidden lg:flex">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">
                Score Improved
              </p>
              <p className="text-sm font-black text-text-primary">
                +18% this week
              </p>
            </div>
          </div>
          <div className="absolute -right-6 bottom-1/4 bg-surface rounded-2xl shadow-xl border border-border p-3 flex items-center gap-3 hidden lg:flex">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Trophy size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium">
                Daily Streak
              </p>
              <p className="text-sm font-black text-text-primary">🔥 23 Days</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black text-gray-50 mb-1 font-heading">
                {s.value}
              </p>
              <p className="text-gray-400 text-sm font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-bold uppercase tracking-widest">
              Features
            </span>
            <h2 className="text-4xl font-black font-heading text-text-primary mt-2 mb-4">
              Everything You Need to Crack Your Exam
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium">
              From day-one planning to the night before your exam — SmartPrep
              has every tool you need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border bg-surface hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold font-heading text-text-primary mb-2">
                  {f.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 px-6 bg-surface-muted">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-bold uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="text-4xl font-black font-heading text-text-primary mt-2">
              Get Started in Minutes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div
              className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-200 via-violet-200 to-blue-200"
              style={{ top: "2.5rem" }}
            ></div>
            {steps.map((s, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center p-6"
              >
                <div className="w-20 h-20 rounded-full bg-surface border-4 border-primary-100 flex flex-col items-center justify-center mb-4 shadow-lg z-10">
                  <span className="text-2xl font-black text-primary-600 font-heading">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-base font-bold font-heading text-text-primary mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed font-medium">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary-600 text-sm font-bold uppercase tracking-widest">
              Success Stories
            </span>
            <h2 className="text-4xl font-black font-heading text-text-primary mt-2 mb-4">
              Students Who Made It
            </h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto font-medium">
              Real results from students who trusted SmartPrep for their
              preparation journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-surface-muted rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      size={16}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <p className="text-text-primary text-sm leading-relaxed mb-5 font-medium italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-primary-600 font-semibold">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-primary-900 to-violet-950 relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-surface-muted/30 border border-border text-gray-200 text-sm font-bold px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Zap size={14} className="text-yellow-400" />
            Join 50,000+ students already preparing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-heading text-gray-50 mb-6 leading-tight">
            Your Dream Score is
            <br />
            One Plan Away
          </h2>
          <p className="text-gray-300 text-lg mb-10 font-medium max-w-xl mx-auto">
            Start today for free. No credit card needed. Your personalized study
            plan will be ready in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ctaLink}
              className="flex items-center gap-2 bg-gray-50 text-primary-600 font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl hover:bg-gray-100 transition-all hover:-translate-y-0.5"
            >
              Get Your Free Study Plan <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="text-white/70 font-semibold text-base hover:text-white transition-colors px-4 py-4"
            >
              Already have an account?
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-gray-400 text-sm">
            {[
              "No credit card required",
              "Free forever plan",
              "Cancel anytime",
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-950 text-gray-500 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-violet-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold font-heading">SmartPrep</span>
            <span className="text-xs">— Adaptive Study Platform</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </a>
            <Link to="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-white transition-colors">
              Register
            </Link>
          </div>
          <p className="text-xs">© 2026 SmartPrep. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </AnimatedPage>
  );
};

export default LandingPage;
