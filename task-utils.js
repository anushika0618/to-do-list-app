export const STORAGE_KEY = "taskflow_tasks";

export function normalizeTasks(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((task) =>
    task && typeof task === "object" &&
    (typeof task.id === "string" || typeof task.id === "number") &&
    typeof task.text === "string" && task.text.trim().length > 0
  ).map((task) => ({
    id: task.id,
    text: task.text.trim().slice(0, 120),
    done: task.done === true,
    priority: ["high", "normal", "low"].includes(task.priority) ? task.priority : "normal",
    dueDate: typeof task.dueDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ? task.dueDate : ""
  }));
}

export function parseStoredTasks(raw) {
  if (!raw) return [];
  try {
    return normalizeTasks(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function readTasks(storage, key = STORAGE_KEY) {
  try {
    return parseStoredTasks(storage.getItem(key));
  } catch {
    return [];
  }
}

export function writeTasks(storage, tasks, key = STORAGE_KEY) {
  try {
    storage.setItem(key, JSON.stringify(normalizeTasks(tasks)));
    return true;
  } catch {
    return false;
  }
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  return { total, done, active: total - done, percent: total ? Math.round(done / total * 100) : 0 };
}

export function filterTasks(tasks, filter) {
  if (filter === "active") return tasks.filter((task) => !task.done);
  if (filter === "done") return tasks.filter((task) => task.done);
  return tasks;
}

export function isOverdue(dueDate, done = false, today = new Date().toISOString().slice(0, 10)) {
  return Boolean(dueDate && !done && dueDate < today);
}

export function createTask({ id, text, priority = "normal", dueDate = "" }) {
  const cleanText = String(text ?? "").trim();
  if (!cleanText) throw new Error("Task description is required.");
  if (cleanText.length > 120) throw new Error("Task description must be 120 characters or fewer.");
  if (!["high", "normal", "low"].includes(priority)) throw new Error("Invalid priority.");
  if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) throw new Error("Invalid due date.");
  return { id, text: cleanText, done: false, priority, dueDate };
}
