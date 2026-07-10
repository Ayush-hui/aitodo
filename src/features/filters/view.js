import { getState } from '../../app/store.js';


let _filterBtns = null;
let _clearBtn = null;

function getFilterBtns() {
  if (!_filterBtns) _filterBtns = document.querySelectorAll('.filter-btn');
  return _filterBtns;
}

function getClearBtn() {
  if (!_clearBtn) _clearBtn = document.getElementById('clearCompleted');
  return _clearBtn;
}

export function renderFilters() {
  const { tasks, currentFilter } = getState();
  const filterBtns = getFilterBtns();
  const clearBtn = getClearBtn();
  // Update active filter button
  for (const btn of filterBtns) {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  }

  // Update clear completed disabled state
  const hasCompleted = tasks.some((t) => t.completed);
  clearBtn.disabled = !hasCompleted;
}

export function initFilterListeners(onFilter, onClear) {
  const filterBtns = getFilterBtns();
  const clearBtn = getClearBtn();
  for (const btn of filterBtns) {
    btn.addEventListener('click', () => onFilter(btn.dataset.filter));
  }
  clearBtn.addEventListener('click', onClear);
}
