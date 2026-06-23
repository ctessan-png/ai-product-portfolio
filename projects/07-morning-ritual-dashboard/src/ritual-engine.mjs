export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getWeekKey(date = new Date()) {
  const weekDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = weekDate.getUTCDay() || 7;
  weekDate.setUTCDate(weekDate.getUTCDate() + 4 - dayNumber);

  const weekYear = weekDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(weekYear, 0, 1));
  const weekNumber = Math.ceil(((weekDate - yearStart) / 86400000 + 1) / 7);

  return `${weekYear}-W${String(weekNumber).padStart(2, "0")}`;
}

export function pickByIndex(items, index) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cannot pick from an empty list");
  }

  const safeIndex = Math.abs(index) % items.length;
  return items[safeIndex];
}

export function toggleCompletion(completed, id) {
  return {
    ...completed,
    [id]: !completed[id]
  };
}

export function getCompletionCount(completed) {
  return Object.values(completed).filter(Boolean).length;
}

export function buildStampSlots(items, completed) {
  return items.map((item) => ({
    id: item.id,
    stamped: Boolean(completed[item.id])
  }));
}
