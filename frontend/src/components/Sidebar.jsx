import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { getDaysUntil } from "../utils/dateUtils";
import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Clock,
  Layers,
  Menu,
  X,
  BookMarked,
  Trophy,
  School,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/planner", label: "Study Planner", icon: CalendarDays },
  { path: "/tasks", label: "Task Tracking", icon: CheckSquare },
  { path: "/subjects", label: "Subjects", icon: Layers },
  { path: "/notes", label: "Notes & Flashcards", icon: BookMarked },
  { path: "/tests", label: "Mock Tests", icon: FileText },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { path: "/instructor", label: "Instructor Portal", icon: School },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const daysToExam = user?.examDate ? getDaysUntil(user.examDate) : null;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
          <GraduationCap size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-heading font-bold text-lg">
            SmartPrep
          </h1>
          <p className="text-blue-400/60 text-xs">Learning Portal</p>
        </div>
        {/* Mobile close */}
        <button
          className="ml-auto lg:hidden text-white/60 hover:text-white p-1"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Exam Countdown */}
      {daysToExam !== null && (
        <div className="mx-4 mb-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Clock size={14} />
            <span>Exam Countdown</span>
          </div>
          <p className="text-white font-mono font-bold text-lg">
            {daysToExam}{" "}
            <span className="text-sm font-normal text-gray-400">days left</span>
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 space-y-1 border-t border-white/10">
        <NavLink
          to="/settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name || "Student"}
            </p>
            <p className="text-blue-400/60 text-xs truncate">
              {user?.examType || "No exam set"}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar text-white p-2.5 rounded-xl shadow-lg border border-white/10"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile sidebar (slide-in) ── */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50 transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-sidebar flex-col z-40">
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
