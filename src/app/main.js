// ── Styles ──
import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/layout.css';
import '../styles/components/sidebar.css';
import '../styles/components/progress.css';
import '../styles/components/input.css';
import '../styles/components/filters.css';
import '../styles/components/tasks.css';
import '../styles/components/sections.css';
import '../styles/components/responsive.css';

// ── Store ──
import { getState, setState, subscribe } from './store.js';

// ── Feature Views ──
import { renderTasks } from '../features/tasks/view.js';
import { renderFilters, initFilterListeners } from '../features/filters/view.js';
import { renderProgress } from '../features/progress/view.js';
import { renderSidebar } from '../features/sidebar/view.js';

// ── Task Controller ──
import {
  addTask,
  removeTask,
  toggle,
  startEdit,
  commitEdit,
  cancelEdit,
  clearCompleted,
} from '../features/tasks/controller.js';

// ── DOM Builder ──

function buildApp() {
  const app = document.getElementById('app');

  // Sidebar indicator
  const sidebarIndicator = document.createElement('div');
  sidebarIndicator.className = 'sidebar-indicator';
  sidebarIndicator.id = 'sidebarIndicator';
  app.appendChild(sidebarIndicator);

  // Main app container
  const main = document.createElement('main');
  main.className = 'app';

  // ── Header ──
  const header = document.createElement('header');
  header.className = 'header';
  const h1 = document.createElement('h1');
  h1.textContent = 'TODO';
  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Fuck your procrastination';
  header.appendChild(h1);
  header.appendChild(subtitle);
  main.appendChild(header);

  // ── Input Row ──
  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';

  const taskInput = document.createElement('input');
  taskInput.type = 'text';
  taskInput.id = 'taskInput';
  taskInput.placeholder = 'What needs to be done?';
  taskInput.autocomplete = 'off';
  inputRow.appendChild(taskInput);

  const prioritySelector = document.createElement('div');
  prioritySelector.className = 'priority-selector';
  prioritySelector.id = 'inputPriority';
  for (const [p, label, selected] of [
    ['high', 'H', false],
    ['medium', 'M', true],
    ['low', 'L', false],
  ]) {
    const pill = document.createElement('button');
    pill.className = `priority-pill${selected ? ' selected' : ''}`;
    pill.dataset.priority = p;
    pill.textContent = label;
    prioritySelector.appendChild(pill);
  }
  inputRow.appendChild(prioritySelector);

  const addBtn = document.createElement('button');
  addBtn.className = 'btn-add';
  addBtn.id = 'addBtn';
  addBtn.textContent = 'Add Task';
  inputRow.appendChild(addBtn);

  main.appendChild(inputRow);

  // ── Filters ──
  const filters = document.createElement('nav');
  filters.className = 'filters';
  filters.id = 'filters';
  for (const filterName of ['all', 'active', 'completed']) {
    const btn = document.createElement('button');
    btn.className = `filter-btn${filterName === 'all' ? ' active' : ''}`;
    btn.dataset.filter = filterName;
    btn.textContent = filterName[0].toUpperCase() + filterName.slice(1);
    filters.appendChild(btn);
  }
  const spacer = document.createElement('div');
  spacer.className = 'filter-spacer';
  filters.appendChild(spacer);
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn-clear';
  clearBtn.id = 'clearCompleted';
  clearBtn.textContent = 'Clear completed';
  filters.appendChild(clearBtn);
  main.appendChild(filters);

  // ── Task List ──
  const taskList = document.createElement('ul');
  taskList.className = 'task-list';
  taskList.id = 'taskList';
  main.appendChild(taskList);

  // ── Empty State ──
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.id = 'emptyState';
  emptyState.style.display = 'none';
  const emptyLine1 = document.createElement('p');
  emptyLine1.textContent = 'No tasks yet';
  const emptyLine2 = document.createElement('p');
  emptyLine2.textContent = 'Add a task to get started.';
  emptyState.appendChild(emptyLine1);
  emptyState.appendChild(emptyLine2);
  main.appendChild(emptyState);

  // ── Progress Section ──
  const progressSection = document.createElement('div');
  progressSection.className = 'progress-section';
  progressSection.id = 'progressSection';
  progressSection.style.display = 'none';
  const progressLabel = document.createElement('div');
  progressLabel.className = 'progress-label';
  progressLabel.textContent = 'Completed';
  progressSection.appendChild(progressLabel);
  const progressBarOuter = document.createElement('div');
  progressBarOuter.className = 'progress-bar-outer';
  const progressBarFill = document.createElement('div');
  progressBarFill.className = 'progress-bar-fill';
  progressBarFill.id = 'progressFill';
  progressBarOuter.appendChild(progressBarFill);
  progressSection.appendChild(progressBarOuter);
  const progressInfo = document.createElement('div');
  progressInfo.className = 'progress-info';
  const progressFraction = document.createElement('span');
  progressFraction.className = 'progress-fraction';
  progressFraction.id = 'progressFraction';
  const progressPercent = document.createElement('span');
  progressPercent.className = 'progress-percent';
  progressPercent.id = 'progressPercent';
  progressInfo.appendChild(progressFraction);
  progressInfo.appendChild(progressPercent);
  progressSection.appendChild(progressInfo);
  main.appendChild(progressSection);

  // ── Footer ──
  const footer = document.createElement('div');
  footer.className = 'footer';
  footer.id = 'footer';
  main.appendChild(footer);

  app.appendChild(main);
}

// ── Build the app ──
buildApp();

// ── DOM Elements ──
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskListEl = document.getElementById('taskList');
const inputPriority = document.getElementById('inputPriority');

// ── Render orchestrator ──
function render() {
  renderTasks();
  renderFilters();
  renderProgress();
  renderSidebar();
}

// Subscribe to state changes for re-rendering
subscribe(render);

// ── Event Listeners ──

// Add Task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Input Priority Selector
inputPriority.addEventListener('click', (e) => {
  const pill = e.target.closest('.priority-pill');
  if (!pill) return;
  const priority = pill.dataset.priority;
  setState({ selectedPriority: priority });
  for (const p of inputPriority.querySelectorAll('.priority-pill')) {
    p.classList.toggle('selected', p.dataset.priority === priority);
  }
});

// Filters
function onFilter(filter) {
  setState({ currentFilter: filter });
}
function onClearCompleted() {
  clearCompleted();
}
initFilterListeners(onFilter, onClearCompleted);

// Task List Event Delegation
taskListEl.addEventListener('click', (e) => {
  // Priority pills inside edit mode
  const editPill = e.target.closest('.edit-row .priority-pill');
  if (editPill) {
    const selector = editPill.closest('.priority-selector');
    selector.dataset.editPriority = editPill.dataset.priority;
    for (const p of selector.querySelectorAll('.priority-pill')) {
      p.classList.toggle('selected', p.dataset.priority === editPill.dataset.priority);
    }
    return;
  }

  const item = e.target.closest('.task-item');
  if (!item) return;
  const id = item.dataset.id;

  const action = e.target.closest('[data-action]');
  if (!action) return;

  switch (action.dataset.action) {
    case 'toggle':
      toggle(id);
      break;
    case 'edit':
      startEdit(id);
      break;
    case 'delete':
      removeTask(id);
      break;
  }
});

// Edit: commit on Enter, cancel on Escape
taskListEl.addEventListener('keydown', (e) => {
  if (!getState().editingId) return;
  const item = e.target.closest('.task-item');
  if (!item) return;
  const id = item.dataset.id;

  if (e.key === 'Enter') {
    e.preventDefault();
    const input = item.querySelector('.task-edit-input');
    const selector = item.querySelector('.priority-selector');
    const newText = input ? input.value.trim() : '';
    const newPriority = selector ? selector.dataset.editPriority : 'medium';
    commitEdit(id, newText, newPriority);
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    cancelEdit();
  }
});

// Commit edit on blur
taskListEl.addEventListener('focusout', (e) => {
  if (!getState().editingId) return;
  const input = e.target.closest('.task-edit-input');
  if (!input) return;
  const item = input.closest('.task-item');
  if (!item) return;
  const id = item.dataset.id;
  setTimeout(() => {
    if (getState().editingId === id) {
      const selector = item.querySelector('.priority-selector');
      const newPriority = selector ? selector.dataset.editPriority : 'medium';
      commitEdit(id, input.value.trim(), newPriority);
    }
  }, 150);
});

// Double-click to edit
taskListEl.addEventListener('dblclick', (e) => {
  const textEl = e.target.closest('.task-text');
  if (!textEl) return;
  const item = textEl.closest('.task-item');
  if (!item) return;
  startEdit(item.dataset.id);
});

// ── Initial Render ──
render();