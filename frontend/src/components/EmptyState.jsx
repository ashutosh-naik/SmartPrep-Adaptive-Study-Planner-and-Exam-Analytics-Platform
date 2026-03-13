import { 
  ClipboardList, 
  CalendarX2, 
  FileQuestion, 
  BarChart4, 
  BookX, 
  SearchX, 
  BellRing
} from "lucide-react";

/**
 * EmptyState — reusable empty state component for all pages
 * Usage: <EmptyState type="tasks" onAction={() => ...} />
 */

const STATES = {
  tasks: {
    icon: ClipboardList,
    title: "No tasks yet",
    subtitle: "Add your first task to start tracking your study progress",
    actionLabel: "+ Add Task",
    bg: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-500",
  },
  planner: {
    icon: CalendarX2,
    title: "Nothing scheduled today",
    subtitle:
      "Your study schedule is empty for this day. Add tasks in the planner to fill it up.",
    actionLabel: "+ Create Plan",
    bg: "from-violet-50 to-purple-50",
    iconColor: "text-violet-500",
  },
  tests: {
    icon: FileQuestion,
    title: "No tests available",
    subtitle:
      "No mock tests are available yet. Ask your instructor or check back later.",
    actionLabel: null,
    bg: "from-amber-50 to-orange-50",
    iconColor: "text-amber-500",
  },
  analytics: {
    icon: BarChart4,
    title: "No analytics data yet",
    subtitle:
      "Complete at least one mock test to generate your performance analytics.",
    actionLabel: "Take a Test",
    bg: "from-green-50 to-emerald-50",
    iconColor: "text-green-500",
  },
  subjects: {
    icon: BookX,
    title: "No subjects added",
    subtitle:
      "Add your exam subjects to organize your study plan and track topic progress.",
    actionLabel: "+ Add Subject",
    bg: "from-rose-50 to-pink-50",
    iconColor: "text-rose-500",
  },
  search: {
    icon: SearchX,
    title: "No results found",
    subtitle: "Try a different search term or browse the categories.",
    actionLabel: null,
    bg: "from-gray-50 to-slate-50",
    iconColor: "text-gray-500",
  },
  notifications: {
    icon: BellRing,
    title: "All caught up!",
    subtitle: "You have no new notifications right now.",
    actionLabel: null,
    bg: "from-blue-50 to-sky-50",
    iconColor: "text-blue-500",
  },
};

const EmptyState = ({
  type = "tasks",
  onAction,
  title,
  subtitle,
  icon,
  actionLabel,
  compact = false,
}) => {
  const preset = STATES[type] || STATES.tasks;
  const displayIcon = icon || preset.icon;
  const IconComponent = displayIcon;
  const displayTitle = title || preset.title;
  const displaySubtitle = subtitle || preset.subtitle;
  const displayAction =
    actionLabel !== undefined ? actionLabel : preset.actionLabel;
  const bg = preset.bg;

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-white border border-border shadow-sm ${preset.iconColor}`}>
          <IconComponent size={24} strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-text-primary mb-1">{displayTitle}</p>
        <p className="text-sm text-text-muted mb-4 max-w-xs">
          {displaySubtitle}
        </p>
        {displayAction && onAction && (
          <button onClick={onAction} className="btn-primary text-sm py-2 px-4">
            {displayAction}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-3xl bg-gradient-to-br ${bg} border border-border/50 shadow-sm p-12 flex flex-col items-center justify-center text-center animate-fade-in border-dashed`}
    >
      {/* Floating illustration */}
      <div className="relative mb-8">
        <div className={`w-28 h-28 rounded-full bg-white shadow-xl flex items-center justify-center animate-bounce-slow border-4 border-white ${preset.iconColor}`}>
          <IconComponent size={48} strokeWidth={1.5} />
        </div>
        {/* Pulsing rings */}
        <div className={`absolute inset-0 rounded-full border-2 ${preset.iconColor} opacity-20 animate-ping`} style={{ animationDuration: '3s' }} />
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-[10px] transform rotate-12">
          ✨
        </div>
      </div>

      <h3 className="text-xl font-black text-gray-900 mb-2 font-heading">
        {displayTitle}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
        {displaySubtitle}
      </p>

      {displayAction && onAction && (
        <button
          onClick={onAction}
          className="btn-primary py-3 px-8 shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 transition-all duration-200"
        >
          {displayAction}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
