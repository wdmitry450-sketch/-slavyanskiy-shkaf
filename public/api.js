// API utility layer - connects frontend to Cloudflare Workers backend
const API_BASE = '/api';

const api = {
  token: null,

  init() {
    this.token = localStorage.getItem('ss_token');
  },

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('ss_token', token);
    else localStorage.removeItem('ss_token');
  },

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    try {
      const res = await fetch(`${API_BASE}/${path}`, { ...options, headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (e) {
      console.warn('API call failed:', path, e.message);
      return null;
    }
  },

  // Auth
  register: (body) => api.request('auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (email, password) => api.request('auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => api.request('auth/me'),

  // Orders
  getOrders: (params) => api.request(`orders?${new URLSearchParams(params)}`),
  getOrder: (id) => api.request(`orders/${id}`),
  createOrder: (body) => api.request('orders', { method: 'POST', body: JSON.stringify(body) }),
  updateOrder: (id, body) => api.request(`orders/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteOrder: (id) => api.request(`orders/${id}`, { method: 'DELETE' }),
  respondToOrder: (id, body) => api.request(`orders/${id}/respond`, { method: 'POST', body: JSON.stringify(body) }),
  getResponses: (id) => api.request(`orders/${id}/responses`),
  myResponses: () => api.request('my/responses'),

  // Masters
  getMasters: (params) => api.request(`masters?${new URLSearchParams(params)}`),

  // Profile
  getProfile: (id) => api.request(`profile/${id}`),
  updateProfile: (body) => api.request('profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Messages
  getMessages: (withUser) => api.request(`messages${withUser ? `?with=${withUser}` : ''}`),
  sendMessage: (body) => api.request('messages', { method: 'POST', body: JSON.stringify(body) }),

  // Calendar
  getCalendar: (month) => api.request(`calendar?month=${month}`),
  createEvent: (body) => api.request('calendar', { method: 'POST', body: JSON.stringify(body) }),

  // Reviews
  createReview: (body) => api.request('reviews', { method: 'POST', body: JSON.stringify(body) }),

  // Notifications
  getNotifications: (unread) => api.request(`notifications${unread ? '?unread=1' : ''}`),
  markNotificationsRead: (id) => api.request('notifications/read', { method: 'PUT', body: JSON.stringify(id ? { id } : {}) }),

  // Accept response / Complete order
  acceptResponse: (id) => api.request(`responses/${id}/accept`, { method: 'PUT' }),
  completeOrder: (id, body) => api.request(`orders/${id}/complete`, { method: 'POST', body: JSON.stringify(body || {}) }),

  // Telegram
  linkTelegram: (chatId) => api.request('telegram/link', { method: 'POST', body: JSON.stringify({ chat_id: chatId }) }),

  // Admin
  adminStats: () => api.request('admin/stats'),
  adminUsers: (params) => api.request(`admin/users?${new URLSearchParams(params)}`),
  adminUpdateUser: (id, body) => api.request(`admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  adminToggleTop: (id, body) => api.request(`admin/orders/${id}/top`, { method: 'PUT', body: JSON.stringify(body) }),
  adminBroadcast: (body) => api.request('admin/broadcast', { method: 'POST', body: JSON.stringify(body) }),
  adminBroadcasts: () => api.request('admin/broadcasts'),
};
