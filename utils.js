/**
 * utils.js — General utility functions and helpers
 * Includes Toast, i18n, Helper functions
 */

// ═══ Toast Notifications ═══
const Toast = {
  /**
   * Show toast message
   * @param {string} msg
   * @param {string} type - 'ok', 'err', 'warn', 'info'
   * @param {number} duration - milliseconds
   */
  show: (msg, type = 'ok', duration = CONFIG.TOAST_DURATION) => {
    let el = document.getElementById('__toast');
    if (!el) {
      el = document.createElement('div');
      el.id = '__toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    
    el.textContent = msg;
    el.className = `toast toast-${type}`;
    el.classList.add('show');
    
    clearTimeout(el._t);
    el._t = setTimeout(() => {
      el.classList.remove('show');
    }, duration);
    
    Logger.debug(`Toast: ${type} - ${msg}`);
  },
  
  success: (msg) => Toast.show(msg, 'ok'),
  error: (msg) => Toast.show(msg, 'err'),
  warning: (msg) => Toast.show(msg, 'warn'),
  info: (msg) => Toast.show(msg, 'info')
};

// ═══ Internationalization ═══
const i18n = {
  /**
   * Get current language
   * @returns {string} 'ru' or 'en'
   */
  lang: () => Storage.get(CONFIG.LANG_KEY, 'ru'),
  
  /**
   * Set language
   * @param {string} lang
   */
  setLang: (lang) => {
    Storage.set(CONFIG.LANG_KEY, lang);
    location.reload();
  },
  
  /**
   * Translate key
   * @param {string} key - translation key
   * @returns {string} translated text
   */
  t: (key) => {
    if (typeof TRANSLATIONS === 'undefined') return key;
    
    const lang = i18n.lang();
    const dict = TRANSLATIONS[lang] || {};
    const fallback = TRANSLATIONS['ru'] || {};
    
    return dict[key] || fallback[key] || key;
  },
  
  /**
   * Get language button HTML
   * @returns {string} HTML
   */
  getLangButton: () => {
    const lang = i18n.lang();
    return `<button class="lang-btn" onclick="i18n.setLang('${lang === 'ru' ? 'en' : 'ru'}')">${lang === 'ru' ? 'EN' : 'RU'}</button>`;
  }
};

// ═══ Helper Functions ═══
const Helper = {
  /**
   * Generate flag image HTML
   * @param {string} iso - country ISO code
   * @param {number} size - image size in px
   * @returns {string} HTML img tag
   */
  flagImg: (iso, size = 20) => {
    if (!iso) return '';
    const height = Math.round(size * 0.75);
    return `<img src="https://flagcdn.com/${size}x${height}/${iso.toLowerCase()}.png" 
            style="width:${size}px;height:${height}px;border-radius:2px;vertical-align:middle;
            object-fit:cover;display:inline-block;margin-right:4px" 
            loading="lazy" alt="${iso}" onerror="this.style.display='none'" />`;
  },
  
  /**
   * Format date
   * @param {Date|string} date
   * @param {string} format - 'short', 'long', 'time'
   * @returns {string}
   */
  formatDate: (date, format = 'short') => {
    const d = new Date(date);
    if (isNaN(d)) return 'Invalid date';
    
    const formats = {
      short: () => d.toLocaleDateString('ru-RU'),
      long: () => d.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: () => d.toLocaleTimeString('ru-RU')
    };
    
    return (formats[format] || formats.short)();
  },
  
  /**
   * Format currency
   * @param {number} amount
   * @param {string} currency - 'EUR', 'USD', etc
   * @returns {string}
   */
  formatCurrency: (amount, currency = 'EUR') => {
    const symbols = { EUR: '€', USD: '$', RUB: '₽', GBP: '£' };
    const symbol = symbols[currency] || currency;
    return `${amount.toLocaleString('ru-RU')}${symbol}`;
  },
  
  /**
   * Copy to clipboard
   * @param {string} text
   * @param {string} message
   */
  copyToClipboard: async (text, message = 'Copied!') => {
    try {
      await navigator.clipboard.writeText(text);
      Toast.success(message);
    } catch (e) {
      Logger.error('Copy to clipboard failed:', e);
      Toast.error('Failed to copy');
    }
  },
  
  /**
   * Debounce function
   * @param {Function} fn
   * @param {number} delay
   * @returns {Function}
   */
  debounce: (fn, delay = 300) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  },
  
  /**
   * Throttle function
   * @param {Function} fn
   * @param {number} limit
   * @returns {Function}
   */
  throttle: (fn, limit = 300) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  /**
   * Wait/sleep
   * @param {number} ms
   * @returns {Promise}
   */
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  /**
   * Sanitize HTML
   * @param {string} html
   * @returns {string}
   */
  sanitizeHtml: (html) => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  },
  
  /**
   * Parse query parameters
   * @param {string} query
   * @returns {object}
   */
  parseQuery: (query = location.search) => {
    const params = new URLSearchParams(query);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },
  
  /**
   * Build query string
   * @param {object} obj
   * @returns {string}
   */
  buildQuery: (obj) => {
    return new URLSearchParams(obj).toString();
  }
};
