import { useSelector } from "react-redux";
import {
  Bell,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Trophy,
  TrendingUp,
  Clock,
  BookOpen,
  Sun,
  Moon,
} from "lucide-react";
import { getTimeOfDay } from "../utils/dateUtils";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "success",
    icon: CheckCircle,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Session Completed!",
    message: "You finished 'Data Structures - Arrays' — 2h session",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "warning",
    icon: AlertCircle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Backlog Alert",
    message: "You have 3 skipped sessions that need rescheduling",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    type: "achievement",
    icon: Trophy,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
    title: "Streak Achievement!",
    message: "🔥 You've hit a 7-day study streak. Keep it up!",
    time: "3h ago",
    unread: true,
  },
  {
    id: 4,
    type: "info",
    icon: TrendingUp,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Score Improvement",
    message: "Your avg. mock test score improved by +8% this week",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    type: "reminder",
    icon: Clock,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "Exam Countdown",
    message: "Your exam is in 14 days. You're 72% exam-ready.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 6,
    type: "info",
    icon: BookOpen,
    iconColor: "text-primary-600",
    iconBg: "bg-primary-50",
    title: "New Mock Test Available",
    message: "OS — Chapter 3 Practice Test is now available",
    time: "2 days ago",
    unread: false,
  },
];

const SEARCH_ITEMS = [
  { label: "Dashboard", icon: "📊", path: "/dashboard", type: "Page" },
  { label: "Study Planner", icon: "📅", path: "/planner", type: "Page" },
  { label: "Task Tracking", icon: "✅", path: "/tasks", type: "Page" },
  { label: "Mock Tests", icon: "📝", path: "/tests", type: "Page" },
  { label: "Analytics", icon: "📈", path: "/analytics", type: "Page" },
  { label: "Settings", icon: "⚙️", path: "/settings", type: "Page" },
  { label: "Backlog", icon: "🔄", path: "/planner/backlog", type: "Page" },
  { label: "Data Structures", icon: "📚", path: "/tests", type: "Subject" },
  { label: "Operating Systems", icon: "📚", path: "/tests", type: "Subject" },
  { label: "Computer Networks", icon: "📚", path: "/tests", type: "Subject" },
  { label: "DBMS", icon: "📚", path: "/tests", type: "Subject" },
  { label: "Algorithms", icon: "📚", path: "/tests", type: "Subject" },
];

const Navbar = ({ title, subtitle }) => {
  const { user } = useSelector((state) => state.auth);
  const { themeMode, setThemeMode } = useTheme();
  const navigate = useNavigate();
  const greeting = `Good ${getTimeOfDay()}, ${user?.name || "Student"}! 👋`;
  const avatarUrl = localStorage.getItem("sp_avatar");

  // Notifications state
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const filteredSearch =
    searchQuery.trim().length > 0
      ? SEARCH_ITEMS.filter((s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearch(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () =>
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  const dismissNotif = (id) =>
    setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 pl-16 lg:px-8 py-4">
        <div className="min-w-0 flex-1 mr-4">
          {title ? (
            <>
              <h1 className="text-2xl font-bold text-text-primary font-heading">
                {title}
              </h1>
              {subtitle && (
                <p className="text-text-muted text-sm mt-0.5">{subtitle}</p>
              )}
            </>
          ) : (
            <h1 className="text-xl font-semibold text-text-primary font-heading">
              {greeting}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center gap-2 bg-surface-muted rounded-xl px-4 py-2.5 w-64 border border-border">
              <Search size={18} className="text-text-muted" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearch(false);
                  }}
                >
                  <X size={14} className="text-text-muted" />
                </button>
              )}
            </div>
            {showSearch && filteredSearch.length > 0 && (
              <div className="absolute top-full mt-2 left-0 w-full bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border">
                  Results
                </div>
                {filteredSearch.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      navigate(item.path);
                      setSearchQuery("");
                      setShowSearch(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-muted transition-colors text-left"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {item.label}
                      </p>
                      <p className="text-xs text-text-muted">{item.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showSearch &&
              searchQuery.trim() &&
              filteredSearch.length === 0 && (
                <div className="absolute top-full mt-2 left-0 w-full bg-surface border border-border rounded-2xl shadow-2xl p-4 z-50 text-center">
                  <p className="text-sm text-text-muted font-medium">
                    No results for "{searchQuery}"
                  </p>
                </div>
              )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
            className="p-2.5 hover:bg-surface-muted rounded-xl transition-colors border border-transparent hover:border-border text-text-muted hover:text-primary-600"
            aria-label="Toggle theme"
            title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}
          >
            {themeMode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2.5 hover:bg-surface-muted rounded-xl transition-colors border border-transparent hover:border-border"
            >
              <Bell size={20} className="text-text-muted" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div>
                    <h3 className="font-bold text-text-primary font-heading">
                      Notifications
                    </h3>
                    <p className="text-xs text-text-muted">
                      {unreadCount} unread
                    </p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification list */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex gap-3 px-5 py-4 border-b border-border last:border-0 transition-colors ${notif.unread ? "bg-primary-50/30" : ""} hover:bg-surface-muted`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl ${notif.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                      >
                        <notif.icon size={17} className={notif.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-text-primary leading-tight">
                            {notif.title}
                          </p>
                          <button
                            onClick={() => dismissNotif(notif.id)}
                            className="text-text-muted hover:text-text-primary transition-colors shrink-0 mt-0.5"
                          >
                            <X size={13} />
                          </button>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                        <p className="text-[10px] font-bold text-text-muted mt-1 uppercase tracking-wider">
                          {notif.time}
                        </p>
                      </div>
                      {notif.unread && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full shrink-0 mt-2" />
                      )}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="py-12 text-center">
                      <Bell
                        size={32}
                        className="text-text-muted mx-auto mb-3 opacity-40"
                      />
                      <p className="text-sm text-text-muted font-medium">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-border bg-surface-muted/50">
                  <button className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors w-full text-center">
                    View All Activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-primary">
                {user?.name || "Student"}
              </p>
              <p className="text-xs text-text-muted">
                {user?.course || "CS Student"}
              </p>
            </div>
            <div
              onClick={() => navigate("/settings")}
              className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-primary-400 transition-all shrink-0"
              title="Go to Settings"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-base">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
