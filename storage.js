/**
 * storage.js — Safe localStorage wrapper with error handling
 * Usage: Storage.set(key, value), Storage.get(key, default)
 */

const Storage = {
  /**
   * Set value in localStorage
   * @param {string} key
   * @param {any} value
   * @returns {boolean} success
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      Logger.error(`Storage.set("${key}")`, e);
      return false;
    }
  },
  
  /**
   * Get value from localStorage
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any} stored value or default
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      Logger.error(`Storage.get("${key}")`, e);
      return defaultValue;
    }
  },
  
  /**
   * Check if key exists
   * @param {string} key
   * @returns {boolean}
   */
  has: (key) => {
    try {
      return localStorage.getItem(key) !== null;
    } catch (e) {
      Logger.error(`Storage.has("${key}")`, e);
      return false;
    }
  },
  
  /**
   * Remove item from localStorage
   * @param {string} key
   * @returns {boolean} success
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      Logger.error(`Storage.remove("${key}")`, e);
      return false;
    }
  },
  
  /**
   * Clear all localStorage
   * @returns {boolean} success
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      Logger.error('Storage.clear()', e);
      return false;
    }
  },
  
  /**
   * Get all keys
   * @returns {string[]} array of keys
   */
  keys: () => {
    try {
      return Object.keys(localStorage);
    } catch (e) {
      Logger.error('Storage.keys()', e);
      return [];
    }
  },
  
  /**
   * Get storage size (rough estimate)
   * @returns {number} bytes
   */
  getSize: () => {
    let size = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
      return size;
    } catch (e) {
      Logger.error('Storage.getSize()', e);
      return 0;
    }
  }
};
