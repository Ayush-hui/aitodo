export const PRIORITIES = ['high', 'medium', 'low'] as const;

export type Priority = (typeof PRIORITIES)[number];
export type Filter = 'all' | 'active' | 'completed';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
};

export type TodoState = {
  tasks: Task[];
  currentFilter: Filter;
  editingId: string | null;
  selectedPriority: Priority;
};
