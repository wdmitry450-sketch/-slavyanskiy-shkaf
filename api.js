// VERSION: 2.0 — no getUser conflict
/**
 * Slavic Shkaf — API Client
 * Replaces localStorage with real Cloudflare Workers API calls
 *
 * Include this file in all HTML pages BEFORE base.js
 * <script src="api.js"></script>
 *
 * Set window.API_BASE to your Worker URL:
 *   window.API_BASE = 'https://slavic-shkaf-api.YOUR_SUBDOMAIN.workers.dev';
 *   OR (if using Pages Functions):
 *   window.API_BASE = '';  // same origin /api/*
 */

// ── Config ──
// Auto-detect: if running on Pages, use same origin. Otherwise dev worker URL.
const API_BASE = window.API_BASE || (
  location.hostname === 'localhost' || location.hostname === '127.0.0.1'
    ? 'http://localhost:8787'
    : ''  // same origin — Pages Functions
);

const TOKEN_KEY = 'ss_token';
const USER_KEY  = 'ss_auth';

// ── HTTP helpers ──
async function apiRequest(method, path, body, authenticated = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (authenticated) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers['Authorization'] = 'Bearer ' + token;
  }

  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  let data;
  try { data = await res.json(); } catch { data = { ok: false, error: 'Parse error' }; }

  if (!data.ok && res.status === 401) {
    // Token expired — clear session
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { status: res.status, ...data };
}

const GET    = (path)       => apiRequest('GET',    path, null, true);
const POST   = (path, body) => apiRequest('POST',   path, body, true);
const PUT    = (path, body) => apiRequest('PUT',    path, body, true);
const DELETE = (path)       => apiRequest('DELETE', path, null, true);
const GUESTPOST = (path, body) => apiRequest('POST', path, body, false);

// ══════════════════════════════════════════════════
// AUTH API
// ══════════════════════════════════════════════════

async function apiLogin(email, password) {
  const res = await GUESTPOST('/api/auth/login', { email, password });
  if (res.ok) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }
  return res;
}

async function apiRegister(data) {
  const res = await GUESTPOST('/api/auth/register', data);
  if (res.ok) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  }
  return res;
}

async function apiLogout() {
  await POST('/api/auth/logout', {});
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function apiGetMe() {
  const res = await GET('/api/auth/me');
  if (res.ok) localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  return res;
}

// ══════════════════════════════════════════════════
// MASTERS API
// ══════════════════════════════════════════════════

async function apiGetMasters(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  return GET('/api/masters?' + params.toString());
}

async function apiGetMaster(id) {
  return GET('/api/masters/' + id);
}

async function apiUpdateMaster(id, data) {
  return PUT('/api/masters/' + id, data);
}

// ══════════════════════════════════════════════════
// ORDERS API
// ══════════════════════════════════════════════════

async function apiGetOrders(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  return GET('/api/orders?' + params.toString());
}

async function apiGetOrder(id) {
  return GET('/api/orders/' + id);
}

async function apiCreateOrder(data) {
  return POST('/api/orders', data);
}

async function apiUpdateOrder(id, data) {
  return PUT('/api/orders/' + id, data);
}

async function apiApplyToOrder(orderId, message = '') {
  return POST('/api/orders/' + orderId + '/apply', { message });
}

// ══════════════════════════════════════════════════
// REVIEWS API
// ══════════════════════════════════════════════════

async function apiGetReviews(masterId) {
  return GET('/api/reviews/' + masterId);
}

async function apiPostReview(data) {
  return POST('/api/reviews', data);
}

// ══════════════════════════════════════════════════
// ADMIN API
// ══════════════════════════════════════════════════

async function apiAdminGetUsers(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.set(k, v); });
  return GET('/api/admin/users?' + params.toString());
}

async function apiAdminUpdateUser(id, data) {
  return PUT('/api/admin/users/' + id, data);
}

async function apiAdminDeleteUser(id) {
  return DELETE('/api/admin/users/' + id);
}

async function apiAdminGetStats() {
  return GET('/api/admin/stats');
}

// toast (fallback if not defined)
if (typeof window !== 'undefined' && !window._toastDefined) {
  window._toastDefined = true;
}

console.log('[API] Slavic Shkaf API client loaded. Base:', API_BASE || '(same origin)');
