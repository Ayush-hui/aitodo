/**
 * Task service — orchestration layer between the controller
 * and the reducer / repository. Contains all use-case logic
 * for mutating task state.
 */

import { getState, setState } from '../../app/store.js';
import { generateId } from '../../shared/id.js';
import * as reducer from './reducer.js';
import { saveTasks } from './repository.js';
import { isValidTaskText, isValidPriority } from '../../shared/validation.js';

/**
 * Add a new task from the current input state.
 * @returns {boolean} true if a task was added
 */
export function createTask() {
  const { tasks, selectedPriority } = getState();
  const taskInput = document.getElementById('taskInput');
  const text = taskInput.value;

  if (!isValidTaskText(text)) return false;

  const priority = isValidPriority(selectedPriority) ? selectedPriority : 'medium';
  const newTasks = reducer.addTask(tasks, { id: generateId(), text, priority });
  setState({ tasks: newTasks });
  saveTasks(newTasks);
  taskInput.value = '';
  return true;
}

/**
 * Remove a task by id.
 * @param {string} id
 */
export function removeTask(id) {
  const { tasks } = getState();
  const newTasks = reducer.deleteTask(tasks, id);
  setState({ tasks: newTasks, editingId: null });
  saveTasks(newTasks);
}

/**
 * Toggle a task's completed status.
 * @param {string} id
 */
export function toggleTask(id) {
  const { tasks } = getState();
  const newTasks = reducer.toggleTask(tasks, id);
  setState({ tasks: newTasks });
  saveTasks(newTasks);
}

/**
 * Commit an edited task. If text is empty, deletes the task instead.
 * @param {string} id
 * @param {string} newText
 * @param {string} newPriority
 */
export function updateTask(id, newText, newPriority) {
  if (!isValidTaskText(newText)) {
    removeTask(id);
    return;
  }

  const { tasks } = getState();
  const priority = isValidPriority(newPriority) ? newPriority : 'medium';
  const newTasks = reducer.updateTask(tasks, id, newText.trim(), priority);
  setState({ tasks: newTasks, editingId: null });
  saveTasks(newTasks);
}

/**
 * Clear all completed tasks.
 */
export function clearCompleted() {
  const { tasks } = getState();
  const newTasks = reducer.clearCompleted(tasks);
  setState({ tasks: newTasks });
  saveTasks(newTasks);
}
