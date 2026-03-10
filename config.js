/**
 * config.js — Centralized configuration for Slavic Shkaf
 * All constants and settings in one place
 */

const CONFIG = {
  // Storage keys
  LANG_KEY: 'ss_lang',
  AUTH_KEY: 'ss_auth',
  TOKEN_KEY: 'ss_token',
  USERS_KEY: 'ss_users',
  ORDERS_KEY: 'ss_orders',
  REGISTER_DATA_KEY: 'ss_register_data',
  FORGOT_EMAIL_KEY: 'forgot_email',
  
  // Telegram Bot
  TELEGRAM_BOT: 'slavyanskiy_shkaf_bot',
  TELEGRAM_BOT_ID: '8727088510',
  TELEGRAM_BOT_TOKEN: '8727088510:AAENV-aXP7HTGmmR1pn4UCltWOsy7SSeCYk',
  
  // API Base URL
  API_BASE: window.API_BASE || (
    location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      ? 'http://localhost:8787'
      : ''
  ),
  
  // UI Settings
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  
  // Responsive breakpoints (px)
  BREAKPOINTS: {
    mobile: 420,
    tablet: 640,
    desktop: 900
  },
  
  // Validation rules
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  
  // Admin credentials (for demo)
  ADMIN_EMAIL: 'admin@slavic-shkaf.eu',
  ADMIN_PASSWORD: 'admin2025',
  
  // Debug mode
  DEBUG: false,
  
  // Get current viewport
  getViewport: () => {
    if (window.innerWidth <= CONFIG.BREAKPOINTS.mobile) return 'mobile';
    if (window.innerWidth <= CONFIG.BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
  },
  
  // Check if mobile
  isMobile: () => window.innerWidth <= CONFIG.BREAKPOINTS.mobile,
  
  // Check if Telegram WebApp
  isTelegram: () => typeof window.Telegram !== 'undefined' && window.Telegram.WebApp
};

// Freeze to prevent accidental modifications
Object.freeze(CONFIG);
