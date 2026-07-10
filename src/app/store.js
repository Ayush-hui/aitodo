import { loadTasks } from '../features/tasks/repository.js';

/**
 * Single source of truth for mutable application state.
 * Subscribers are notified whenever state changes.
 */

const state = {
  tasks: loadTasks(),
  currentFilter: 'all',
  editingId: null,
  selectedPriority: 'medium',
};

const listeners = new Set();

// Store API

/** @returns {{ tasks: Array, currentFilter: string, editingId: string|null, selectedPriority: string }} */
export function getState() {
  return { ...state };
}

/** Replace the state (merge updates). Keys omitted are preserved. */
export function setState(updates) {
  Object.assign(state, updates);
  // notify promptly
  notify();
}

/** Subscribe a listener to be called on every state change. */
export function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Notify all subscribers immediately. */
function notify() {
  for (const listener of listeners) {
    listener(state);
  }
}

/** Unsubscribe all. Convenience for tests. */
export function clearSubscribers() {
  listeners.clear();
}
