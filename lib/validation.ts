import { PRIORITIES, type Priority } from './types';

export function isValidTaskText(text: unknown): text is string {
  return typeof text === 'string' && text.trim().length > 0;
}

export function isValidPriority(priority: unknown): priority is Priority {
  return typeof priority === 'string' && PRIORITIES.includes(priority as Priority);
}
