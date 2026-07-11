import { getItem, setItem } from './storage';
import type { Task } from './types';

const STORAGE_KEY = 'todo_tasks';

export function loadTasks(): Task[] {
  const raw = getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Task[];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  setItem(STORAGE_KEY, JSON.stringify(tasks));
}
