import { setState } from '../../app/store.js';
import * as service from './service.js';

export function addTask() {
  service.createTask();
}

export function removeTask(id) {
  service.removeTask(id);
}

export function toggle(id) {
  service.toggleTask(id);
}

export function startEdit(id) {
  setState({ editingId: id });
}

export function commitEdit(id, newText, newPriority) {
  service.updateTask(id, newText, newPriority);
}

export function cancelEdit() {
  setState({ editingId: null });
}

export function clearCompleted() {
  service.clearCompleted();
}
