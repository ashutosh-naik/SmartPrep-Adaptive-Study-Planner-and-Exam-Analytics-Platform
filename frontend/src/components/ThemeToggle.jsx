import { useState, useRef, useEffect } from "react";
import { Sun, Moon, ChevronDown, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const THEMES = [
  { id: "light", label: "Light", icon: Sun, desc: "Bright and clean" },
  { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
];

const ThemeToggle = ({ compact = false }) => {
  const { themeMode, setThemeMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = THEMES.find((t) => t.id === themeMode) || THEMES[0];
  const Icon = current.icon;

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`
                    flex items-center gap-2 rounded-xl border transition-all duration-200
                    ${
                      compact
                        ? "p-2.5 border-transparent hover:bg-white/10 text-gray-400 hover:text-white"
                        : "px-3 py-2 text-sm font-medium border-border bg-surface hover:border-primary-400 text-text-primary hover:text-primary-600"
                    }
                `}
        title={`Theme: ${current.label}`}
        aria-label="Switch theme"
      >
        <Icon size={18} className={compact ? "" : "shrink-0"} />
        {!compact && (
          <>
            <span className="hidden sm:inline">{current.label}</span>
            <ChevronDown
              size={14}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-2 right-0 w-48 rounded-2xl border border-border shadow-2xl bg-surface backdrop-blur-lg overflow-hidden"
          style={{ animation: "fadeInScale 0.15s ease" }}
        >
          {/* Header */}
          <div className="px-4 pt-3 pb-2 border-b border-border">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Appearance
            </p>
          </div>

          {/* Options */}
          <div className="p-2">
            {THEMES.map(({ id, label, icon: TIcon, desc }) => (
              <button
                key={id}
                onClick={() => {
                  setThemeMode(id);
                  setOpen(false);
                }}
                className={`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
                                    ${
                                      themeMode === id
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-text-primary hover:bg-surface-muted"
                                    }
                                `}
              >
                <div
                  className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                    ${themeMode === id ? "bg-primary-600 text-white" : "bg-surface-muted text-text-muted"}
                                `}
                >
                  <TIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                </div>
                {themeMode === id && (
                  <Check size={16} className="text-primary-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(-4px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0);     }
                }
            `}</style>
    </div>
  );
};

export default ThemeToggle;
