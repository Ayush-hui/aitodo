import { createTask } from './model';
import type { Priority, Task } from './types';

export function addTask(
  tasks: Task[],
  { id, text, priority }: { id: string; text: string; priority: Priority }
): Task[] {
  return [createTask({ id, text, priority }), ...tasks];
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

export function updateTask(
  tasks: Task[],
  id: string,
  text: string,
  priority: Priority
): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, text, priority } : task));
}

export function clearCompleted(tasks: Task[]): Task[] {
  return tasks.filter((task) => !task.completed);
}
