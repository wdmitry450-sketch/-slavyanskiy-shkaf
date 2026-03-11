/* ═══════════════════════════════════════════════════════════════════════
   SHARED FUNCTIONS FOR DASHBOARD, CLIENT, ADMIN
   Копируй эти функции в конец <script> в каждый файл
   ═══════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────
// USERS & AUTH
// ─────────────────────────────────────────────────────────────────────

const USERS_KEY = 'ss_users';
const AUTH_KEY = 'ss_auth';
const TOKEN_KEY = 'ss_token';

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
};

const setUser = (u) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
  localStorage.setItem(TOKEN_KEY, u.id);
};

const clearUser = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const updateUser = (userId, data) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...data };
    saveUsers(users);
    return users[idx];
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────
// PROFILE FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

function editProfile() {
  const u = getUser();
  if (!u) return;

  const name = prompt('Имя:', u.name);
  if (!name) return;

  const phone = prompt('Телефон:', u.phone || '');
  const about = prompt('О себе:', u.about || '');

  updateUser(u.id, { name, phone, about });
  setUser(updateUser(u.id, { name, phone, about }));

  toast(t('msg.profile_updated'), 'ok');
  location.reload();
}

function saveProfile() {
  const u = getUser();
  if (!u) return;

  const name = document.getElementById('profile-name')?.value || u.name;
  const phone = document.getElementById('profile-phone')?.value || u.phone || '';
  const about = document.getElementById('profile-about')?.value || u.about || '';

  updateUser(u.id, { name, phone, about });
  setUser(updateUser(u.id, { name, phone, about }));

  toast(t('msg.profile_updated'), 'ok');
}

// ─────────────────────────────────────────────────────────────────────
// ORDERS & REQUESTS
// ─────────────────────────────────────────────────────────────────────

const ORDERS_KEY = 'ss_orders';

const getOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

function createOrder(title, desc, budget, cat, city, country) {
  const u = getUser();
  if (!u) return;

  const order = {
    id: 'o_' + Date.now(),
    clientId: u.id,
    title,
    description: desc,
    budget,
    category: cat,
    city,
    country,
    status: 'open',
    createdAt: new Date().toISOString(),
    responses: [],
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  toast(t('msg.order_created'), 'ok');
  return order;
}

function acceptOrder(orderId, masterId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'accepted';
  order.masterId = masterId;
  saveOrders(orders);

  toast(t('msg.order_accepted'), 'ok');
}

function rejectOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'rejected';
  saveOrders(orders);

  toast(t('msg.order_rejected'), 'ok');
}

function completeOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = 'completed';
  saveOrders(orders);

  toast('Заказ завершён', 'ok');
}

// ─────────────────────────────────────────────────────────────────────
// MESSAGES & CHAT
// ─────────────────────────────────────────────────────────────────────

const MESSAGES_KEY = 'ss_messages';

const getMessages = () => {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
  } catch {
    return [];
  }
};

const saveMessages = (msgs) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
};

function sendMessage(toId, text) {
  const u = getUser();
  if (!u) return;

  const msg = {
    id: 'm_' + Date.now(),
    fromId: u.id,
    toId,
    text,
    createdAt: new Date().toISOString(),
    read: false,
  };

  const messages = getMessages();
  messages.push(msg);
  saveMessages(messages);

  toast(t('msg.message_sent'), 'ok');
  return msg;
}

function getChat(userId1, userId2) {
  const messages = getMessages();
  return messages.filter(m =>
    (m.fromId === userId1 && m.toId === userId2) ||
    (m.fromId === userId2 && m.toId === userId1)
  );
}

// ─────────────────────────────────────────────────────────────────────
// ADMIN FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

function blockUser(userId) {
  updateUser(userId, { blocked: true });
  toast(t('msg.blocked'), 'ok');
}

function unblockUser(userId) {
  updateUser(userId, { blocked: false });
  toast(t('msg.unblocked'), 'ok');
}

function verifyUser(userId) {
  updateUser(userId, { verifStatus: 'approved', verifLevel: 3 });
  toast(t('msg.verified'), 'ok');
}

function sendBroadcast(recipients, message) {
  const users = getUsers();
  let targetUsers = [];

  if (recipients === 'all') {
    targetUsers = users.filter(u => !u.blocked);
  } else if (recipients === 'masters') {
    targetUsers = users.filter(u => u.role === 'master' && !u.blocked);
  } else if (recipients === 'clients') {
    targetUsers = users.filter(u => u.role === 'client' && !u.blocked);
  }

  const broadcastMsg = `
📢 ${message}
  `;

  // Send to Telegram
  targetUsers.forEach(u => {
    // В реальности здесь отправка через API в Telegram бот
    console.log(`[Broadcast to ${u.name}] ${broadcastMsg}`);
  });

  toast(`Рассылка отправлена ${targetUsers.length} пользователям`, 'ok');

  // Call API
  fetch('/api/broadcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipients, message }),
  }).catch(err => console.error('Broadcast error:', err));
}

// ─────────────────────────────────────────────────────────────────────
// MODAL WINDOWS
// ─────────────────────────────────────────────────────────────────────

function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = 'none';
  }
}

function closeAllModals() {
  document.querySelectorAll('[id$="-modal"]').forEach(m => {
    m.style.display = 'none';
  });
}

// Close on outside click
document.addEventListener('click', (e) => {
  if (e.target.classList?.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// ─────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────

const toast = (msg, type = 'ok') => {
  let el = document.getElementById('__toast');
  if (!el) {
    el = document.createElement('div');
    el.id = '__toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'toast toast-' + type;
  setTimeout(() => el.classList.add('show'), 10);
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3000);
};

// ─────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const u = getUser();
  if (!u) {
    location.href = 'login.html';
    return;
  }

  // Check role
  const path = window.location.pathname;
  if (path.includes('dashboard') && u.role !== 'master') {
    location.href = 'client.html';
  }
  if (path.includes('client') && u.role !== 'client' && u.role !== 'master') {
    location.href = 'dashboard.html';
  }
  if (path.includes('admin') && u.role !== 'admin') {
    location.href = 'index.html';
  }

  // Initialize translations
  if (window.i18n_init) {
    i18n_init();
  }
});

// ─────────────────────────────────────────────────────────────────────
// STYLES FOR MODALS & TOASTS
// ─────────────────────────────────────────────────────────────────────

const style = document.createElement('style');
style.textContent = `
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal.show {
  display: flex;
}

.modal-content {
  background: #0d1117;
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 14px 20px;
  border-radius: 8px;
  background: #0d1117;
  border: 1px solid rgba(255,255,255,.08);
  color: #fff;
  font-weight: 700;
  z-index: 2000;
  opacity: 0;
  transform: translateX(400px);
  transition: all 0.3s ease;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-ok {
  border-color: #00d68f;
  background: rgba(0,214,143,.1);
  color: #00d68f;
}

.toast-err {
  border-color: #ef4444;
  background: rgba(239,68,68,.1);
  color: #ef4444;
}

.toast-warn {
  border-color: #fbbf24;
  background: rgba(251,191,36,.1);
  color: #fbbf24;
}
`;
document.head.appendChild(style);
