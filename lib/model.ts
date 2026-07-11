import type { Priority, Task } from './types';

export const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

type CreateTaskParams = {
  id: string;
  text: string;
  completed?: boolean;
  priority?: Priority;
};

export function createTask({
  id,
  text,
  completed = false,
  priority = 'medium',
}: CreateTaskParams): Task {
  return { id, text, completed, priority };
}
