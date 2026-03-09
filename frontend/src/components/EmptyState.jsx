/**
 * EmptyState — reusable empty state component for all pages
 * Usage: <EmptyState type="tasks" onAction={() => ...} />
 */

const STATES = {
  tasks: {
    emoji: "📋",
    title: "No tasks yet",
    subtitle: "Add your first task to start tracking your study progress",
    actionLabel: "+ Add Task",
    bg: "from-blue-50 to-indigo-50",
  },
  planner: {
    emoji: "📅",
    title: "Nothing scheduled today",
    subtitle:
      "Your study schedule is empty for this day. Add tasks in the planner to fill it up.",
    actionLabel: "+ Create Plan",
    bg: "from-violet-50 to-purple-50",
  },
  tests: {
    emoji: "📝",
    title: "No tests available",
    subtitle:
      "No mock tests are available yet. Ask your instructor or check back later.",
    actionLabel: null,
    bg: "from-amber-50 to-orange-50",
  },
  analytics: {
    emoji: "📊",
    title: "No analytics data yet",
    subtitle:
      "Complete at least one mock test to generate your performance analytics.",
    actionLabel: "Take a Test",
    bg: "from-green-50 to-emerald-50",
  },
  subjects: {
    emoji: "📚",
    title: "No subjects added",
    subtitle:
      "Add your exam subjects to organize your study plan and track topic progress.",
    actionLabel: "+ Add Subject",
    bg: "from-rose-50 to-pink-50",
  },
  search: {
    emoji: "🔍",
    title: "No results found",
    subtitle: "Try a different search term or browse the categories.",
    actionLabel: null,
    bg: "from-gray-50 to-slate-50",
  },
  notifications: {
    emoji: "🔔",
    title: "All caught up!",
    subtitle: "You have no new notifications right now.",
    actionLabel: null,
    bg: "from-blue-50 to-sky-50",
  },
};

const EmptyState = ({
  type = "tasks",
  onAction,
  title,
  subtitle,
  emoji,
  actionLabel,
  compact = false,
}) => {
  const preset = STATES[type] || STATES.tasks;
  const displayEmoji = emoji || preset.emoji;
  const displayTitle = title || preset.title;
  const displaySubtitle = subtitle || preset.subtitle;
  const displayAction =
    actionLabel !== undefined ? actionLabel : preset.actionLabel;
  const bg = preset.bg;

  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="text-4xl mb-3">{displayEmoji}</div>
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
      className={`w-full rounded-2xl bg-gradient-to-br ${bg} border border-white/60 shadow-sm p-10 flex flex-col items-center justify-center text-center`}
    >
      {/* Floating illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-white shadow-lg flex items-center justify-center text-5xl animate-bounce-slow">
          {displayEmoji}
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-xs">
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
