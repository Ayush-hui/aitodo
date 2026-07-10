/**
 * Generate a unique ID string based on timestamp and random suffix.
 * @returns {string} unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
