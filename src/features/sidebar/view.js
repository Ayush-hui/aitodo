import { getState } from '../../app/store.js';
import { activeCount } from '../tasks/selectors.js';

let _sidebarEl = null;

function getSidebarEl() {
  if (!_sidebarEl) _sidebarEl = document.getElementById('sidebarIndicator');
  return _sidebarEl;
}

export function renderSidebar() {
  const { tasks } = getState();
  const sidebarEl = getSidebarEl();
  const count = activeCount(tasks);
  let color, glow;

  if (count === 0) {
    color = '#2a2a2a';
    glow = 'none';
  } else if (count === 1) {
    color = 'rgba(52, 211, 153, 0.6)';
    glow = '0 0 12px 2px rgba(52, 211, 153, 0.15)';
  } else if (count === 2) {
    color = 'rgba(251, 146, 60, 0.6)';
    glow = '0 0 12px 2px rgba(251, 146, 60, 0.15)';
  } else if (count === 3) {
    color = 'rgba(248, 113, 113, 0.6)';
    glow = '0 0 12px 2px rgba(248, 113, 113, 0.15)';
  } else if (count === 4) {
    color = 'rgba(239, 68, 68, 0.8)';
    glow = '0 0 16px 3px rgba(239, 68, 68, 0.2)';
  } else {
    color = 'rgba(168, 139, 250, 0.6)';
    glow = '0 0 16px 3px rgba(168, 139, 250, 0.2)';
  }

  sidebarEl.style.backgroundColor = color;
  sidebarEl.style.boxShadow = glow;
}
