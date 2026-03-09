export const calculateCompletionRate = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const calculateReadinessScore = (
  completionRate,
  avgTestScore,
  topicCoverage,
) => {
  return Math.round(
    completionRate * 0.4 + avgTestScore * 0.4 + topicCoverage * 0.2,
  );
};

export const getScoreColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
};

export const getScoreBgColor = (score) => {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-amber-100";
  return "bg-red-100";
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return { text: "text-green-700", bg: "bg-green-100" };
    case "hard":
      return { text: "text-red-700", bg: "bg-red-100" };
    default:
      return { text: "text-amber-700", bg: "bg-amber-100" };
  }
};

export const formatDuration = (hours) => {
  if (!hours) return "0m";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const formatMinutes = (minutes) => {
  if (!minutes) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};
