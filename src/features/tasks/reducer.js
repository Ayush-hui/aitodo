import { createTask } from './model.js';

/**
 * Pure reducer functions for task state.
 * Each returns a new array; never mutates the input.
 */

/** @param {Array} tasks @param {string} text @param {string} priority @returns {Array} */
export function addTask(tasks, { id, text, priority }) {
  return [createTask({ id, text, priority }), ...tasks];
}

/** @param {Array} tasks @param {string} id @returns {Array} */
export function deleteTask(tasks, id) {
  return tasks.filter((t) => t.id !== id);
}

/** @param {Array} tasks @param {string} id @returns {Array} */
export function toggleTask(tasks, id) {
  return tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

/** @param {Array} tasks @param {string} id @param {string} text @param {string} priority @returns {Array} */
export function updateTask(tasks, id, text, priority) {
  return tasks.map((t) => (t.id === id ? { ...t, text, priority } : t));
}

/** @param {Array} tasks @returns {Array} */
export function clearCompleted(tasks) {
  return tasks.filter((t) => !t.completed);
}
