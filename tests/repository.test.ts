import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadTasks, saveTasks } from '@/lib/repository';
import type { Task } from '@/lib/types';

describe('repository', () => {
  const STORAGE_KEY = 'todo_tasks';

  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('loadTasks', () => {
    it('returns empty array when no data exists', () => {
      expect(loadTasks()).toEqual([]);
    });

    it('returns parsed tasks when data exists', () => {
      const tasks: Task[] = [{ id: '1', text: 'Buy milk', completed: false, priority: 'medium' }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      expect(loadTasks()).toEqual(tasks);
    });

    it('returns empty array for invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json');
      expect(loadTasks()).toEqual([]);
    });

    it('returns empty array for non-array data', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: '1' }));
      expect(loadTasks()).toEqual([]);
    });
  });

  describe('saveTasks', () => {
    it('persists tasks to localStorage', () => {
      const tasks: Task[] = [{ id: '1', text: 'Code', completed: true, priority: 'high' }];
      saveTasks(tasks);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(tasks));
    });
  });

  describe('round-trip', () => {
    it('loads what was saved', () => {
      const tasks: Task[] = [
        { id: '1', text: 'First', completed: false, priority: 'low' },
        { id: '2', text: 'Second', completed: true, priority: 'medium' },
      ];
      saveTasks(tasks);
      expect(loadTasks()).toEqual(tasks);
    });
  });
});
