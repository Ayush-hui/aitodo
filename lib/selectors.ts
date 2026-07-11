import { PRIORITY_ORDER } from './model';
import type { Filter, Task } from './types';

export function getFilteredTasks(tasks: Task[], currentFilter: Filter): Task[] {
  let filtered = [...tasks];
  if (currentFilter === 'active') {
    filtered = filtered.filter((task) => !task.completed);
  } else if (currentFilter === 'completed') {
    filtered = filtered.filter((task) => task.completed);
  }

  return [...filtered].sort(
    (first, second) => PRIORITY_ORDER[first.priority] - PRIORITY_ORDER[second.priority]
  );
}

export function activeCount(tasks: Task[]): number {
  return tasks.filter((task) => !task.completed).length;
}

export function completedCount(tasks: Task[]): number {
  return tasks.filter((task) => task.completed).length;
}
