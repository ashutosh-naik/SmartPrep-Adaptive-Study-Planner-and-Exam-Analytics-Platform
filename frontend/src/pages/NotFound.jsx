import { Link } from "react-router-dom";
import { Home, ArrowLeft, BookOpen, GraduationCap } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-violet-50/30 flex items-center justify-center px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-8 select-none">
          <p className="text-[10rem] font-black text-gray-100 leading-none tracking-tighter user-select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary-600/30 rotate-6 hover:rotate-0 transition-transform duration-500">
              <GraduationCap size={44} className="text-white" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-black font-heading text-gray-900 mb-3">
          Oops! Looks like you wandered off the syllabus
        </h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
          This page doesn't exist in your study plan. Let's get you back on
          track before you fall behind!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-primary-600/30 transition-all hover:-translate-y-0.5"
          >
            <Home size={18} /> Back to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 font-bold px-8 py-3.5 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-12 flex flex-wrap gap-2 justify-center">
          {[
            { label: "Study Planner", path: "/planner" },
            { label: "Mock Tests", path: "/tests" },
            { label: "Analytics", path: "/analytics" },
            { label: "Settings", path: "/settings" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold bg-primary-50 border border-primary-100 px-4 py-2 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <BookOpen size={13} /> {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
