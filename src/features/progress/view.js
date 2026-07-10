import { getState } from '../../app/store.js';
import { completedCount } from '../tasks/selectors.js';

let _progressSection = null;
let _progressFill = null;
let _progressPercent = null;
let _progressFraction = null;
let _footerEl = null;

function getProgressSection() {
  if (!_progressSection) _progressSection = document.getElementById('progressSection');
  return _progressSection;
}
function getProgressFill() {
  if (!_progressFill) _progressFill = document.getElementById('progressFill');
  return _progressFill;
}
function getProgressPercent() {
  if (!_progressPercent) _progressPercent = document.getElementById('progressPercent');
  return _progressPercent;
}
function getProgressFraction() {
  if (!_progressFraction) _progressFraction = document.getElementById('progressFraction');
  return _progressFraction;
}
function getFooterEl() {
  if (!_footerEl) _footerEl = document.getElementById('footer');
  return _footerEl;
}

export function renderProgress() {
  const { tasks } = getState();
  const total = tasks.length;
  const done = completedCount(tasks);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const progressSection = getProgressSection();
  const progressFill = getProgressFill();
  const progressPercent = getProgressPercent();
  const progressFraction = getProgressFraction();
  const footerEl = getFooterEl();

  // Update footer count
  const remaining = total - done;
  footerEl.textContent = remaining === 1 ? '1 item left' : `${remaining} items left`;

  if (total === 0) {
    progressSection.style.display = 'none';
    footerEl.style.display = 'none';
  } else {
    progressSection.style.display = 'block';
    footerEl.style.display = 'block';
    progressFill.style.width = `${pct}%`;
    progressFill.classList.toggle('complete', pct === 100);
    progressPercent.textContent = `${pct}%`;
    progressFraction.textContent = `${done}/${total}`;
  }
}
