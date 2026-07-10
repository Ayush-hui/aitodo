import { getState } from '../../app/store.js';
import { getFilteredTasks } from './selectors.js';
import { buildCheckboxSVG, buildEditIconSVG, buildDeleteIconSVG } from '../../shared/dom.js';

let _taskListEl = null;
let _emptyState = null;

function getTaskListEl() {
  if (!_taskListEl) _taskListEl = document.getElementById('taskList');
  return _taskListEl;
}

function getEmptyState() {
  if (!_emptyState) _emptyState = document.getElementById('emptyState');
  return _emptyState;
}

export function renderTasks() {
  const { tasks, currentFilter, editingId } = getState();
  const filtered = getFilteredTasks(tasks, currentFilter);
  const taskListEl = getTaskListEl();
  const emptyState = getEmptyState();

  // Clear and rebuild
  taskListEl.innerHTML = '';

  const showSections = currentFilter === 'all' || currentFilter === 'active';
  let lastPriority = null;

  for (const task of filtered) {
    if (showSections && task.priority !== lastPriority) {
      lastPriority = task.priority;
      const header = document.createElement('div');
      header.className = `section-header ${task.priority}`;
      header.textContent = task.priority.toUpperCase();
      taskListEl.appendChild(header);
    }

    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '') + (editingId === task.id ? ' editing' : '');
    li.dataset.id = task.id;

    if (editingId === task.id) {
      buildEditMode(li, task);
    } else {
      buildViewMode(li, task);
    }

    taskListEl.appendChild(li);
  }

  const visibleCount = filtered.length;
  emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  taskListEl.style.display = visibleCount === 0 ? 'none' : 'block';

  // Focus edit input if editing
  if (editingId) {
    const editInput = taskListEl.querySelector('.task-edit-input');
    if (editInput) {
      editInput.focus();
      editInput.selectionStart = editInput.value.length;
    }
  }
}

function buildViewMode(li, task) {
  // Priority dot
  const dot = document.createElement('div');
  dot.className = `priority-dot ${task.priority}`;
  dot.title = `${task.priority} priority`;
  li.appendChild(dot);

  // Checkbox
  const checkbox = document.createElement('div');
  checkbox.className = 'checkbox' + (task.completed ? ' checked' : '');
  checkbox.dataset.action = 'toggle';
  checkbox.appendChild(buildCheckboxSVG());
  li.appendChild(checkbox);

  // Text
  const textSpan = document.createElement('span');
  textSpan.className = 'task-text';
  textSpan.textContent = task.text;
  li.appendChild(textSpan);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'btn-icon edit';
  editBtn.title = 'Edit';
  editBtn.dataset.action = 'edit';
  editBtn.appendChild(buildEditIconSVG());
  actions.appendChild(editBtn);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn-icon delete';
  deleteBtn.title = 'Delete';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.appendChild(buildDeleteIconSVG());
  actions.appendChild(deleteBtn);

  li.appendChild(actions);
}

function buildEditMode(li, task) {
  const editRow = document.createElement('div');
  editRow.className = 'edit-row';

  const input = document.createElement('input');
  input.className = 'task-edit-input';
  input.type = 'text';
  input.value = task.text;
  editRow.appendChild(input);

  const selector = document.createElement('div');
  selector.className = 'priority-selector';
  selector.dataset.editPriority = task.priority;

  for (const p of ['high', 'medium', 'low']) {
    const pill = document.createElement('button');
    pill.className = 'priority-pill' + (task.priority === p ? ' selected' : '');
    pill.dataset.priority = p;
    pill.textContent = p[0].toUpperCase();
    selector.appendChild(pill);
  }

  editRow.appendChild(selector);
  li.appendChild(editRow);
}
