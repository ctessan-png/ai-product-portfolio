export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
