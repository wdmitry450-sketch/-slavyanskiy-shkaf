// Slavic Shkaf API — Cloudflare Pages Functions
// Catch-all route: /api/*

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function err(message, status = 400) {
  return json({ error: message }, status);
}

// Simple SHA-256 hash
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// JWT-like token (simple base64 encode for CF Workers)
async function createToken(payload, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${body}`));
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${header}.${body}.${signature}`;
}

async function verifyToken(token, secret) {
  try {
    const [header, body, signature] = token.split('.');
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('HMAC', key, Uint8Array.from(atob(signature), c => c.charCodeAt(0)), encoder.encode(`${header}.${body}`));
    if (!valid) return null;
    const payload = JSON.parse(atob(body));
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch { return null; }
}

async function getUser(request, env) {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload) return null;
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ? AND status = ?').bind(payload.id, 'active').first();
  return user;
}

// ===== NOTIFICATION HELPERS =====

async function createNotification(env, userId, type, title, message, linkType, linkId) {
  try {
    await env.DB.prepare(
      'INSERT INTO notifications (user_id, type, title, message, link_type, link_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, type, title, message, linkType || null, linkId || null).run();
  } catch(e) { /* notifications table may not exist yet */ }
}

async function sendTelegramNotification(env, userId, text) {
  try {
    const user = await env.DB.prepare('SELECT telegram_chat_id FROM users WHERE id = ?').bind(userId).first();
    if (!user?.telegram_chat_id) return;
    const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) return;
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: user.telegram_chat_id, text, parse_mode: 'HTML' }),
    });
  } catch(e) { /* silent fail */ }
}

async function notifyUser(env, userId, type, title, message, linkType, linkId) {
  await createNotification(env, userId, type, title, message, linkType, linkId);
  await sendTelegramNotification(env, userId, `🔔 <b>${title}</b>\n${message}`);
}

// ===== ROUTE HANDLERS =====

// POST /api/auth/register
async function handleRegister(request, env) {
  const body = await request.json();
  const { role, name, email, phone, password, country, city, postal_code, categories, native_language, additional_languages } = body;

  if (!name || !email || !password || !role) return err('Missing required fields');
  if (!['master', 'client'].includes(role)) return err('Invalid role');

  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return err('Email already registered');

  const hash = await hashPassword(password);
  const result = await env.DB.prepare(
    'INSERT INTO users (role, name, email, phone, password_hash, country, city, postal_code, native_language, additional_languages) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(role, name, email, phone || null, hash, country || null, city || null, postal_code || null, native_language || null, additional_languages ? JSON.stringify(additional_languages) : null).run();

  const userId = result.meta.last_row_id;

  // Insert categories for masters
  if (role === 'master' && categories?.length) {
    const stmt = env.DB.prepare('INSERT INTO user_categories (user_id, category_id) VALUES (?, ?)');
    await env.DB.batch(categories.map(cat => stmt.bind(userId, cat)));
  }

  const token = await createToken({ id: userId, role, email }, env.JWT_SECRET);
  const user = await env.DB.prepare('SELECT id, role, name, email, phone, country, city, status, is_premium, rating, reviews_count, created_at FROM users WHERE id = ?').bind(userId).first();

  return json({ token, user });
}

// POST /api/auth/login
async function handleLogin(request, env) {
  const { email, password } = await request.json();
  if (!email || !password) return err('Missing email or password');

  const hash = await hashPassword(password);
  const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND password_hash = ?').bind(email, hash).first();
  if (!user) return err('Invalid credentials', 401);
  if (user.status === 'blocked') return err('Account is blocked', 403);

  const token = await createToken({ id: user.id, role: user.role, email: user.email }, env.JWT_SECRET);

  // Get categories
  const cats = await env.DB.prepare('SELECT category_id FROM user_categories WHERE user_id = ?').bind(user.id).all();

  return json({
    token,
    user: {
      id: user.id, role: user.role, name: user.name, email: user.email,
      phone: user.phone, country: user.country, city: user.city,
      status: user.status, is_premium: user.is_premium,
      rating: user.rating, reviews_count: user.reviews_count,
      bio: user.bio, experience: user.experience, native_language: user.native_language, additional_languages: user.additional_languages ? JSON.parse(user.additional_languages) : [], avatar_url: user.avatar_url,
      categories: cats.results.map(c => c.category_id),
      created_at: user.created_at,
    }
  });
}

// GET /api/auth/me
async function handleMe(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);
  const cats = await env.DB.prepare('SELECT category_id FROM user_categories WHERE user_id = ?').bind(user.id).all();
  return json({
    id: user.id, role: user.role, name: user.name, email: user.email,
    phone: user.phone, country: user.country, city: user.city,
    status: user.status, is_premium: user.is_premium,
    rating: user.rating, reviews_count: user.reviews_count,
    bio: user.bio, experience: user.experience, native_language: user.native_language, additional_languages: user.additional_languages ? JSON.parse(user.additional_languages) : [], avatar_url: user.avatar_url,
    categories: cats.results.map(c => c.category_id),
    created_at: user.created_at,
  });
}

// GET /api/orders?status=open&category=plumbing&page=1&limit=20
async function handleGetOrders(request, env) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || 'open';
  const category = url.searchParams.get('category');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = 'SELECT o.*, u.name as client_name FROM orders o JOIN users u ON o.client_id = u.id WHERE 1=1';
  const params = [];

  if (status && status !== 'all') { query += ' AND o.status = ?'; params.push(status); }
  if (category && category !== 'all') { query += ' AND o.category_id = ?'; params.push(category); }

  query += ' ORDER BY o.is_top DESC, o.is_premium DESC, o.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const stmt = env.DB.prepare(query);
  const orders = await stmt.bind(...params).all();

  const countQuery = 'SELECT COUNT(*) as total FROM orders WHERE status = ?';
  const count = await env.DB.prepare(countQuery).bind(status || 'open').first();

  return json({ orders: orders.results, total: count.total, page, limit });
}

// POST /api/orders
async function handleCreateOrder(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);
  if (user.role !== 'client' && user.role !== 'admin') return err('Only clients can create orders', 403);

  const { category_id, title, description, budget, currency, deadline, location } = await request.json();
  if (!title || !category_id) return err('Title and category required');

  const result = await env.DB.prepare(
    'INSERT INTO orders (client_id, category_id, title, description, budget, currency, deadline, location, attachments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(user.id, category_id, title, description || null, budget || null, currency || '€', deadline || null, location || null, body.attachments ? JSON.stringify(body.attachments) : null).run();

  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(result.meta.last_row_id).first();
  return json(order, 201);
}

// GET /api/orders/:id
async function handleGetOrder(request, env, id) {
  const order = await env.DB.prepare(
    'SELECT o.*, u.name as client_name, u.city as client_city, u.country as client_country FROM orders o JOIN users u ON o.client_id = u.id WHERE o.id = ?'
  ).bind(id).first();
  if (!order) return err('Order not found', 404);

  // Increment views
  await env.DB.prepare('UPDATE orders SET views_count = views_count + 1 WHERE id = ?').bind(id).run();

  // Get responses count
  const resp = await env.DB.prepare('SELECT COUNT(*) as count FROM responses WHERE order_id = ?').bind(id).first();

  return json({ ...order, responses_count: resp.count });
}

// PUT /api/orders/:id
async function handleUpdateOrder(request, env, id) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  if (!order) return err('Order not found', 404);
  if (order.client_id !== user.id && user.role !== 'admin') return err('Forbidden', 403);

  const body = await request.json();
  const fields = ['title', 'description', 'budget', 'deadline', 'location', 'status', 'category_id'];
  const updates = [];
  const values = [];

  for (const f of fields) {
    if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); }
  }
  if (!updates.length) return err('No fields to update');

  updates.push("updated_at = datetime('now')");
  values.push(id);

  await env.DB.prepare(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  const updated = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  return json(updated);
}

// DELETE /api/orders/:id
async function handleDeleteOrder(request, env, id) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
  if (!order) return err('Order not found', 404);
  if (order.client_id !== user.id && user.role !== 'admin') return err('Forbidden', 403);

  await env.DB.prepare('DELETE FROM orders WHERE id = ?').bind(id).run();
  return json({ success: true });
}

// POST /api/orders/:id/respond
async function handleRespondToOrder(request, env, orderId) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);
  if (user.role !== 'master') return err('Only masters can respond', 403);

  const { message, proposed_budget, proposed_deadline } = await request.json();

  // Get order info
  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
  if (!order) return err('Order not found', 404);
  if (order.status !== 'open') return err('Order is not open', 400);

  try {
    await env.DB.prepare(
      'INSERT INTO responses (order_id, master_id, message, proposed_budget, proposed_deadline) VALUES (?, ?, ?, ?, ?)'
    ).bind(orderId, user.id, message || null, proposed_budget || null, proposed_deadline || null).run();

    await env.DB.prepare('UPDATE orders SET responses_count = responses_count + 1 WHERE id = ?').bind(orderId).run();

    // Notify client (non-blocking)
    try {
      await notifyUser(env, order.client_id, 'response',
        'Новый отклик на заказ',
        `Мастер ${user.name} откликнулся на "${order.title}"${proposed_budget ? '. Предложение: ' + proposed_budget + '€' : ''}`,
        'order', orderId
      );
    } catch(e) { /* notifications non-critical */ }

    return json({ success: true }, 201);
  } catch (e) {
    return err('Already responded to this order');
  }
}

// GET /api/orders/:id/responses
async function handleGetResponses(request, env, orderId) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const responses = await env.DB.prepare(
    `SELECT r.*, u.name as master_name, u.rating as master_rating, u.city as master_city, u.country as master_country
     FROM responses r JOIN users u ON r.master_id = u.id WHERE r.order_id = ? ORDER BY r.created_at DESC`
  ).bind(orderId).all();

  return json(responses.results);
}

// GET /api/my/responses (master's responses)
async function handleMyResponses(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const responses = await env.DB.prepare(
    `SELECT r.*, o.title as order_title, o.budget as order_budget, o.location as order_location, o.status as order_status
     FROM responses r JOIN orders o ON r.order_id = o.id WHERE r.master_id = ? ORDER BY r.created_at DESC`
  ).bind(user.id).all();

  return json(responses.results);
}

// GET /api/masters?category=plumbing&country=DE
async function handleGetMasters(request, env) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const country = url.searchParams.get('country');
  const search = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  let query = "SELECT DISTINCT u.id, u.name, u.city, u.country, u.rating, u.reviews_count, u.is_premium, u.experience, u.bio FROM users u";
  const params = [];
  const wheres = ["u.role = 'master'", "u.status = 'active'"];

  if (category && category !== 'all') {
    query += " JOIN user_categories uc ON u.id = uc.user_id";
    wheres.push("uc.category_id = ?");
    params.push(category);
  }

  if (country) { wheres.push("u.country = ?"); params.push(country); }
  if (search) { wheres.push("u.name LIKE ?"); params.push(`%${search}%`); }

  query += ` WHERE ${wheres.join(' AND ')} ORDER BY u.is_premium DESC, u.rating DESC LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const masters = await env.DB.prepare(query).bind(...params).all();

  // Get categories for each master
  const result = [];
  for (const m of masters.results) {
    const cats = await env.DB.prepare('SELECT category_id FROM user_categories WHERE user_id = ?').bind(m.id).all();
    result.push({ ...m, categories: cats.results.map(c => c.category_id) });
  }

  return json(result);
}

// GET /api/profile/:id
async function handleGetProfile(request, env, id) {
  const user = await env.DB.prepare(
    'SELECT id, role, name, email, phone, country, city, rating, reviews_count, is_premium, experience, bio, created_at FROM users WHERE id = ? AND status = ?'
  ).bind(id, 'active').first();
  if (!user) return err('User not found', 404);

  const cats = await env.DB.prepare('SELECT category_id FROM user_categories WHERE user_id = ?').bind(id).all();
  const reviews = await env.DB.prepare(
    'SELECT r.*, u.name as reviewer_name FROM reviews r JOIN users u ON r.reviewer_id = u.id WHERE r.target_id = ? ORDER BY r.created_at DESC LIMIT 10'
  ).bind(id).all();

  return json({ ...user, categories: cats.results.map(c => c.category_id), reviews: reviews.results });
}

// PUT /api/profile
async function handleUpdateProfile(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const body = await request.json();
  const fields = ['name', 'phone', 'city', 'country', 'postal_code', 'bio', 'experience', 'email', 'native_language', 'avatar_url'];
  const updates = [];
  const values = [];

  for (const f of fields) {
    if (body[f] !== undefined) { updates.push(`${f} = ?`); values.push(body[f]); }
  }

  if (body.additional_languages !== undefined) {
    updates.push('additional_languages = ?');
    values.push(JSON.stringify(body.additional_languages));
  }
  if (body.categories && user.role === 'master') {
    await env.DB.prepare('DELETE FROM user_categories WHERE user_id = ?').bind(user.id).run();
    const stmt = env.DB.prepare('INSERT INTO user_categories (user_id, category_id) VALUES (?, ?)');
    await env.DB.batch(body.categories.map(cat => stmt.bind(user.id, cat)));
  }

  if (updates.length) {
    updates.push("updated_at = datetime('now')");
    values.push(user.id);
    await env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  }

  return json({ success: true });
}

// POST /api/messages
async function handleSendMessage(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const { receiver_id, order_id, content, attachments } = await request.json();
  if (!receiver_id || (!content && !attachments)) return err('Receiver and content/attachment required');

  await env.DB.prepare(
    'INSERT INTO messages (sender_id, receiver_id, order_id, content, attachments) VALUES (?, ?, ?, ?, ?)'
  ).bind(user.id, receiver_id, order_id || null, content || '', attachments ? JSON.stringify(attachments) : null).run();

  // Notify receiver (non-blocking)
  try { await notifyUser(env, receiver_id, 'message',
    'Новое сообщение',
    `${user.name}: ${content.slice(0, 100)}${content.length > 100 ? '...' : ''}`,
    'chat', user.id
  ); } catch(e) { /* non-critical */ }

  return json({ success: true }, 201);
}

// GET /api/messages?with=userId
async function handleGetMessages(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const url = new URL(request.url);
  const withUser = url.searchParams.get('with');

  if (withUser) {
    const messages = await env.DB.prepare(
      `SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC`
    ).bind(user.id, withUser, withUser, user.id).all();

    // Mark as read
    await env.DB.prepare('UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?').bind(user.id, withUser).run();

    return json(messages.results);
  }

  // Get conversations list
  const conversations = await env.DB.prepare(`
    SELECT m.*, u.name as other_name, u.role as other_role,
    (SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND sender_id = m.other_id AND is_read = 0) as unread
    FROM (
      SELECT *, CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_id,
      ROW_NUMBER() OVER (PARTITION BY CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END ORDER BY created_at DESC) as rn
      FROM messages WHERE sender_id = ? OR receiver_id = ?
    ) m JOIN users u ON m.other_id = u.id WHERE m.rn = 1 ORDER BY m.created_at DESC
  `).bind(user.id, user.id, user.id, user.id, user.id).all();

  return json(conversations.results);
}

// ===== ADMIN ROUTES =====

// GET /api/admin/stats
async function handleAdminStats(request, env) {
  const user = await getUser(request, env);
  if (!user || user.role !== 'admin') return err('Forbidden', 403);

  const masters = await env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE role='master'").first();
  const clients = await env.DB.prepare("SELECT COUNT(*) as c FROM users WHERE role='client'").first();
  const orders = await env.DB.prepare("SELECT COUNT(*) as c FROM orders").first();
  const openOrders = await env.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE status='open'").first();
  const responses = await env.DB.prepare("SELECT COUNT(*) as c FROM responses").first();
  const premiumOrders = await env.DB.prepare("SELECT COUNT(*) as c FROM orders WHERE is_premium=1 OR is_top=1").first();

  // Weekly registrations
  const weekly = await env.DB.prepare(`
    SELECT DATE(created_at) as day, COUNT(*) as count FROM users
    WHERE created_at >= datetime('now', '-7 days') GROUP BY DATE(created_at) ORDER BY day
  `).all();

  // Top categories
  const topCats = await env.DB.prepare(`
    SELECT category_id, COUNT(*) as count FROM orders GROUP BY category_id ORDER BY count DESC LIMIT 10
  `).all();

  // Recent users
  const recentUsers = await env.DB.prepare(
    'SELECT id, name, email, role, country, status, created_at FROM users ORDER BY created_at DESC LIMIT 20'
  ).all();

  return json({
    masters: masters.c, clients: clients.c, orders: orders.c,
    open_orders: openOrders.c, responses: responses.c, premium_orders: premiumOrders.c,
    weekly_registrations: weekly.results,
    top_categories: topCats.results,
    recent_users: recentUsers.results,
  });
}

// GET /api/admin/users?role=master&status=active&page=1
async function handleAdminUsers(request, env) {
  const user = await getUser(request, env);
  if (!user || user.role !== 'admin') return err('Forbidden', 403);

  const url = new URL(request.url);
  const role = url.searchParams.get('role');
  const status = url.searchParams.get('status');
  const search = url.searchParams.get('search');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = 'SELECT id, name, email, role, country, city, status, is_premium, rating, reviews_count, created_at FROM users WHERE 1=1';
  const params = [];

  if (role && role !== 'all') { query += ' AND role = ?'; params.push(role); }
  if (status && status !== 'all') { query += ' AND status = ?'; params.push(status); }
  if (search) { query += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const users = await env.DB.prepare(query).bind(...params).all();
  return json(users.results);
}

// PUT /api/admin/users/:id
async function handleAdminUpdateUser(request, env, id) {
  const user = await getUser(request, env);
  if (!user || user.role !== 'admin') return err('Forbidden', 403);

  const body = await request.json();
  const updates = [];
  const values = [];

  if (body.status) { updates.push('status = ?'); values.push(body.status); }
  if (body.is_premium !== undefined) { updates.push('is_premium = ?'); values.push(body.is_premium ? 1 : 0); }
  if (body.role) { updates.push('role = ?'); values.push(body.role); }

  if (!updates.length) return err('No updates');

  values.push(id);
  await env.DB.prepare(`UPDATE users SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`).bind(...values).run();
  return json({ success: true });
}

// PUT /api/admin/orders/:id/top
async function handleAdminToggleTop(request, env, id) {
  const user = await getUser(request, env);
  if (!user || user.role !== 'admin') return err('Forbidden', 403);

  const body = await request.json();
  await env.DB.prepare('UPDATE orders SET is_top = ?, is_premium = ?, updated_at = datetime(\'now\') WHERE id = ?')
    .bind(body.is_top ? 1 : 0, body.is_premium ? 1 : 0, id).run();

  return json({ success: true });
}

// POST /api/admin/broadcast
async function handleBroadcast(request, env) {
  const user = await getUser(request, env);
  if (!user || user.role !== 'admin') return err('Forbidden', 403);

  const { target, message } = await request.json();
  if (!target || !message) return err('Target and message required');

  // Save broadcast record
  const result = await env.DB.prepare(
    'INSERT INTO broadcasts (admin_id, target, message) VALUES (?, ?, ?)'
  ).bind(user.id, target, message).run();

  const broadcastId = result.meta.last_row_id;

  // Get telegram chat IDs
  let userQuery = "SELECT telegram_chat_id FROM users WHERE telegram_chat_id IS NOT NULL AND status = 'active'";
  if (target === 'masters') userQuery += " AND role = 'master'";
  if (target === 'clients') userQuery += " AND role = 'client'";

  const users = await env.DB.prepare(userQuery).all();

  // Send via Telegram Bot API
  const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
  let sentCount = 0;

  for (const u of users.results) {
    if (!u.telegram_chat_id) continue;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: u.telegram_chat_id, text: message, parse_mode: 'HTML' }),
      });
      sentCount++;
    } catch (e) { /* skip failed */ }
  }

  await env.DB.prepare('UPDATE broadcasts SET sent_count = ?, status = ? WHERE id = ?')
    .bind(sentCount, 'sent', broadcastId).run();

  return json({ success: true, sent_count: sentCount, total_users: users.results.length });
}

// GET /api/admin/broadcasts
async function handleGetBroadcasts(request, env) {
  const user = await getUser(request, env);
  if (!user || user.role !== 'admin') return err('Forbidden', 403);

  const broadcasts = await env.DB.prepare(
    'SELECT * FROM broadcasts ORDER BY created_at DESC LIMIT 50'
  ).all();

  return json(broadcasts.results);
}

// POST /api/reviews
async function handleCreateReview(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const { order_id, target_id, rating, comment } = await request.json();
  if (!order_id || !target_id || !rating) return err('Missing fields');

  try {
    await env.DB.prepare(
      'INSERT INTO reviews (order_id, reviewer_id, target_id, rating, comment) VALUES (?, ?, ?, ?, ?)'
    ).bind(order_id, user.id, target_id, rating, comment || null).run();

    // Update user rating
    const avg = await env.DB.prepare('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE target_id = ?').bind(target_id).first();
    await env.DB.prepare('UPDATE users SET rating = ?, reviews_count = ? WHERE id = ?')
      .bind(Math.round(avg.avg * 10) / 10, avg.cnt, target_id).run();

    return json({ success: true }, 201);
  } catch {
    return err('Already reviewed');
  }
}

// POST /api/telegram/link (link telegram account)
async function handleTelegramLink(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const { chat_id } = await request.json();
  if (!chat_id) return err('chat_id required');

  await env.DB.prepare('UPDATE users SET telegram_chat_id = ? WHERE id = ?').bind(String(chat_id), user.id).run();
  return json({ success: true });
}

// ===== CALENDAR =====

// GET /api/calendar
async function handleGetCalendar(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const url = new URL(request.url);
  const month = url.searchParams.get('month') || new Date().toISOString().slice(0, 7);

  const events = await env.DB.prepare(
    "SELECT * FROM calendar_events WHERE user_id = ? AND event_date LIKE ? ORDER BY event_date"
  ).bind(user.id, `${month}%`).all();

  return json(events.results);
}

// POST /api/calendar
async function handleCreateEvent(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const { title, description, event_date, event_time, order_id } = await request.json();
  if (!title || !event_date) return err('Title and date required');

  await env.DB.prepare(
    'INSERT INTO calendar_events (user_id, order_id, title, description, event_date, event_time) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(user.id, order_id || null, title, description || null, event_date, event_time || null).run();

  return json({ success: true }, 201);
}

// ===== ROUTER =====

// PUT /api/responses/:id/accept — client accepts a master's response
async function handleAcceptResponse(request, env, responseId) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  try {
    const resp = await env.DB.prepare('SELECT r.*, o.client_id, o.title as order_title FROM responses r JOIN orders o ON r.order_id = o.id WHERE r.id = ?').bind(responseId).first();
    if (!resp) return err('Response not found', 404);
    if (resp.client_id !== user.id) return err('Only order owner can accept', 403);

    // Accept this response
    await env.DB.prepare("UPDATE responses SET status = 'accepted' WHERE id = ?").bind(responseId).run();
    // Reject others
    await env.DB.prepare("UPDATE responses SET status = 'rejected' WHERE order_id = ? AND id != ?").bind(resp.order_id, responseId).run();
    // Update order status
    await env.DB.prepare("UPDATE orders SET status = 'in_progress', updated_at = datetime('now') WHERE id = ?").bind(resp.order_id).run();

    // Notifications (non-blocking)
    try {
      await notifyUser(env, resp.master_id, 'accepted',
        'Вас выбрали!',
        `Заказчик ${user.name} выбрал вас для заказа "${resp.order_title}"`,
        'order', resp.order_id
      );
      const rejected = await env.DB.prepare("SELECT master_id FROM responses WHERE order_id = ? AND status = 'rejected'").bind(resp.order_id).all();
      for (const r of rejected.results) {
        await notifyUser(env, r.master_id, 'rejected', 'Заказ закрыт', `Заказ "${resp.order_title}" был закрыт — выбран другой мастер`, 'order', resp.order_id);
      }
    } catch(e) { /* notifications are non-critical */ }

    return json({ success: true });
  } catch(e) {
    return err('Accept failed: ' + e.message, 500);
  }
}

// POST /api/orders/:id/complete — mark order as completed + optional review
async function handleCompleteOrder(request, env, orderId) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
  if (!order) return err('Order not found', 404);
  if (order.client_id !== user.id) return err('Only owner can complete', 403);

  await env.DB.prepare("UPDATE orders SET status = 'completed', updated_at = datetime('now') WHERE id = ?").bind(orderId).run();

  const body = await request.json();

  // Find accepted master
  const accepted = await env.DB.prepare("SELECT master_id FROM responses WHERE order_id = ? AND status = 'accepted'").bind(orderId).first();

  if (accepted && body.rating) {
    // Save review
    try {
      await env.DB.prepare('INSERT INTO reviews (order_id, reviewer_id, target_id, rating, comment) VALUES (?, ?, ?, ?, ?)')
        .bind(orderId, user.id, accepted.master_id, body.rating, body.comment || null).run();
      const avg = await env.DB.prepare('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE target_id = ?').bind(accepted.master_id).first();
      await env.DB.prepare('UPDATE users SET rating = ?, reviews_count = ? WHERE id = ?').bind(Math.round(avg.avg * 10) / 10, avg.cnt, accepted.master_id).run();
    } catch(e) { /* already reviewed */ }

    // Notify master (non-blocking)
    try { await notifyUser(env, accepted.master_id, 'completed',
      'Заказ завершён!',
      `Заказ "${order.title}" завершён. ${body.rating ? 'Оценка: ' + '⭐'.repeat(body.rating) : ''}`,
      'order', orderId
    ); } catch(e) { /* non-critical */ }
  }

  return json({ success: true });
}

// GET /api/notifications
async function handleGetNotifications(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const url = new URL(request.url);
  const unreadOnly = url.searchParams.get('unread') === '1';

  let query = 'SELECT * FROM notifications WHERE user_id = ?';
  if (unreadOnly) query += ' AND is_read = 0';
  query += ' ORDER BY created_at DESC LIMIT 50';

  const notifs = await env.DB.prepare(query).bind(user.id).all();
  const unreadCount = await env.DB.prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0').bind(user.id).first();

  return json({ notifications: notifs.results, unread_count: unreadCount.c });
}

// PUT /api/notifications/read
async function handleMarkNotificationsRead(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);

  const body = await request.json();
  if (body.id) {
    await env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').bind(body.id, user.id).run();
  } else {
    await env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').bind(user.id).run();
  }
  return json({ success: true });
}

// ===== MEDIA UPLOAD =====

// POST /api/media/upload — upload a file (image/video)
async function handleMediaUpload(request, env) {
  const user = await getUser(request, env);
  if (!user) return err('Unauthorized', 401);
  if (!env.MEDIA) return err('Media storage not configured', 500);

  try {
    const body = await request.json();
    const { data, name, type, size } = body;
    if (!data) return err('No file data provided');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm', 'application/pdf'];
    if (!allowedTypes.includes(type)) return err('Unsupported file type');

    const isVideo = type.startsWith('video/');
    const isPDF = type === 'application/pdf';
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (size > maxSize) return err('File too large');

    const binaryStr = atob(data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    const ext = name?.split('.').pop() || (isVideo ? 'mp4' : isPDF ? 'pdf' : 'jpg');
    const filename = user.id + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    await env.MEDIA.put('chat/' + filename, bytes.buffer, {
      httpMetadata: { contentType: type },
    });

    return json({ url: '/api/media/' + filename, type: isVideo ? 'video' : isPDF ? 'pdf' : 'image', name: name || filename, size: size }, 201);
  } catch(e) {
    return err('Upload failed: ' + e.message, 500);
  }
}


// GET /api/media/:filename — serve a file
async function handleMediaServe(request, env, filename) {
  if (!env.MEDIA) return err('Media storage not configured', 500);
  try {
    const key = `chat/${filename}`;
    const object = await env.MEDIA.get(key);
    if (!object) return err('File not found', 404);

    const headers = new Headers(CORS_HEADERS);
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
  } catch(e) {
    return err('Failed to serve file', 500);
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  const method = request.method;

  try {
    // Auth routes
    if (path === 'auth/register' && method === 'POST') return handleRegister(request, env);
    if (path === 'auth/login' && method === 'POST') return handleLogin(request, env);
    if (path === 'auth/me' && method === 'GET') return handleMe(request, env);

    // Orders
    if (path === 'orders' && method === 'GET') return handleGetOrders(request, env);
    if (path === 'orders' && method === 'POST') return handleCreateOrder(request, env);

    const orderMatch = path.match(/^orders\/(\d+)$/);
    if (orderMatch && method === 'GET') return handleGetOrder(request, env, parseInt(orderMatch[1]));
    if (orderMatch && method === 'PUT') return handleUpdateOrder(request, env, parseInt(orderMatch[1]));
    if (orderMatch && method === 'DELETE') return handleDeleteOrder(request, env, parseInt(orderMatch[1]));

    const respondMatch = path.match(/^orders\/(\d+)\/respond$/);
    if (respondMatch && method === 'POST') return handleRespondToOrder(request, env, parseInt(respondMatch[1]));

    const responsesMatch = path.match(/^orders\/(\d+)\/responses$/);
    if (responsesMatch && method === 'GET') return handleGetResponses(request, env, parseInt(responsesMatch[1]));

    // My responses
    if (path === 'my/responses' && method === 'GET') return handleMyResponses(request, env);

    // Accept response
    const acceptMatch = path.match(/^responses\/(\d+)\/accept$/);
    if (acceptMatch && (method === 'PUT' || method === 'POST')) return handleAcceptResponse(request, env, parseInt(acceptMatch[1]));

    // Complete order
    const completeMatch = path.match(/^orders\/(\d+)\/complete$/);
    if (completeMatch && method === 'POST') return handleCompleteOrder(request, env, parseInt(completeMatch[1]));

    // Notifications
    if (path === 'notifications' && method === 'GET') return handleGetNotifications(request, env);
    if (path === 'notifications/read' && (method === 'PUT' || method === 'POST')) return handleMarkNotificationsRead(request, env);

    // Masters
    if (path === 'masters' && method === 'GET') return handleGetMasters(request, env);

    // Profile
    const profileMatch = path.match(/^profile\/(\d+)$/);
    if (profileMatch && method === 'GET') return handleGetProfile(request, env, parseInt(profileMatch[1]));
    if (path === 'profile' && (method === 'PUT' || method === 'POST')) return handleUpdateProfile(request, env);

    // Messages
    if (path === 'messages' && method === 'GET') return handleGetMessages(request, env);
    if (path === 'messages' && method === 'POST') return handleSendMessage(request, env);

    // Reviews
    if (path === 'reviews' && method === 'POST') return handleCreateReview(request, env);

    // Calendar
    if (path === 'calendar' && method === 'GET') return handleGetCalendar(request, env);
    if (path === 'calendar' && method === 'POST') return handleCreateEvent(request, env);

    // Telegram
    if (path === 'telegram/link' && method === 'POST') return handleTelegramLink(request, env);

    // Media
    if (path === 'media/upload' && method === 'POST') return handleMediaUpload(request, env);
    const mediaMatch = path.match(/^media\/(.+)$/);
    if (mediaMatch && method === 'GET') return handleMediaServe(request, env, mediaMatch[1]);

    // Admin routes
    if (path === 'admin/stats' && method === 'GET') return handleAdminStats(request, env);
    if (path === 'admin/users' && method === 'GET') return handleAdminUsers(request, env);

    const adminUserMatch = path.match(/^admin\/users\/(\d+)$/);
    if (adminUserMatch && (method === 'PUT' || method === 'POST')) return handleAdminUpdateUser(request, env, parseInt(adminUserMatch[1]));

    const adminTopMatch = path.match(/^admin\/orders\/(\d+)\/top$/);
    if (adminTopMatch && (method === 'PUT' || method === 'POST')) return handleAdminToggleTop(request, env, parseInt(adminTopMatch[1]));

    if (path === 'admin/broadcast' && method === 'POST') return handleBroadcast(request, env);
    if (path === 'admin/broadcasts' && method === 'GET') return handleGetBroadcasts(request, env);

    return err('Not found', 404);
  } catch (e) {
    return err(`Server error: ${e.message}`, 500);
  }
}
