/**
 * validation.js — Form and data validation helpers
 * Usage: Validator.email(email), Validator.validate(data, rules)
 */

const Validator = {
  /**
   * Check if email is valid
   * @param {string} email
   * @returns {boolean}
   */
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },
  
  /**
   * Check if password meets requirements
   * @param {string} password
   * @param {number} minLength
   * @returns {boolean}
   */
  password: (password, minLength = CONFIG.MIN_PASSWORD_LENGTH) => {
    return password && password.length >= minLength;
  },
  
  /**
   * Check if phone is valid
   * @param {string} phone
   * @returns {boolean}
   */
  phone: (phone) => {
    const re = /^\+?\d{7,}$/;
    return re.test(String(phone).replace(/\D/g, ''));
  },
  
  /**
   * Check if required field has value
   * @param {any} value
   * @returns {boolean}
   */
  required: (value) => {
    return value && String(value).trim().length > 0;
  },
  
  /**
   * Check string length
   * @param {string} str
   * @param {number} min
   * @param {number} max
   * @returns {boolean}
   */
  length: (str, min, max) => {
    const len = String(str).length;
    return len >= min && len <= max;
  },
  
  /**
   * Check if URL is valid
   * @param {string} url
   * @returns {boolean}
   */
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Check if number is in range
   * @param {number} num
   * @param {number} min
   * @param {number} max
   * @returns {boolean}
   */
  range: (num, min, max) => {
    return num >= min && num <= max;
  },
  
  /**
   * Validate entire object against rules
   * @param {object} data - data to validate
   * @param {object} rules - validation rules: { field: validatorFunction }
   * @returns {object|null} errors object or null if valid
   */
  validate: (data, rules) => {
    const errors = {};
    
    for (const [field, validator] of Object.entries(rules)) {
      try {
        const value = data[field];
        const isValid = Array.isArray(validator)
          ? validator.every(fn => fn(value))
          : validator(value);
        
        if (!isValid) {
          errors[field] = `Invalid ${field}`;
        }
      } catch (e) {
        Logger.error(`Validation error for ${field}:`, e);
        errors[field] = `Validation error`;
      }
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
  },
  
  /**
   * Get user-friendly error message
   * @param {string} field
   * @param {string} type - email, password, required, length, etc
   * @returns {string}
   */
  getErrorMessage: (field, type) => {
    const messages = {
      email: `${field} must be a valid email`,
      password: `${field} must be at least ${CONFIG.MIN_PASSWORD_LENGTH} characters`,
      required: `${field} is required`,
      length: `${field} has invalid length`,
      phone: `${field} must be a valid phone number`,
      url: `${field} must be a valid URL`,
      range: `${field} is out of range`,
      default: `${field} is invalid`
    };
    return messages[type] || messages.default;
  }
};
