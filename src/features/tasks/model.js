/**
 * Task model constants and factory.
 */

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

/**
 * Create a new task object.
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.text
 * @param {boolean} [params.completed=false]
 * @param {string} [params.priority='medium']
 * @returns {{ id: string, text: string, completed: boolean, priority: string }}
 */
export function createTask({ id, text, completed = false, priority = 'medium' } = {}) {
  return { id, text, completed, priority };
}
