import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Sparkles,
} from "lucide-react";

const KNOWLEDGE_BASE = [
  // Greetings
  {
    patterns: ["hello", "hi", "hey", "good morning", "good evening", "sup"],
    response:
      "Hello! 👋 I'm your SmartPrep AI assistant. Ask me anything about your subjects, study tips, or how to use the platform!",
  },
  {
    patterns: ["how are you", "how r u"],
    response:
      "I'm doing great and ready to help you ace your exams! 💪 What would you like to study today?",
  },
  // Study tips
  {
    patterns: [
      "study tip",
      "how to study",
      "study better",
      "study smart",
      "improve study",
    ],
    response:
      "📚 **Top study strategies:**\n\n1. **Spaced Repetition** — Review material at increasing intervals\n2. **Active Recall** — Test yourself instead of just re-reading\n3. **Pomodoro Technique** — 25 min focus, 5 min break (use our timer!)\n4. **The Feynman Technique** — Explain concepts in simple words\n5. **Mind Mapping** — Connect related concepts visually\n\nWould you like more detail on any of these?",
  },
  {
    patterns: ["pomodoro", "focus timer", "study timer"],
    response:
      "⏱️ **Pomodoro Technique:**\n\n• Work for **25 minutes** with full focus\n• Take a **5-minute** short break\n• After 4 cycles, take a **15-minute** long break\n\nYou can use our **built-in Pomodoro Timer** in the Study Planner! Click 'Focus Timer' to start.",
  },
  {
    patterns: ["memorize", "memory", "remember", "forget"],
    response:
      "🧠 **Memory techniques:**\n\n1. **Spaced repetition** — Use our flashcard system!\n2. **Chunking** — Group related info together\n3. **Mnemonics** — 'PEMDAS', 'ROY G BIV', etc.\n4. **Sleep** — Get 7-8 hours; memory consolidates during sleep\n5. **Teach someone** — Explaining reinforces understanding\n\nTry our **Flashcards** feature in Notes & Flashcards!",
  },
  // Data Structures
  {
    patterns: ["binary tree", "bst", "binary search"],
    response:
      "🌳 **Binary Search Tree (BST):**\n\n• Every left child < parent < right child\n• **Search:** O(log n) average, O(n) worst\n• **Insert:** O(log n) average\n• **Delete:** O(log n) average\n\n**Use cases:** Database indexing, sorted data storage\n\n**Common interview questions:** In-order traversal, lowest common ancestor, height of tree",
  },
  {
    patterns: ["linked list", "linkedlist"],
    response:
      "🔗 **Linked List:**\n\n• **Singly:** Each node points to next\n• **Doubly:** Each node points to next AND previous\n• **Circular:** Last node points back to first\n\n**Time Complexities:**\n• Access: O(n) | Search: O(n)\n• Insert at head: O(1) | Insert at tail: O(n)\n• Delete: O(n)\n\n**Key:** No random access like arrays — must traverse from head!",
  },
  {
    patterns: ["stack", "queue", "deque"],
    response:
      "📚 **Stack vs Queue:**\n\n**Stack (LIFO):**\n• Push/Pop from same end\n• Use: Undo operations, function call stack, DFS\n\n**Queue (FIFO):**\n• Enqueue at rear, Dequeue from front\n• Use: BFS, task scheduling, print queue\n\n**Deque:** Insert/remove from both ends — combines both!",
  },
  {
    patterns: ["sorting", "sort", "quick sort", "merge sort", "bubble sort"],
    response:
      "🔢 **Sorting Algorithms (Time Complexity):**\n\n| Algorithm | Best | Average | Worst | Space |\n|-----------|------|---------|-------|-------|\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) |\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |\n\n**Prefer:** Merge Sort for stability, Quick Sort for average performance",
  },
  {
    patterns: ["hash", "hashmap", "hashtable", "dictionary"],
    response:
      "🗂️ **HashMap / HashTable:**\n\n• **Average:** O(1) for get, put, delete\n• **Worst case (collisions):** O(n)\n• **Key concept:** Hash function maps key → bucket index\n\n**Collision resolution:**\n1. Chaining (LinkedList at each bucket)\n2. Open addressing (linear/quadratic probing)\n\n**Load factor:** Typically 0.75 — resize when exceeded",
  },
  // Networking
  {
    patterns: ["osi", "osi model", "seven layers", "7 layers"],
    response:
      "🌐 **OSI Model (top to bottom):**\n\n7. **Application** — HTTP, FTP, DNS, SMTP\n6. **Presentation** — SSL/TLS, encoding\n5. **Session** — NetBIOS, RPC\n4. **Transport** — TCP, UDP (port numbers)\n3. **Network** — IP, ICMP, routing\n2. **Data Link** — Ethernet, MAC address, switches\n1. **Physical** — Cables, Wi-Fi signals, bits\n\n**Mnemonic:** 'All People Seem To Need Data Processing'",
  },
  {
    patterns: ["tcp", "udp", "tcp vs udp"],
    response:
      "📡 **TCP vs UDP:**\n\n**TCP (Reliable):**\n• Connection-oriented (3-way handshake)\n• Ordered delivery, error checking\n• Use: HTTP, email, file transfer\n• Slower but reliable\n\n**UDP (Fast):**\n• Connectionless — fire and forget\n• No ordering, no guarantee\n• Use: Video streaming, DNS, gaming\n• Faster, lower overhead",
  },
  {
    patterns: ["http", "https", "http method", "get post put"],
    response:
      "🌍 **HTTP Methods:**\n\n• **GET** — Retrieve data (read-only)\n• **POST** — Create new resource\n• **PUT** — Replace existing resource\n• **PATCH** — Partially update resource\n• **DELETE** — Remove resource\n\n**Status codes:**\n• 2xx — Success | 3xx — Redirect\n• 4xx — Client error | 5xx — Server error\n\n**HTTPS** = HTTP + TLS encryption (port 443)",
  },
  // Exam tips
  {
    patterns: ["exam tip", "exam preparation", "exam ready", "prepare exam"],
    response:
      "🎯 **Exam Preparation Strategy:**\n\n**2 weeks before:**\n• Review all topics, identify weak areas\n• Practice past papers under timed conditions\n\n**1 week before:**\n• Focus only on weak areas\n• Daily mock tests on SmartPrep\n\n**Night before:**\n• Light review only — no new topics!\n• Sleep by 10 PM (7-8 hours sleep)\n\n**Day of exam:**\n• Light breakfast, no junk food\n• Quick 15-min review of formulas\n• Arrive early, stay calm 🧘",
  },
  {
    patterns: ["backlog", "pending", "overdue", "behind"],
    response:
      "📋 **Managing study backlog:**\n\n1. Go to **Study Planner → Backlog** to see overdue tasks\n2. **Prioritize** by importance + exam date proximity\n3. Break large topics into 30-min micro-sessions\n4. Use the **Pomodoro Timer** for focused bursts\n5. Warn: Don't try to cover everything — be strategic!\n\nCheck your **Analytics** page to identify which subjects need the most attention.",
  },
  // Platform help
  {
    patterns: ["how to use", "help", "guide", "tutorial", "feature"],
    response:
      "📖 **SmartPrep Features:**\n\n🏠 **Dashboard** — Overview, streak, KPIs\n📅 **Study Planner** — Weekly/monthly schedule, Pomodoro timer\n✅ **Task Tracking** — Create and track study tasks\n📚 **Subjects** — Add subjects & topics, track progress\n📝 **Mock Tests** — MCQ tests with timer and results\n📊 **Analytics** — Performance charts and AI study tips\n📓 **Notes** — Study notes + flashcard review\n⚙️ **Settings** — Profile, theme, notifications\n\nWhat feature would you like to know more about?",
  },
  // Default fallback
  {
    patterns: ["__default__"],
    response:
      "🤔 Hmm, I'm not sure about that specific topic. Try asking me about:\n\n• **Data Structures** (arrays, trees, graphs, sorting)\n• **Networks** (OSI model, TCP/UDP, HTTP)\n• **Study tips** (Pomodoro, spaced repetition, exam prep)\n• **SmartPrep features** (how to use the platform)\n\nOr just type 'help' for a full list of topics I know!",
  },
];

const generateResponse = (input) => {
  const lower = input.toLowerCase();
  for (const kb of KNOWLEDGE_BASE) {
    if (kb.patterns[0] === "__default__") continue;
    if (kb.patterns.some((p) => lower.includes(p))) return kb.response;
  }
  return KNOWLEDGE_BASE.find((k) => k.patterns[0] === "__default__").response;
};

const STARTERS = [
  "What is a Binary Search Tree?",
  "Explain TCP vs UDP",
  "Give me study tips",
  "OSI model layers",
];

const AIChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "ai",
      text: "Hi! 👋 I'm **SmartPrep AI** — ask me anything about your subjects, study strategies, or how to use the platform!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text = input) => {
    const msg = text.trim();
    if (!msg) return;
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: msg }]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          { id: Date.now() + 1, from: "ai", text: generateResponse(msg) },
        ]);
      },
      800 + Math.random() * 600,
    );
  };

  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{ __html: bold }}
          className="block leading-relaxed"
        />
      );
    });
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-600 to-violet-600 text-white rounded-full shadow-2xl shadow-primary-600/40 flex items-center justify-center hover:scale-110 transition-transform duration-200 animate-bounce-slow"
          aria-label="Open AI assistant"
        >
          <Sparkles size={24} />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-[360px] bg-white rounded-3xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden border border-gray-100 transition-all duration-300 ${minimized ? "h-16" : "h-[520px]"}`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-violet-600 p-4 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">SmartPrep AI</h3>
              <p className="text-white/60 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />{" "}
                Online
              </p>
            </div>
            <button
              onClick={() => setMinimized((m) => !m)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <Minimize2 size={17} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
            >
              <X size={17} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.from === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={13} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.from === "user" ? "bg-primary-600 text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"}`}
                    >
                      {renderText(msg.text)}
                    </div>
                    {msg.from === "user" && (
                      <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={13} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shrink-0">
                      <Bot size={13} className="text-white" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Starter chips */}
              {messages.length === 1 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs bg-primary-50 text-primary-700 border border-primary-200 px-3 py-1.5 rounded-full hover:bg-primary-100 transition-colors font-medium"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
                <input
                  className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;
