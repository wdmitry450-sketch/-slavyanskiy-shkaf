/**
 * logger.js — Centralized logging
 * Usage: Logger.debug(), Logger.info(), Logger.warn(), Logger.error()
 */

const Logger = {
  /**
   * Debug log (only if CONFIG.DEBUG is true)
   */
  debug: (...args) => {
    if (CONFIG && CONFIG.DEBUG) {
      console.log('%c[DEBUG]', 'color: #888; font-weight: bold;', ...args);
    }
  },
  
  /**
   * Info log
   */
  info: (...args) => {
    console.log('%c[INFO]', 'color: #0066ff; font-weight: bold;', ...args);
  },
  
  /**
   * Warning log
   */
  warn: (...args) => {
    console.warn('%c[WARN]', 'color: #ff9900; font-weight: bold;', ...args);
  },
  
  /**
   * Error log
   */
  error: (...args) => {
    console.error('%c[ERROR]', 'color: #ff0000; font-weight: bold;', ...args);
  },
  
  /**
   * Performance timing
   */
  time: (label) => {
    if (CONFIG && CONFIG.DEBUG) {
      console.time(`[PERF] ${label}`);
    }
  },
  
  /**
   * End performance timing
   */
  timeEnd: (label) => {
    if (CONFIG && CONFIG.DEBUG) {
      console.timeEnd(`[PERF] ${label}`);
    }
  },
  
  /**
   * Table log for arrays/objects
   */
  table: (data) => {
    if (CONFIG && CONFIG.DEBUG) {
      console.table(data);
    }
  },
  
  /**
   * Clear console
   */
  clear: () => {
    console.clear();
  }
};
