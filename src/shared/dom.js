/**
 * DOM helper utilities for creating elements and SVG icons.
 * All functions use DOM APIs (no innerHTML) for safety.
 */

/**
 * Create an element with optional classes and children.
 * @param {string} tag
 * @param {Object} [options]
 * @param {string|string[]} [options.className]
 * @param {string} [options.text]
 * @param {Record<string, string>} [options.dataset]
 * @param {(Element|string)[]|null} [options.children]
 * @returns {HTMLElement}
 */
export function createEl(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.className) {
    if (Array.isArray(options.className)) {
      el.classList.add(...options.className);
    } else {
      el.className = options.className;
    }
  }
  if (options.text !== undefined) {
    el.textContent = options.text;
  }
  if (options.dataset) {
    for (const [key, value] of Object.entries(options.dataset)) {
      el.dataset[key] = value;
    }
  }
  if (options.children) {
    for (const child of options.children) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child) {
        el.appendChild(child);
      }
    }
  }
  return el;
}

/**
 * Build the checkmark SVG for a checkbox.
 * @returns {SVGSVGElement}
 */
export function buildCheckboxSVG() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 10 10');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M2 5.5L4 7.5L8 3');
  path.setAttribute('stroke', '#0a0a0a');
  path.setAttribute('stroke-width', '1.6');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.appendChild(path);
  return svg;
}

/**
 * Build the edit icon SVG.
 * @returns {SVGSVGElement}
 */
export function buildEditIconSVG() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 15 15');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M11.5 1.5l2 2-8 8H3.5v-2l8-8z');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.4');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.appendChild(path);
  return svg;
}

/**
 * Build the delete icon SVG.
 * @returns {SVGSVGElement}
 */
export function buildDeleteIconSVG() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 15 15');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS(ns, 'path');
  path.setAttribute(
    'd',
    'M3.5 3.5h8M5.5 3.5V2.5a1 1 0 011-1h2a1 1 0 011 1v1M6 6.5v4M9 6.5v4M4 3.5l.5 9a1 1 0 001 1h4a1 1 0 001-1l.5-9'
  );
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.4');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.appendChild(path);
  return svg;
}
