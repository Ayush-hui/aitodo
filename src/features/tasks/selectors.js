import { PRIORITY_ORDER } from './model.js';

/**
 * Pure selector functions.
 * Never mutate input arrays.
 */

/**
 * Get filtered and sorted tasks.
 * @param {Array} tasks
 * @param {string} currentFilter - 'all', 'active', or 'completed'
 * @returns {Array}
 */
export function getFilteredTasks(tasks, currentFilter) {
  let filtered = [...tasks];
  if (currentFilter === 'active') {
    filtered = filtered.filter((t) => !t.completed);
  } else if (currentFilter === 'completed') {
    filtered = filtered.filter((t) => t.completed);
  }
  // Sort by priority: use spread to ensure the result is a new array
  return [...filtered].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

/**
 * Count of active (non-completed) tasks.
 * @param {Array} tasks
 * @returns {number}
 */
export function activeCount(tasks) {
  return tasks.filter((t) => !t.completed).length;
}

/**
 * Count of completed tasks.
 * @param {Array} tasks
 * @returns {number}
 */
export function completedCount(tasks) {
  return tasks.filter((t) => t.completed).length;
}
