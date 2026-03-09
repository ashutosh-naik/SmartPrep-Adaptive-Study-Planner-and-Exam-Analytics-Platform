import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Brain,
  Lightbulb,
  Eye,
  EyeOff,
  Check,
  X,
  Edit3,
  Save,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import toast from "react-hot-toast";

const LS_KEY = "sp_notes";

const SUBJECT_COLORS = [
  {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    accent: "bg-blue-500",
  },
  {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-300",
    accent: "bg-violet-500",
  },
  {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    accent: "bg-green-500",
  },
  {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
    accent: "bg-amber-500",
  },
  {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-300",
    accent: "bg-rose-500",
  },
  {
    bg: "bg-teal-100",
    text: "text-teal-700",
    border: "border-teal-300",
    accent: "bg-teal-500",
  },
];

const defaultNotes = [
  {
    id: 1,
    subject: "Data Structures",
    colorIdx: 0,
    notes: [
      {
        id: 1,
        title: "Binary Search Tree",
        content:
          "A BST is a binary tree where every node in the left subtree has a value less than the root, and every node in the right subtree has a value greater than the root.\n\n**Operations:** Insert O(log n), Search O(log n), Delete O(log n)\n**Worst case (unbalanced):** O(n)",
        flashcard: true,
        question: "What is the time complexity of BST operations?",
        answer: "O(log n) average, O(n) worst-case for unbalanced trees",
      },
      {
        id: 2,
        title: "Heap Data Structure",
        content:
          "A heap is a complete binary tree that satisfies the heap property.\n\n**Max-Heap:** Parent ≥ Child\n**Min-Heap:** Parent ≤ Child\n\n**Applications:** Priority queues, Heap Sort, Dijkstra's algorithm",
        flashcard: true,
        question: "What property does a Max-Heap maintain?",
        answer: "Every parent node is greater than or equal to its children",
      },
    ],
  },
  {
    id: 2,
    subject: "Computer Networks",
    colorIdx: 1,
    notes: [
      {
        id: 1,
        title: "OSI Model Layers",
        content:
          "**7 Layers (top to bottom):**\n1. Application (HTTP, FTP, DNS)\n2. Presentation (SSL, TLS)\n3. Session (NetBIOS)\n4. Transport (TCP, UDP)\n5. Network (IP, ICMP)\n6. Data Link (Ethernet, MAC)\n7. Physical (cables, signals)",
        flashcard: true,
        question: "Name all 7 OSI layers in order (top to bottom)",
        answer:
          "Application, Presentation, Session, Transport, Network, Data Link, Physical",
      },
    ],
  },
];

const FlashcardModal = ({ notes, onClose }) => {
  const cards = notes.filter((n) => n.flashcard && n.question);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ known: 0, unknown: 0 });
  const [done, setDone] = useState(false);

  if (!cards.length)
    return (
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl p-8 text-center max-w-sm w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold mb-2">No flashcards yet</h3>
          <p className="text-gray-500 mb-4">
            Enable flashcard mode on any note to study it
          </p>
          <button onClick={onClose} className="btn-primary w-full">
            Got it
          </button>
        </div>
      </div>
    );

  const current = cards[idx];

  const handleAnswer = (knew) => {
    setScore((s) => ({
      ...s,
      [knew ? "known" : "unknown"]: s[knew ? "known" : "unknown"] + 1,
    }));
    if (idx + 1 >= cards.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setFlipped(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary-600 to-violet-600 p-5 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-white font-black text-lg">Flashcard Review</h2>
            <p className="text-white/70 text-sm">
              {idx + 1} / {cards.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-green-400/20 text-green-200 px-3 py-1 rounded-full text-sm font-bold">
              ✓ {score.known}
            </span>
            <span className="bg-red-400/20 text-red-200 px-3 py-1 rounded-full text-sm font-bold">
              ✗ {score.unknown}
            </span>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">
              {score.known >= cards.length * 0.8 ? "🎉" : "📚"}
            </div>
            <h3 className="text-2xl font-black mb-2">Session Complete!</h3>
            <p className="text-gray-500 mb-6">
              {score.known}/{cards.length} cards correct (
              {Math.round((score.known / cards.length) * 100)}%)
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIdx(0);
                  setFlipped(false);
                  setScore({ known: 0, unknown: 0 });
                  setDone(false);
                }}
                className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Retry
              </button>
              <button onClick={onClose} className="flex-1 btn-primary py-3">
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Progress bar */}
            <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${(idx / cards.length) * 100}%` }}
              />
            </div>

            {/* Card flip area */}
            <div
              className="cursor-pointer bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-border min-h-[160px] flex flex-col items-center justify-center p-6 text-center mb-4 hover:border-primary-300 transition-all"
              onClick={() => setFlipped((f) => !f)}
            >
              <span
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${flipped ? "text-green-600" : "text-primary-600"}`}
              >
                {flipped ? "ANSWER" : "QUESTION — tap to reveal"}
              </span>
              <p className="text-gray-900 font-semibold text-lg leading-relaxed">
                {flipped ? current.answer : current.question}
              </p>
              {!flipped && <Eye size={18} className="text-gray-400 mt-3" />}
            </div>

            <p className="text-xs text-gray-400 text-center mb-5">
              Tap the card to reveal the answer
            </p>

            {flipped && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} /> Still Learning
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-3 rounded-xl bg-green-50 border-2 border-green-200 text-green-600 font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Got It!
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Notes = () => {
  const [subjects, setSubjects] = useState(() => {
    try {
      const s = localStorage.getItem(LS_KEY);
      return s ? JSON.parse(s) : defaultNotes;
    } catch {
      return defaultNotes;
    }
  });
  const [expanded, setExpanded] = useState(null);
  const [flashcardSubject, setFlashcardSubject] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState(0);
  const [addingNoteTo, setAddingNoteTo] = useState(null);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    flashcard: false,
    question: "",
    answer: "",
  });
  const [editingNote, setEditingNote] = useState(null); // { subjectId, noteId }
  const [editNote, setEditNote] = useState({});

  const persist = (data) => {
    setSubjects(data);
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  };

  const addSubject = () => {
    if (!newSubjectName.trim()) {
      toast.error("Enter a subject name");
      return;
    }
    persist([
      ...subjects,
      {
        id: Date.now(),
        subject: newSubjectName.trim(),
        colorIdx: newSubjectColor,
        notes: [],
      },
    ]);
    setNewSubjectName("");
    setShowAddSubject(false);
    toast.success("Subject added!");
  };

  const addNote = (subjectId) => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    persist(
      subjects.map((s) =>
        s.id === subjectId
          ? { ...s, notes: [...s.notes, { ...newNote, id: Date.now() }] }
          : s,
      ),
    );
    setNewNote({
      title: "",
      content: "",
      flashcard: false,
      question: "",
      answer: "",
    });
    setAddingNoteTo(null);
    toast.success("Note added!");
  };

  const deleteNote = (subjectId, noteId) => {
    persist(
      subjects.map((s) =>
        s.id === subjectId
          ? { ...s, notes: s.notes.filter((n) => n.id !== noteId) }
          : s,
      ),
    );
  };

  const saveEdit = (subjectId, noteId) => {
    persist(
      subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              notes: s.notes.map((n) =>
                n.id === noteId ? { ...n, ...editNote } : n,
              ),
            }
          : s,
      ),
    );
    setEditingNote(null);
    toast.success("Note updated!");
  };

  const totalNotes = subjects.reduce((a, s) => a + s.notes.length, 0);
  const totalFlashcards = subjects.reduce(
    (a, s) => a + s.notes.filter((n) => n.flashcard).length,
    0,
  );

  return (
    <div>
      {flashcardSubject && (
        <FlashcardModal
          notes={
            flashcardSubject === "all"
              ? subjects.flatMap((s) => s.notes)
              : subjects.find((s) => s.id === flashcardSubject)?.notes || []
          }
          onClose={() => setFlashcardSubject(null)}
        />
      )}

      <Navbar
        title="Study Notes & Flashcards"
        subtitle="Write notes, create flashcards, review with spaced repetition"
      />
      <div className="p-4 sm:p-8 animate-fade-in max-w-4xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Subjects",
              value: subjects.length,
              emoji: "📚",
              color: "text-primary-600 bg-primary-50",
            },
            {
              label: "Notes",
              value: totalNotes,
              emoji: "📝",
              color: "text-violet-600 bg-violet-50",
            },
            {
              label: "Flashcards",
              value: totalFlashcards,
              emoji: "🧠",
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Review All",
              value: "→",
              emoji: "🎯",
              color: "text-green-600 bg-green-50",
              onClick: () => setFlashcardSubject("all"),
            },
          ].map((s, i) => (
            <div
              key={i}
              onClick={s.onClick}
              className={`card flex items-center gap-3 ${s.onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all" : ""}`}
            >
              <div className={`p-2.5 rounded-xl text-lg ${s.color}`}>
                {s.emoji}
              </div>
              <div>
                <p className="text-xl font-black font-mono text-text-primary">
                  {s.value}
                </p>
                <p className="text-xs text-text-muted font-semibold">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Header actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading text-text-primary">
            Your Notes
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFlashcardSubject("all")}
              className="btn-secondary text-sm py-2.5 px-4 flex items-center gap-2"
            >
              <Brain size={16} /> Review All Cards
            </button>
            <button
              onClick={() => setShowAddSubject(!showAddSubject)}
              className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2"
            >
              <Plus size={16} /> Add Subject
            </button>
          </div>
        </div>

        {/* Add Subject Form */}
        {showAddSubject && (
          <div className="card mb-6 border-2 border-primary-200 bg-primary-50/30 animate-fade-in">
            <h3 className="font-bold mb-4">New Subject</h3>
            <input
              className="input-field mb-3"
              placeholder="Subject name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubject()}
              autoFocus
            />
            <div className="flex gap-2 mb-4">
              {SUBJECT_COLORS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setNewSubjectColor(i)}
                  className={`w-7 h-7 rounded-full ${c.accent} transition-all ${newSubjectColor === i ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "opacity-60 hover:opacity-100"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addSubject}
                className="btn-primary py-2 px-4 text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddSubject(false)}
                className="btn-secondary py-2 px-4 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Subject sections */}
        <div className="space-y-4">
          {subjects.map((subject) => {
            const color =
              SUBJECT_COLORS[subject.colorIdx % SUBJECT_COLORS.length];
            const isOpen = expanded === subject.id;
            const flashCount = subject.notes.filter((n) => n.flashcard).length;

            return (
              <div key={subject.id} className={`card border-2 ${color.border}`}>
                {/* Subject header */}
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : subject.id)}
                >
                  <div className={`w-3 h-3 rounded-full ${color.accent}`} />
                  <div className="flex-1">
                    <h3 className="font-bold text-text-primary">
                      {subject.subject}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {subject.notes.length} notes · {flashCount} flashcards
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlashcardSubject(subject.id);
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg ${color.bg} ${color.text} flex items-center gap-1 hover:opacity-80 transition-opacity`}
                  >
                    <Brain size={13} /> Review
                  </button>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={18} className="text-text-muted" />
                  )}
                </div>

                {/* Notes list */}
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-3 mb-4">
                      {subject.notes.length === 0 && (
                        <p className="text-sm text-text-muted text-center py-4">
                          No notes yet — add your first below
                        </p>
                      )}
                      {subject.notes.map((note) => {
                        const isEditing =
                          editingNote?.subjectId === subject.id &&
                          editingNote?.noteId === note.id;
                        return (
                          <div
                            key={note.id}
                            className={`p-4 rounded-xl border ${color.border} bg-white`}
                          >
                            {isEditing ? (
                              <div className="space-y-2">
                                <input
                                  className="input-field py-1.5 text-sm"
                                  value={editNote.title || ""}
                                  onChange={(e) =>
                                    setEditNote((n) => ({
                                      ...n,
                                      title: e.target.value,
                                    }))
                                  }
                                  placeholder="Title"
                                />
                                <textarea
                                  className="input-field py-1.5 text-sm h-24 resize-none"
                                  value={editNote.content || ""}
                                  onChange={(e) =>
                                    setEditNote((n) => ({
                                      ...n,
                                      content: e.target.value,
                                    }))
                                  }
                                  placeholder="Content (supports **bold**, bullet points...)"
                                />
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editNote.flashcard || false}
                                    onChange={(e) =>
                                      setEditNote((n) => ({
                                        ...n,
                                        flashcard: e.target.checked,
                                      }))
                                    }
                                    className="rounded"
                                  />
                                  <span className="font-medium">
                                    Flashcard mode
                                  </span>
                                </label>
                                {editNote.flashcard && (
                                  <>
                                    <input
                                      className="input-field py-1.5 text-sm"
                                      value={editNote.question || ""}
                                      onChange={(e) =>
                                        setEditNote((n) => ({
                                          ...n,
                                          question: e.target.value,
                                        }))
                                      }
                                      placeholder="Flashcard question"
                                    />
                                    <input
                                      className="input-field py-1.5 text-sm"
                                      value={editNote.answer || ""}
                                      onChange={(e) =>
                                        setEditNote((n) => ({
                                          ...n,
                                          answer: e.target.value,
                                        }))
                                      }
                                      placeholder="Flashcard answer"
                                    />
                                  </>
                                )}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      saveEdit(subject.id, note.id)
                                    }
                                    className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1"
                                  >
                                    <Save size={13} /> Save
                                  </button>
                                  <button
                                    onClick={() => setEditingNote(null)}
                                    className="btn-secondary py-1.5 px-3 text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <Lightbulb
                                      size={15}
                                      className={color.text}
                                    />
                                    <h4 className="font-bold text-text-primary text-sm">
                                      {note.title}
                                    </h4>
                                    {note.flashcard && (
                                      <span
                                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}
                                      >
                                        🧠 Card
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex gap-1 shrink-0">
                                    <button
                                      onClick={() => {
                                        setEditingNote({
                                          subjectId: subject.id,
                                          noteId: note.id,
                                        });
                                        setEditNote({ ...note });
                                      }}
                                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                                    >
                                      <Edit3
                                        size={13}
                                        className="text-text-muted"
                                      />
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteNote(subject.id, note.id)
                                      }
                                      className="p-1.5 hover:bg-red-50 rounded-lg"
                                    >
                                      <Trash2
                                        size={13}
                                        className="text-red-400"
                                      />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                                  {note.content}
                                </p>
                                {note.flashcard && note.question && (
                                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                    <p className="text-xs font-bold text-gray-400 mb-1">
                                      FLASHCARD QUESTION
                                    </p>
                                    <p className="text-sm text-gray-600 italic">
                                      "{note.question}"
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Add note */}
                    {addingNoteTo === subject.id ? (
                      <div className="space-y-2 mt-2">
                        <input
                          className="input-field py-2 text-sm"
                          placeholder="Note title"
                          value={newNote.title}
                          onChange={(e) =>
                            setNewNote((n) => ({ ...n, title: e.target.value }))
                          }
                          autoFocus
                        />
                        <textarea
                          className="input-field py-2 text-sm h-24 resize-none"
                          placeholder="Note content (supports **bold**, bullet points, etc.)"
                          value={newNote.content}
                          onChange={(e) =>
                            setNewNote((n) => ({
                              ...n,
                              content: e.target.value,
                            }))
                          }
                        />
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newNote.flashcard}
                            onChange={(e) =>
                              setNewNote((n) => ({
                                ...n,
                                flashcard: e.target.checked,
                              }))
                            }
                            className="rounded"
                          />
                          <span className="font-medium">
                            Make this a flashcard
                          </span>
                        </label>
                        {newNote.flashcard && (
                          <>
                            <input
                              className="input-field py-2 text-sm"
                              placeholder="Flashcard question"
                              value={newNote.question}
                              onChange={(e) =>
                                setNewNote((n) => ({
                                  ...n,
                                  question: e.target.value,
                                }))
                              }
                            />
                            <input
                              className="input-field py-2 text-sm"
                              placeholder="Flashcard answer"
                              value={newNote.answer}
                              onChange={(e) =>
                                setNewNote((n) => ({
                                  ...n,
                                  answer: e.target.value,
                                }))
                              }
                            />
                          </>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => addNote(subject.id)}
                            className="btn-primary py-2 px-4 text-sm"
                          >
                            Add Note
                          </button>
                          <button
                            onClick={() => {
                              setAddingNoteTo(null);
                              setNewNote({
                                title: "",
                                content: "",
                                flashcard: false,
                                question: "",
                                answer: "",
                              });
                            }}
                            className="btn-secondary py-2 px-4 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingNoteTo(subject.id)}
                        className={`flex items-center gap-2 text-sm font-semibold ${color.text} w-full py-2 px-3 rounded-xl border-2 border-dashed ${color.border} hover:${color.bg} transition-colors`}
                      >
                        <Plus size={14} /> Add Note
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {subjects.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4">📓</div>
            <h3 className="text-xl font-bold mb-2">No notes yet</h3>
            <p className="text-text-muted mb-4">
              Add a subject to start taking notes and creating flashcards
            </p>
            <button
              onClick={() => setShowAddSubject(true)}
              className="btn-primary mx-auto flex items-center gap-2"
            >
              <Plus size={16} /> Add Your First Subject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
