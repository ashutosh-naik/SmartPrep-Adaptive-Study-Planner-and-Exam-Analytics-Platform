import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Tag,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  X,
  Layers,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

// LocalStorage key
const LS_KEY = "sp_subjects";

const SUBJECT_COLORS = [
  {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
  {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
  {
    bg: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
  },
];

const DIFFICULTY = ["Easy", "Medium", "Hard"];

const defaultSubjects = [
  {
    id: 1,
    name: "Data Structures",
    colorIdx: 0,
    difficulty: "Medium",
    progress: 65,
    topics: [
      { id: 1, name: "Arrays & Strings", done: true },
      { id: 2, name: "Linked Lists", done: true },
      { id: 3, name: "Stacks & Queues", done: false },
      { id: 4, name: "Trees & Graphs", done: false },
    ],
  },
  {
    id: 2,
    name: "Operating Systems",
    colorIdx: 1,
    difficulty: "Hard",
    progress: 40,
    topics: [
      { id: 1, name: "Process Management", done: true },
      { id: 2, name: "Memory Management", done: false },
      { id: 3, name: "File Systems", done: false },
    ],
  },
];

const SubjectManager = () => {
  const [subjects, setSubjects] = useState(() => {
    try {
      const s = localStorage.getItem(LS_KEY);
      return s ? JSON.parse(s) : defaultSubjects;
    } catch {
      return defaultSubjects;
    }
  });
  const [expandedId, setExpandedId] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState(0);
  const [newSubjectDiff, setNewSubjectDiff] = useState("Medium");
  const [addingTopicTo, setAddingTopicTo] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(subjects));
  }, [subjects]);

  const persist = (updated) => {
    setSubjects(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) {
      toast.error("Please enter a subject name");
      return;
    }
    const s = {
      id: Date.now(),
      name: newSubjectName.trim(),
      colorIdx: newSubjectColor,
      difficulty: newSubjectDiff,
      progress: 0,
      topics: [],
    };
    persist([...subjects, s]);
    setNewSubjectName("");
    setShowAddSubject(false);
    toast.success(`"${s.name}" added!`);
  };

  const deleteSubject = (id) => {
    if (!confirm("Delete this subject and all its topics?")) return;
    persist(subjects.filter((s) => s.id !== id));
    toast.success("Subject removed");
  };

  const addTopic = (subjectId) => {
    if (!newTopicName.trim()) {
      toast.error("Enter a topic name");
      return;
    }
    const updated = subjects.map((s) =>
      s.id === subjectId
        ? {
            ...s,
            topics: [
              ...s.topics,
              { id: Date.now(), name: newTopicName.trim(), done: false },
            ],
          }
        : s,
    );
    persist(updated);
    setNewTopicName("");
    setAddingTopicTo(null);
    toast.success("Topic added!");
  };

  const toggleTopic = (subjectId, topicId) => {
    const updated = subjects.map((s) => {
      if (s.id !== subjectId) return s;
      const topics = s.topics.map((t) =>
        t.id === topicId ? { ...t, done: !t.done } : t,
      );
      const progress =
        topics.length > 0
          ? Math.round(
              (topics.filter((t) => t.done).length / topics.length) * 100,
            )
          : 0;
      return { ...s, topics, progress };
    });
    persist(updated);
  };

  const deleteTopic = (subjectId, topicId) => {
    const updated = subjects.map((s) => {
      if (s.id !== subjectId) return s;
      const topics = s.topics.filter((t) => t.id !== topicId);
      const progress =
        topics.length > 0
          ? Math.round(
              (topics.filter((t) => t.done).length / topics.length) * 100,
            )
          : 0;
      return { ...s, topics, progress };
    });
    persist(updated);
  };

  const saveSubjectName = (id) => {
    if (!editingName.trim()) return;
    persist(
      subjects.map((s) =>
        s.id === id ? { ...s, name: editingName.trim() } : s,
      ),
    );
    setEditingSubjectId(null);
    toast.success("Subject renamed");
  };

  const totalTopics = subjects.reduce((a, s) => a + s.topics.length, 0);
  const doneTopics = subjects.reduce(
    (a, s) => a + s.topics.filter((t) => t.done).length,
    0,
  );
  const overallPct =
    totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

  return (
    <div>
      <Navbar
        title="Subject & Topic Manager"
        subtitle="Organize your study curriculum"
      />
      <div className="p-4 sm:p-8 animate-fade-in max-w-4xl mx-auto">
        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Subjects",
              value: subjects.length,
              icon: BookOpen,
              color: "text-primary-600",
              bg: "bg-primary-50",
            },
            {
              label: "Topics",
              value: totalTopics,
              icon: Tag,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "Completed",
              value: doneTopics,
              icon: Check,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Progress",
              value: `${overallPct}%`,
              icon: Layers,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((stat, i) => (
            <div key={i} className="card flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className={`text-xl font-black font-mono ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted font-semibold">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Add Subject Button ── */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading text-text-primary">
            Your Subjects
          </h2>
          <button
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
          >
            <Plus size={16} /> Add Subject
          </button>
        </div>

        {/* ── Add Subject Form ── */}
        {showAddSubject && (
          <div className="card mb-6 border-2 border-primary-200 bg-primary-50/30 animate-fade-in">
            <h3 className="font-bold text-text-primary mb-4">New Subject</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subject name (e.g. Computer Networks)"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
                className="input-field"
                autoFocus
              />
              <div>
                <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
                  Color
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SUBJECT_COLORS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setNewSubjectColor(i)}
                      className={`w-7 h-7 rounded-full ${c.dot} transition-all ${newSubjectColor === i ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-60 hover:opacity-100"}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">
                  Difficulty
                </p>
                <div className="flex gap-2">
                  {DIFFICULTY.map((d) => (
                    <button
                      key={d}
                      onClick={() => setNewSubjectDiff(d)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${newSubjectDiff === d ? "bg-primary-600 text-white shadow-sm" : "bg-white border border-border text-text-muted hover:border-primary-300"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addSubject}
                  className="btn-primary py-2.5 px-5 flex items-center gap-2"
                >
                  <Plus size={15} /> Add Subject
                </button>
                <button
                  onClick={() => {
                    setShowAddSubject(false);
                    setNewSubjectName("");
                  }}
                  className="btn-secondary py-2.5 px-5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {subjects.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              No subjects yet
            </h3>
            <p className="text-text-muted mb-6">
              Add your first subject to start organizing your study plan
            </p>
            <button
              onClick={() => setShowAddSubject(true)}
              className="btn-primary mx-auto flex items-center gap-2"
            >
              <Plus size={16} /> Add Your First Subject
            </button>
          </div>
        )}

        {/* ── Subject Cards ── */}
        <div className="space-y-4">
          {subjects.map((subject) => {
            const color =
              SUBJECT_COLORS[subject.colorIdx % SUBJECT_COLORS.length];
            const isExpanded = expandedId === subject.id;
            const doneCount = subject.topics.filter((t) => t.done).length;
            const isEditing = editingSubjectId === subject.id;

            return (
              <div
                key={subject.id}
                className={`card border-2 ${color.border} transition-all`}
              >
                {/* Subject Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-3 h-3 rounded-full ${color.dot} shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          className="input-field py-1 text-sm flex-1"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveSubjectName(subject.id);
                            if (e.key === "Escape") setEditingSubjectId(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => saveSubjectName(subject.id)}
                          className="p-1.5 bg-green-100 text-green-700 rounded-lg"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditingSubjectId(null)}
                          className="p-1.5 bg-gray-100 text-gray-500 rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-text-primary truncate">
                          {subject.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
                        >
                          {subject.difficulty}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingSubjectId(subject.id);
                        setEditingName(subject.name);
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit3 size={14} className="text-text-muted" />
                    </button>
                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : subject.id)
                      }
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-text-muted" />
                      ) : (
                        <ChevronDown size={16} className="text-text-muted" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color.dot} rounded-full transition-all duration-500`}
                      style={{ width: `${subject.progress}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${color.text} shrink-0`}>
                    {doneCount}/{subject.topics.length} topics ·{" "}
                    {subject.progress}%
                  </span>
                </div>

                {/* Topics (expanded) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2 mb-4">
                      {subject.topics.length === 0 && (
                        <p className="text-sm text-text-muted text-center py-4">
                          No topics yet — add your first one below
                        </p>
                      )}
                      {subject.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${topic.done ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"}`}
                        >
                          <button
                            onClick={() => toggleTopic(subject.id, topic.id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${topic.done ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-green-400"}`}
                          >
                            {topic.done && <Check size={11} />}
                          </button>
                          <span
                            className={`text-sm flex-1 ${topic.done ? "line-through text-text-muted" : "text-text-primary font-medium"}`}
                          >
                            {topic.name}
                          </span>
                          <button
                            onClick={() => deleteTopic(subject.id, topic.id)}
                            className="p-1 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={13} className="text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Topic */}
                    {addingTopicTo === subject.id ? (
                      <div className="flex gap-2">
                        <input
                          className="input-field py-2 text-sm flex-1"
                          placeholder="Topic name (e.g. Binary Trees)"
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addTopic(subject.id);
                            if (e.key === "Escape") setAddingTopicTo(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => addTopic(subject.id)}
                          className="btn-primary py-2 px-4 text-sm"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setAddingTopicTo(null);
                            setNewTopicName("");
                          }}
                          className="btn-secondary py-2 px-3 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingTopicTo(subject.id)}
                        className={`flex items-center gap-2 text-sm font-semibold ${color.text} hover:${color.bg} px-3 py-2 rounded-xl w-full transition-colors border-2 border-dashed ${color.border}`}
                      >
                        <Plus size={14} /> Add Topic
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectManager;
