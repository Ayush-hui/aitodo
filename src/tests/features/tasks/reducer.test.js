import { describe, it, expect } from 'vitest';
import { addTask, deleteTask, toggleTask, updateTask, clearCompleted } from '../../../features/tasks/reducer.js';

describe('addTask', () => {
  it('prepends new task to the front of the array', () => {
    const tasks = [{ id: '1', text: 'Old', completed: false, priority: 'low' }];
    const result = addTask(tasks, { id: '2', text: 'New', priority: 'high' });
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('New');
    expect(result[0].completed).toBe(false);
    expect(result[0].priority).toBe('high');
  });

  it('does not mutate the original array', () => {
    const tasks = [{ id: '1', text: 'Old', completed: false, priority: 'low' }];
    addTask(tasks, { id: '2', text: 'New', priority: 'high' });
    expect(tasks).toHaveLength(1);
  });
});

describe('deleteTask', () => {
  it('removes task by id', () => {
    const tasks = [
      { id: '1', text: 'A' },
      { id: '2', text: 'B' },
    ];
    const result = deleteTask(tasks, '1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns a new array even when id not found', () => {
    const tasks = [{ id: '1', text: 'A' }];
    const result = deleteTask(tasks, '99');
    expect(result).not.toBe(tasks);
    expect(result).toHaveLength(1);
  });
});

describe('toggleTask', () => {
  it('toggles completed status', () => {
    const tasks = [{ id: '1', completed: false }];
    expect(toggleTask(tasks, '1')[0].completed).toBe(true);
  });

  it('creates a new object without mutating original', () => {
    const tasks = [{ id: '1', completed: false }];
    const result = toggleTask(tasks, '1');
    expect(result).not.toBe(tasks);
    expect(result[0]).not.toBe(tasks[0]);
  });

  it('returns new array when id not found', () => {
    const tasks = [{ id: '1', completed: false }];
    expect(toggleTask(tasks, '99')).toHaveLength(1);
  });
});

describe('updateTask', () => {
  it('updates text and priority for the matching task', () => {
    const tasks = [
      { id: '1', text: 'Old', priority: 'low', completed: false },
      { id: '2', text: 'Other', priority: 'high', completed: false },
    ];
    const result = updateTask(tasks, '1', 'Updated', 'high');
    expect(result[0].text).toBe('Updated');
    expect(result[0].priority).toBe('high');
    expect(result[0].completed).toBe(false);
    expect(result[1]).toEqual(tasks[1]);
  });

  it('does not mutate the original', () => {
    const tasks = [{ id: '1', text: 'Old', priority: 'low', completed: false }];
    updateTask(tasks, '1', 'Updated', 'high');
    expect(tasks[0].text).toBe('Old');
  });
});

describe('clearCompleted', () => {
  it('removes all completed tasks', () => {
    const tasks = [
      { id: '1', completed: true },
      { id: '2', completed: false },
      { id: '3', completed: true },
    ];
    const result = clearCompleted(tasks);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('does not mutate the original', () => {
    const tasks = [{ id: '1', completed: true }];
    clearCompleted(tasks);
    expect(tasks).toHaveLength(1);
  });
});
