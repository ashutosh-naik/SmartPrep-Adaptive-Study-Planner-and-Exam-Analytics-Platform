import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../store/authSlice";
import {
  User,
  BookOpen,
  Bell,
  Calendar,
  Save,
  Plus,
  Trash2,
  Sun,
  Moon,
  Monitor,
  Camera,
  MapPin,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import { analyticsService } from "../../services/analyticsService";
import {
  STUDY_TIMES,
  BREAK_DURATIONS,
  DIFFICULTY_LEVELS,
} from "../../utils/constants";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
    examType: "",
    examDate: "",
    studyHoursPerDay: 4,
    preferredStudyTime: "",
    breakDuration: 15,
  });
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    testNotifications: true,
    progressReports: false,
  });
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    () => localStorage.getItem("sp_avatar") || "",
  );
  const avatarInputRef = useRef(null);
  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
    showCurrent: false,
    showNext: false,
  });
  const [pushPerm, setPushPerm] = useState(() => {
    try {
      return Notification.permission;
    } catch {
      return "default";
    }
  });

  const themeOptions = [
    {
      value: "light",
      label: "Light",
      description: "Bright and clean interface",
      icon: Sun,
    },
    {
      value: "dark",
      label: "Dark",
      description: "Low-glare for long sessions",
      icon: Moon,
    },
  ];

  useEffect(() => {
    if (user)
      setProfile({
        name: user.name || "",
        email: user.email || "",
        course: user.course || "",
        year: user.year || "",
        examType: user.examType || "",
        examDate: user.examDate || "",
        studyHoursPerDay: user.studyHoursPerDay || 4,
        preferredStudyTime: user.preferredStudyTime || "",
        breakDuration: user.breakDuration || 15,
      });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await analyticsService.updateProfile(profile);
      dispatch(updateUser(res.data));
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([
        ...subjects,
        { name: newSubject.trim(), difficulty: "Medium" },
      ]);
      setNewSubject("");
    }
  };
  const removeSubject = (i) =>
    setSubjects(subjects.filter((_, idx) => idx !== i));
  const updateDifficulty = (i, d) =>
    setSubjects(
      subjects.map((s, idx) => (idx === i ? { ...s, difficulty: d } : s)),
    );

  const pwStrength =
    pwForm.next.length >= 8
      ? pwForm.next.match(/[A-Z]/) && pwForm.next.match(/[0-9]/)
        ? "Strong"
        : "Medium"
      : pwForm.next.length > 0
        ? "Weak"
        : "";

  const handleChangePw = (e) => {
    e.preventDefault();
    if (!pwForm.current) {
      toast.error("Enter current password");
      return;
    }
    if (pwForm.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully!");
    setPwForm({
      current: "",
      next: "",
      confirm: "",
      showCurrent: false,
      showNext: false,
    });
  };

  const enablePushNotifications = async () => {
    if (pushPerm === "granted") {
      toast.success("Notifications already enabled!");
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setPushPerm(result);
      if (result === "granted") {
        new Notification("SmartPrep", {
          body: "🎓 Study reminders are now enabled!",
          icon: "/favicon.svg",
        });
        toast.success("Browser notifications enabled!");
      } else {
        toast.error("Permission denied. Please enable in browser settings.");
      }
    } catch {
      toast.error("Notifications not supported in this browser.");
    }
  };

  return (
    <AnimatedPage>
      <Navbar
        title="Settings"
        subtitle="Manage your profile, study preferences, and notifications"
      />
      <div className="p-4 sm:p-8 max-w-4xl animate-fade-in relative">
        {/* Floating Save Button */}
        <div className="absolute top-8 right-8 hidden sm:block">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-600/25"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Appearance Section */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Monitor size={20} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-text-primary font-heading text-lg">
              Appearance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themeOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setThemeMode(option.value)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  themeMode === option.value
                    ? "border-primary-600 bg-primary-50"
                    : "border-border bg-surface hover:border-primary-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <option.icon
                    size={16}
                    className={
                      themeMode === option.value
                        ? "text-primary-600"
                        : "text-text-muted"
                    }
                  />
                  <p className="font-bold text-sm text-text-primary">
                    {option.label}
                  </p>
                </div>
                <p className="text-xs text-text-muted">{option.description}</p>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-text-muted">
            Active theme:
            <span className="font-semibold text-text-primary capitalize ml-1">
              {resolvedTheme}
            </span>
            {themeMode === "system" && <span className="ml-1">(auto)</span>}
          </p>
        </div>

        {/* Profile Section */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-50 rounded-lg">
              <User size={20} className="text-primary-600" />
            </div>
            <h3 className="font-semibold text-text-primary font-heading text-lg">
              Profile Details
            </h3>
          </div>

          {/* Avatar Area */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative group">
              {/* Hidden file input */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error("Image must be under 5 MB");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const dataUrl = ev.target.result;
                    setAvatarUrl(dataUrl);
                    localStorage.setItem("sp_avatar", dataUrl);
                    toast.success("Profile photo updated!");
                  };
                  reader.readAsDataURL(file);
                  e.target.value = "";
                }}
              />
              {/* Avatar circle */}
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-primary-700 p-1 cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full border-4 border-white bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-3xl font-black">
                    {profile.name?.charAt(0)?.toUpperCase() ||
                      user?.name?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                )}
              </div>
              {/* Hover overlay */}
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="text-white" size={20} />
                <span className="text-white text-[10px] font-bold mt-0.5">
                  Upload
                </span>
              </div>
              {/* Remove avatar button */}
              {avatarUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAvatarUrl("");
                    localStorage.removeItem("sp_avatar");
                    toast.success("Photo removed");
                  }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors text-xs font-bold"
                  title="Remove photo"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold font-heading text-text-primary mb-1">
                {profile.name || user?.name || "Student Name"}
              </h2>
              <p className="text-sm text-text-muted flex items-center justify-center sm:justify-start gap-1">
                <MapPin size={14} />{" "}
                {user?.university || "University of Academic Excellence"}
              </p>
              <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                  {profile.course || "B.Tech CS"}
                </span>
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-100">
                  {profile.year || "3rd Year"}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Click the photo to upload a new avatar (max 5 MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Full Name
              </label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Email
              </label>
              <input
                value={profile.email}
                disabled
                className="input-field bg-surface-muted cursor-not-allowed text-text-muted opacity-60"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Course
              </label>
              <input
                value={profile.course}
                onChange={(e) =>
                  setProfile({ ...profile, course: e.target.value })
                }
                placeholder="e.g., MCA, B.Tech CS"
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Year
              </label>
              <input
                value={profile.year}
                onChange={(e) =>
                  setProfile({ ...profile, year: e.target.value })
                }
                placeholder="e.g., 3rd Year"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Study Preferences */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-text-primary font-heading text-lg">
              Study Preferences
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-bold text-gray-700">
                  Daily Goal
                </label>
                <span className="text-primary-700 font-bold font-mono bg-primary-100 px-2 py-0.5 rounded-md text-sm">
                  {profile.studyHoursPerDay}h
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={profile.studyHoursPerDay}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    studyHoursPerDay: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-bold px-1 uppercase tracking-wider">
                <span>1h</span>
                <span>4h</span>
                <span>8h</span>
                <span>12h</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Preferred Time
              </label>
              <select
                value={profile.preferredStudyTime}
                onChange={(e) =>
                  setProfile({ ...profile, preferredStudyTime: e.target.value })
                }
                className="input-field"
              >
                <option value="">Select time</option>
                {STUDY_TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Break Duration
              </label>
              <select
                value={profile.breakDuration}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    breakDuration: parseInt(e.target.value),
                  })
                }
                className="input-field"
              >
                {BREAK_DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} minutes
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exam Settings */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Calendar size={20} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-text-primary font-heading text-lg">
              Exam Settings
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Exam Date
              </label>
              <input
                type="date"
                value={profile.examDate}
                onChange={(e) =>
                  setProfile({ ...profile, examDate: e.target.value })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Exam Type
              </label>
              <select
                value={profile.examType}
                onChange={(e) =>
                  setProfile({ ...profile, examType: e.target.value })
                }
                className="input-field"
              >
                <option value="">Select</option>
                <option value="semester">Semester Exam</option>
                <option value="competitive">Competitive Exam</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subject Difficulty Mapping */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <BookOpen size={20} className="text-rose-600" />
                </div>
                <h3 className="font-semibold text-text-primary font-heading text-lg">
                  Subject Difficulty Mapping
                </h3>
              </div>
              <p className="text-sm text-text-muted ml-11">
                Adjust these levels to change how tasks are prioritized.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto ml-11 sm:ml-0">
              <input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add subject"
                className="input-field py-2 text-sm w-full sm:w-48"
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
              />
              <button
                onClick={addSubject}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {subjects.length > 0 ? (
            <div className="space-y-3 mt-6">
              {subjects.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-border transition-colors shadow-sm"
                >
                  <span className="flex-1 font-bold text-text-primary">
                    {s.name}
                  </span>
                  <select
                    value={s.difficulty}
                    onChange={(e) => updateDifficulty(i, e.target.value)}
                    className="text-sm border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500 font-semibold bg-surface-muted text-text-primary"
                  >
                    {DIFFICULTY_LEVELS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeSubject(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-sm mt-6 p-4 border border-dashed border-border rounded-xl text-center bg-surface-muted">
              No subjects added yet. Add your curriculum subjects above.
            </p>
          )}
        </div>

        {/* ── Security: Change Password ── */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="font-semibold text-text-primary font-heading text-lg">
              Security
            </h3>
          </div>
          <form onSubmit={handleChangePw} className="space-y-4 max-w-sm">
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={pwForm.showCurrent ? "text" : "password"}
                  value={pwForm.current}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, current: e.target.value }))
                  }
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPwForm((p) => ({ ...p, showCurrent: !p.showCurrent }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  {pwForm.showCurrent ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={pwForm.showNext ? "text" : "password"}
                  value={pwForm.next}
                  onChange={(e) =>
                    setPwForm((p) => ({ ...p, next: e.target.value }))
                  }
                  className="input-field pr-10"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPwForm((p) => ({ ...p, showNext: !p.showNext }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  {pwForm.showNext ? "Hide" : "Show"}
                </button>
              </div>
              {pwStrength && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${pwStrength === "Strong" ? "bg-green-500" : pwStrength === "Medium" ? "bg-amber-400" : "bg-red-400"}`}
                  />
                  <span
                    className={`text-xs font-bold ${pwStrength === "Strong" ? "text-green-700" : pwStrength === "Medium" ? "text-amber-700" : "text-red-700"}`}
                  >
                    {pwStrength}
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-bold text-text-primary mb-1.5 block">
                Confirm New Password
              </label>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={(e) =>
                  setPwForm((p) => ({ ...p, confirm: e.target.value }))
                }
                className={`input-field ${pwForm.confirm && pwForm.confirm !== pwForm.next ? "border-red-300" : ""}`}
                placeholder="Re-enter new password"
              />
              {pwForm.confirm && pwForm.confirm !== pwForm.next && (
                <p className="text-xs text-red-500 mt-1 font-semibold">
                  Passwords don't match
                </p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2"
            >
              <Save size={15} /> Update Password
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="card mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Bell size={20} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-text-primary font-heading text-lg">
              Notifications
            </h3>
          </div>

          {/* Push notification enable */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl border mb-4 ${pushPerm === "granted" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
          >
            <div>
              <p className="font-bold text-gray-800 mb-0.5">
                Browser Push Notifications
              </p>
              <p className="text-xs text-gray-500">
                Get study reminders even when the tab is in background
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${pushPerm === "granted" ? "bg-green-100 text-green-700" : pushPerm === "denied" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
              >
                {pushPerm === "granted"
                  ? "✓ Enabled"
                  : pushPerm === "denied"
                    ? "Blocked"
                    : "Not Set"}
              </span>
              {pushPerm !== "denied" && (
                <button
                  onClick={enablePushNotifications}
                  className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${pushPerm === "granted" ? "bg-green-100 text-green-700" : "bg-primary-600 text-white hover:bg-primary-700"}`}
                >
                  {pushPerm === "granted" ? "✓ Active" : "Enable"}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {[
              [
                "dailyReminders",
                "Daily Reminders",
                "Get notified about your study schedule",
              ],
              [
                "testNotifications",
                "Test Notifications",
                "Alerts for upcoming tests",
              ],
              [
                "progressReports",
                "Progress Reports",
                "Weekly progress updates",
              ],
            ].map(([key, label, desc]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary-100 hover:bg-primary-50/30 transition-colors bg-surface"
              >
                <div>
                  <p className="font-bold text-text-primary mb-0.5">{label}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${notifications[key] ? "text-primary-600" : "text-gray-400"}`}
                  >
                    {notifications[key] ? "Enabled" : "Disabled"}
                  </span>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [key]: !notifications[key],
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-all ${notifications[key] ? "bg-primary-600" : "bg-gray-200"} relative focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all ${notifications[key] ? "right-1" : "left-1"}`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sm:hidden mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full flex justify-center items-center gap-2 py-3 shadow-lg shadow-primary-600/25"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Settings;
