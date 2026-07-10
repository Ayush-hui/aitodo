/**
 * Thin localStorage wrapper with safe get/set.
 */

/**
 * @param {string} key
 * @returns {string | null}
 */
export function getItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {string} value
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}
