import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Filter,
  FileText,
  MessageSquare,
  Ban,
  Plus,
  PlayCircle,
  X,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import ProgressBar from "../../components/ProgressBar";
import Loader from "../../components/Loader";
import { taskService } from "../../services/taskService";
import { formatDuration } from "../../utils/calculationUtils";
import { formatShortDate } from "../../utils/dateUtils";
import { STATUS_CONFIG } from "../../utils/constants";
import toast from "react-hot-toast";

const TaskTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    skipped: 0,
    completionRate: 0,
  });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    topicName: "",
    subjectName: "",
    durationHours: 1,
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, summaryRes] = await Promise.all([
        taskService.getTasks(filter),
        taskService.getTaskSummary(),
      ]);
      setTasks(tasksRes.data || []);
      setSummary(summaryRes.data || summary);
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await taskService.completeTask(id);
      toast.success("Done!");
      fetchData();
    } catch {
      toast.error("Error");
    }
  };
  const handleSkip = async (id) => {
    try {
      await taskService.skipTask(id);
      toast.success("Skipped");
      fetchData();
    } catch {
      toast.error("Error");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.topicName.trim() || !newTask.subjectName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setAdding(true);
    try {
      await taskService.createTask(newTask);
      toast.success("Task added!");
      setShowModal(false);
      setNewTask({ topicName: "", subjectName: "", durationHours: 1 });
      fetchData();
    } catch {
      toast.error("Failed to add task — please try again.");
    } finally {
      setAdding(false);
    }
  };

  const statCards = [
    {
      label: "Total Tasks",
      value: summary.total,
      icon: FileText,
      color: "text-primary-600",
      bg: "bg-primary-50",
      sub: "+4 from last week",
    },
    {
      label: "Completed",
      value: summary.completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      sub: "+12% from last week",
    },
    {
      label: "Pending",
      value: summary.pending,
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
      sub: "Due by EOD",
    },
    {
      label: "Skipped",
      value: summary.skipped,
      icon: Ban,
      color: "text-red-600",
      bg: "bg-red-50",
      sub: "Review scheduled",
    },
  ];

  return (
    <div>
      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold font-heading text-text-primary">
                Add New Task
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-surface-muted rounded-xl transition-colors"
              >
                <X size={20} className="text-text-muted" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Topic Name *
                </label>
                <input
                  value={newTask.topicName}
                  onChange={(e) =>
                    setNewTask({ ...newTask, topicName: e.target.value })
                  }
                  placeholder="e.g. Binary Search Trees"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Subject *
                </label>
                <input
                  value={newTask.subjectName}
                  onChange={(e) =>
                    setNewTask({ ...newTask, subjectName: e.target.value })
                  }
                  placeholder="e.g. Data Structures"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  min={0.5}
                  max={8}
                  step={0.5}
                  value={newTask.durationHours}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      durationHours: parseFloat(e.target.value),
                    })
                  }
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60"
                >
                  {adding ? "Adding..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar
        title="Task Tracking"
        subtitle="Manage and monitor your daily study goals."
      />
      <div className="p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-heading text-text-primary">
            Overview
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm shadow-primary-600/20"
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((s, i) => (
            <div key={i} className="card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-muted font-medium">
                  {s.label}
                </span>
                <div className={`p-2 rounded-lg ${s.bg}`}>
                  <s.icon size={16} className={s.color} />
                </div>
              </div>
              <p className={`text-3xl font-bold font-mono ${s.color}`}>
                {s.value}
              </p>
              {s.sub && <p className="text-xs text-text-muted mt-1">{s.sub}</p>}
            </div>
          ))}
        </div>

        {/* Completion Rate */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-text-primary font-heading">
                Overall Completion
              </h3>
              <p className="text-sm text-text-muted">
                Progress across all curriculum subjects
              </p>
            </div>
            <p className="text-3xl font-bold text-green-600 font-mono">
              {summary.completionRate}%
            </p>
          </div>
          <ProgressBar
            value={summary.completionRate}
            color="bg-gradient-to-r from-primary-500 to-green-500"
            height="h-3"
          />
          <div className="flex gap-6 mt-2 text-xs text-text-muted">
            <span>
              ● {summary.completed} of {summary.total} tasks finished
            </span>
            <span>● {summary.total - summary.completed} remaining</span>
          </div>
        </div>

        {/* Filter + Task List */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary font-heading">
              Active Tasks
            </h3>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Tasks</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loader size="sm" />
          ) : tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-text-muted uppercase tracking-wider">
                    <th className="py-4 px-4 font-semibold font-heading">
                      Action
                    </th>
                    <th className="py-4 px-4 font-semibold font-heading">
                      Topic &amp; Module
                    </th>
                    <th className="py-4 px-4 font-semibold font-heading">
                      Subject
                    </th>
                    <th className="py-4 px-4 font-semibold font-heading">
                      Duration
                    </th>
                    <th className="py-4 px-4 font-semibold font-heading">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    const config =
                      STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
                    const isCompleted = task.status === "completed";
                    const badgeColors = [
                      "bg-blue-100 text-blue-700",
                      "bg-emerald-100 text-emerald-700",
                      "bg-purple-100 text-purple-700",
                      "bg-orange-100 text-orange-700",
                    ];
                    const colorIdx =
                      task.subjectName.length % badgeColors.length;
                    return (
                      <tr
                        key={task.id}
                        className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group"
                      >
                        <td className="py-4 px-4 align-middle">
                          {task.status === "pending" ? (
                            <button
                              onClick={() => handleComplete(task.id)}
                              className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-600 flex items-center justify-center transition-colors"
                            >
                              <PlayCircle size={18} />
                            </button>
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isCompleted ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                            >
                              {isCompleted ? "✓" : "✗"}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 align-middle max-w-xs">
                          <p
                            className={`font-semibold text-sm truncate ${isCompleted ? "line-through text-text-muted" : "text-gray-800"}`}
                          >
                            {task.topicName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {task.moduleName || "General Practice"}
                          </p>
                        </td>
                        <td className="py-4 px-4 align-middle">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md tracking-wide ${badgeColors[colorIdx]}`}
                          >
                            {task.subjectName}
                          </span>
                        </td>
                        <td className="py-4 px-4 align-middle">
                          <span className="text-sm text-gray-600 font-medium">
                            {formatDuration(task.durationHours)}
                          </span>
                        </td>
                        <td className="py-4 px-4 align-middle">
                          <span
                            className={`${config.bg} ${config.color} px-3 py-1 rounded-full text-xs font-semibold`}
                          >
                            {config.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-text-muted text-sm">
                No tasks found. Generate a study plan first!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskTracking;
