/**
 * Shared validation utilities.
 * Centralizes business-rule validation for Gonkers.
 */

/**
 * Validate that a task's text is non-empty after trimming.
 * @param {string} text
 * @returns {boolean}
 */
export function isValidTaskText(text) {
  return typeof text === 'string' && text.trim().length > 0;
}

/**
 * Validate a priority value is one of the allowed values.
 * @param {string} priority
 * @returns {boolean}
 */
export function isValidPriority(priority) {
  return ['high', 'medium', 'low'].includes(priority);
}
