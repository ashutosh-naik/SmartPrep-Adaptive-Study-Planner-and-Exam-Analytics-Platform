import {
  format,
  formatDistanceToNow,
  differenceInDays,
  addDays,
  startOfWeek,
  endOfWeek,
  isToday,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM dd, yyyy");
};

export const formatShortDate = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM dd");
};

export const formatDayName = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEE");
};

export const formatDayNumber = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd");
};

export const getDaysUntil = (date) => {
  if (!date) return 0;
  const d = typeof date === "string" ? parseISO(date) : date;
  return Math.max(differenceInDays(d, new Date()), 0);
};

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
};

export const getWeekDates = (date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const isDateToday = (date) => {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return isToday(d);
};

export const isPastDate = (date) => {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return isBefore(d, new Date()) && !isToday(d);
};

export { addDays, startOfWeek, endOfWeek, parseISO, differenceInDays };
