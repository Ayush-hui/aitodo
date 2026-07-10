import { describe, it, expect } from 'vitest';
import { getFilteredTasks, activeCount, completedCount } from '../../../features/tasks/selectors.js';

describe('getFilteredTasks', () => {
  const tasks = [
    { id: '1', text: 'A', completed: false, priority: 'low' },
    { id: '2', text: 'B', completed: true, priority: 'high' },
    { id: '3', text: 'C', completed: false, priority: 'medium' },
    { id: '4', text: 'D', completed: true, priority: 'medium' },
  ];

  it('returns all tasks sorted by priority when filter is all', () => {
    const result = getFilteredTasks(tasks, 'all');
    expect(result.map((t) => t.id)).toEqual(['2', '3', '4', '1']);
  });

  it('returns only active tasks when filter is active', () => {
    const result = getFilteredTasks(tasks, 'active');
    expect(result.map((t) => t.id)).toEqual(['3', '1']);
    expect(result.every((t) => !t.completed)).toBe(true);
  });

  it('returns only completed tasks when filter is completed', () => {
    const result = getFilteredTasks(tasks, 'completed');
    expect(result.map((t) => t.id)).toEqual(['2', '4']);
    expect(result.every((t) => t.completed)).toBe(true);
  });

  it('does not mutate the source array', () => {
    const original = [...tasks];
    getFilteredTasks(tasks, 'all');
    expect(tasks).toEqual(original);
    expect(tasks[0]).toBe(original[0]); // same object references preserved
  });

  it('sorts by priority high > medium > low', () => {
    const mixed = [
      { id: '1', text: 'Low', completed: false, priority: 'low' },
      { id: '2', text: 'High', completed: false, priority: 'high' },
      { id: '3', text: 'Medium', completed: false, priority: 'medium' },
    ];
    const result = getFilteredTasks(mixed, 'all');
    expect(result.map((t) => t.priority)).toEqual(['high', 'medium', 'low']);
  });

  it('returns empty array for empty input', () => {
    expect(getFilteredTasks([], 'all')).toEqual([]);
    expect(getFilteredTasks([], 'active')).toEqual([]);
    expect(getFilteredTasks([], 'completed')).toEqual([]);
  });
});

describe('activeCount', () => {
  it('counts only non-completed tasks', () => {
    const tasks = [
      { id: '1', completed: false },
      { id: '2', completed: true },
      { id: '3', completed: false },
    ];
    expect(activeCount(tasks)).toBe(2);
  });

  it('returns 0 for empty array', () => {
    expect(activeCount([])).toBe(0);
  });
});

describe('completedCount', () => {
  it('counts only completed tasks', () => {
    const tasks = [
      { id: '1', completed: true },
      { id: '2', completed: false },
      { id: '3', completed: true },
    ];
    expect(completedCount(tasks)).toBe(2);
  });

  it('returns 0 for empty array', () => {
    expect(completedCount([])).toBe(0);
  });
});
