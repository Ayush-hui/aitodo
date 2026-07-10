import { getItem, setItem } from '../../shared/storage.js';

const STORAGE_KEY = 'todo_tasks';

/**
 * Load tasks from localStorage.
 * @returns {Array} array of task objects
 */
export function loadTasks() {
  const raw = getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Persist tasks array to localStorage.
 * @param {Array} tasks
 */
export function saveTasks(tasks) {
  setItem(STORAGE_KEY, JSON.stringify(tasks));
}
