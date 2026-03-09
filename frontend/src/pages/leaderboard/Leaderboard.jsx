import { useState } from "react";
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Crown,
  Flame,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";

const MOCK_STUDENTS = [
  {
    rank: 1,
    name: "Priya Sharma",
    avatar: "P",
    college: "IIT Delhi",
    score: 94,
    streak: 42,
    badge: "🏆",
    trend: "up",
    change: 2,
  },
  {
    rank: 2,
    name: "Rahul Verma",
    avatar: "R",
    college: "NIT Trichy",
    score: 91,
    streak: 38,
    badge: "🥈",
    trend: "up",
    change: 1,
  },
  {
    rank: 3,
    name: "Anjali Gupta",
    avatar: "A",
    college: "BITS Pilani",
    score: 89,
    streak: 35,
    badge: "🥉",
    trend: "down",
    change: 1,
  },
  {
    rank: 4,
    name: "Karthik Nair",
    avatar: "K",
    college: "VIT Vellore",
    score: 87,
    streak: 30,
    badge: "⭐",
    trend: "up",
    change: 3,
  },
  {
    rank: 5,
    name: "Sneha Patel",
    avatar: "S",
    college: "NSIT Delhi",
    score: 85,
    streak: 28,
    badge: "⭐",
    trend: "same",
    change: 0,
  },
  {
    rank: 6,
    name: "Arjun Singh",
    avatar: "A",
    college: "DTU Delhi",
    score: 83,
    streak: 25,
    badge: "⭐",
    trend: "up",
    change: 2,
  },
  {
    rank: 7,
    name: "Meera Krishnan",
    avatar: "M",
    college: "IIIT Hyderabad",
    score: 81,
    streak: 22,
    badge: "⭐",
    trend: "down",
    change: 2,
  },
  {
    rank: 8,
    name: "Dev Rathi",
    avatar: "D",
    college: "COEP Pune",
    score: 79,
    streak: 20,
    badge: "⭐",
    trend: "up",
    change: 1,
  },
  {
    rank: 9,
    name: "Ishaan Mehta",
    avatar: "I",
    college: "SRM Chennai",
    score: 77,
    streak: 18,
    badge: "⭐",
    trend: "same",
    change: 0,
  },
];

const YOU = {
  rank: 10,
  name: "Ashu Naik",
  avatar: "A",
  college: "Your College",
  score: 75,
  streak: 21,
  badge: "🌟",
  trend: "up",
  change: 4,
  isYou: true,
};

const COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-gray-100 text-gray-600",
  "bg-orange-100 text-orange-700",
];
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-green-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-sky-500",
  "bg-primary-600",
];

const Leaderboard = () => {
  const { user } = useSelector((s) => s.auth);
  const [period, setPeriod] = useState("weekly");
  const all = [...MOCK_STUDENTS, { ...YOU, name: user?.name || "Ashu Naik" }];

  const topThree = all.slice(0, 3);
  const rest = all.slice(3);

  return (
    <div>
      <Navbar
        title="Leaderboard"
        subtitle="See how you rank among your peers this week"
      />
      <div className="p-4 sm:p-8 animate-fade-in max-w-3xl mx-auto">
        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-surface-muted p-1 rounded-2xl flex gap-1">
            {["weekly", "alltime"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${period === p ? "bg-white text-primary-700 shadow-sm" : "text-text-muted hover:text-text-primary"}`}
              >
                {p === "weekly" ? "This Week" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {[topThree[1], topThree[0], topThree[2]].map((s, i) => {
            const heights = ["h-24", "h-32", "h-20"];
            const podiumRank = [2, 1, 3];
            const glows = [
              "shadow-gray-300",
              "shadow-amber-300/60",
              "shadow-orange-300/50",
            ];
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-3xl">{s.badge}</div>
                <div
                  className={`w-14 h-14 rounded-2xl ${AVATAR_COLORS[s.rank - 1]} flex items-center justify-center text-white font-black text-xl shadow-xl ${glows[i]}`}
                >
                  {s.avatar}
                </div>
                <p className="text-sm font-bold text-text-primary text-center max-w-[80px] leading-tight">
                  {s.name.split(" ")[0]}
                </p>
                <p className="text-xs text-text-muted font-semibold">
                  {s.score}%
                </p>
                <div
                  className={`flex items-center justify-center ${heights[i]} w-20 rounded-t-2xl ${i === 1 ? "bg-gradient-to-t from-amber-400 to-yellow-300" : i === 0 ? "bg-gradient-to-t from-gray-300 to-gray-200" : "bg-gradient-to-t from-orange-400 to-amber-300"} font-black text-white text-xl shadow-lg`}
                >
                  #{podiumRank[i]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Your rank card */}
        <div className="card mb-4 border-2 border-primary-300 bg-gradient-to-r from-primary-50 to-blue-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-black text-sm flex items-center justify-center">
                #{YOU.rank}
              </div>
              <div
                className={`w-10 h-10 rounded-xl ${AVATAR_COLORS[9]} flex items-center justify-center text-white font-black text-base`}
              >
                A
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-primary">
                  {user?.name || "Ashu Naik"}{" "}
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full ml-1 font-bold">
                    YOU
                  </span>
                </p>
                <p className="text-xs text-text-muted">
                  {user?.college || "CS Student"} · 🔥 {YOU.streak} day streak
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-black font-mono text-primary-700">
                {YOU.score}%
              </p>
              <p className="text-xs text-green-600 font-bold flex items-center gap-0.5 justify-end">
                <ArrowUp size={11} />
                +4 this week
              </p>
            </div>
          </div>
        </div>

        {/* Rest of leaderboard */}
        <div className="space-y-2">
          {rest.map((s, i) => {
            const rank = i + 4;
            const isYou = s.isYou;
            return (
              <div
                key={i}
                className={`card flex items-center gap-4 ${isYou ? "border-2 border-primary-300 bg-primary-50/30" : ""} hover:shadow-md transition-all`}
              >
                <div
                  className={`w-8 h-8 rounded-full font-black text-sm flex items-center justify-center shrink-0 ${rank <= 3 ? COLORS[rank - 1] : "bg-gray-50 text-gray-500"}`}
                >
                  #{rank}
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${AVATAR_COLORS[(rank - 1) % AVATAR_COLORS.length]} flex items-center justify-center text-white font-black text-base shrink-0`}
                >
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-text-primary truncate">
                    {s.name}{" "}
                    {isYou && (
                      <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full ml-1">
                        YOU
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-text-muted">
                    🔥 {s.streak} day streak
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black font-mono text-text-primary">
                    {s.score}%
                  </p>
                  <p
                    className={`text-xs font-bold flex items-center gap-0.5 justify-end ${s.trend === "up" ? "text-green-600" : s.trend === "down" ? "text-red-500" : "text-gray-400"}`}
                  >
                    {s.trend === "up" ? (
                      <ArrowUp size={11} />
                    ) : s.trend === "down" ? (
                      <ArrowDown size={11} />
                    ) : (
                      <Minus size={11} />
                    )}
                    {s.trend === "same" ? "same" : `${s.change} ${s.trend}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational footer */}
        <div className="card mt-6 bg-gradient-to-r from-primary-600 to-violet-600 text-white text-center">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-black text-lg mb-1">
            You're #{YOU.rank} this week!
          </h3>
          <p className="text-white/80 text-sm">
            Study 2 more hours today to reach #{YOU.rank - 1}. You're only{" "}
            {all[YOU.rank - 2]?.score - YOU.score}% behind!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
