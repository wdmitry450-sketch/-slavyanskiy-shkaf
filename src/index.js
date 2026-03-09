/**
 * Slavic Shkaf — Cloudflare Worker API
 * 
 * Routes:
 *   POST   /api/auth/login
 *   POST   /api/auth/register
 *   POST   /api/auth/logout
 *   GET    /api/auth/me
 *
 *   GET    /api/masters          — list (with filters)
 *   GET    /api/masters/:id      — profile + reviews
 *   PUT    /api/masters/:id      — update own profile
 *
 *   GET    /api/orders           — list (filtered)
 *   POST   /api/orders           — create order (client)
 *   GET    /api/orders/:id       — order detail
 *   PUT    /api/orders/:id       — update status
 *   POST   /api/orders/:id/apply — master applies
 *
 *   GET    /api/reviews/:masterId
 *   POST   /api/reviews          — leave review
 *
 *   --- Admin only ---
 *   GET    /api/admin/users      — all users
 *   PUT    /api/admin/users/:id  — edit any user (verif, sub, top, block)
 *   DELETE /api/admin/users/:id  — delete user
 *   PUT    /api/admin/orders/:id — change order status
 *
 * Auth: Bearer token in Authorization header
 * Token stored in D1 sessions table (no JWT library needed)
 */

// ── CORS helper ──
function cors(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = env.ALLOWED_ORIGIN || '*';
  const isAllowed = allowed === '*' || origin === allowed || origin.endsWith('.pages.dev');
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin || '*' : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

function err(msg, status = 400, corsHeaders = {}) {
  return json({ ok: false, error: msg }, status, corsHeaders);
}

function ok(data = {}, corsHeaders = {}) {
  return json({ ok: true, ...data }, 200, corsHeaders);
}

// ── Token auth ──
function makeToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

async function getSession(request, db) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  const row = await db.prepare(
    `SELECT s.user_id, u.role, u.name, u.email, u.blocked
     FROM sessions s JOIN users u ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > datetime('now')`
  ).bind(token).first();
  if (!row || row.blocked) return null;
  return row;
}

function requireRole(session, ...roles) {
  if (!session) return 'Unauthorized';
  if (roles.length && !roles.includes(session.role)) return 'Forbidden';
  return null;
}

// ── ID generator ──
function genId(prefix = 'u') {
  return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ── Main handler ──
export default {
  async fetch(request, env) {
    const C = cors(request, env);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: C });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');
    const method = request.method;
    const db = env.DB;

    // Route to handler
    try {
      return await route(request, method, path, url, db, env, C);
    } catch (e) {
      console.error(e);
      return err('Internal server error: ' + e.message, 500, C);
    }
  }
};

async function route(request, method, path, url, db, env, C) {

  // ════ AUTH ════
  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = await request.json();
    if (!email || !password) return err('Email and password required', 400, C);

    const user = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND password = ? AND blocked = 0'
    ).bind(email.toLowerCase().trim(), password).first();

    if (!user) return err('Invalid email or password', 401, C);

    const token = makeToken();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    await db.prepare(
      'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)'
    ).bind(token, user.id, expires).run();

    const userData = safeUser(user);
    return ok({ token, user: userData }, C);
  }

  if (path === '/api/auth/register' && method === 'POST') {
    const body = await request.json();
    const { email, password, name, role, phone, country, city, zip, cats, skills, telegram } = body;

    if (!email || !password || !name || !role) return err('Required fields missing', 400, C);
    if (!['master', 'client'].includes(role)) return err('Invalid role', 400, C);
    if (password.length < 6) return err('Password too short', 400, C);

    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first();
    if (existing) return err('Email already in use', 409, C);

    const id = genId(role === 'master' ? 'm' : 'c');
    await db.prepare(`
      INSERT INTO users (id, email, password, role, name, phone, telegram, country, city, zip, cats, skills)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id, email.toLowerCase().trim(), password, role, name,
      phone || null, telegram || null, country || null, city || null, zip || null,
      JSON.stringify(cats || []),
      JSON.stringify(skills || [])
    ).run();

    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    const token = makeToken();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').bind(token, id, expires).run();

    return ok({ token, user: safeUser(user) }, C);
  }

  if (path === '/api/auth/logout' && method === 'POST') {
    const auth = request.headers.get('Authorization') || '';
    const token = auth.replace('Bearer ', '').trim();
    if (token) await db.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run();
    return ok({}, C);
  }

  if (path === '/api/auth/me' && method === 'GET') {
    const session = await getSession(request, db);
    if (!session) return err('Unauthorized', 401, C);
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(session.user_id).first();
    return ok({ user: safeUser(user) }, C);
  }

  // ════ MASTERS ════
  if (path === '/api/masters' && method === 'GET') {
    const q = url.searchParams.get('q') || '';
    const cat = url.searchParams.get('cat') || '';
    const country = url.searchParams.get('country') || '';
    const city = url.searchParams.get('city') || '';
    const online = url.searchParams.get('online') || '';
    const sort = url.searchParams.get('sort') || 'top';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let conditions = ["role = 'master'", 'blocked = 0'];
    const bindings = [];

    if (q) {
      conditions.push("(name LIKE ? OR skills LIKE ?)");
      bindings.push(`%${q}%`, `%${q}%`);
    }
    if (cat) {
      conditions.push("cats LIKE ?");
      bindings.push(`%"${cat}"%`);
    }
    if (country) { conditions.push("country = ?"); bindings.push(country); }
    if (city) { conditions.push("city = ?"); bindings.push(city); }
    if (online === '1') { conditions.push("online = 1"); }

    const orderMap = {
      top: '(top_city + top_country) DESC, rate DESC',
      rate: 'rate DESC',
      price_asc: 'price ASC',
      price_desc: 'price DESC',
      reviews: 'reviews_count DESC',
    };
    const orderBy = orderMap[sort] || orderMap.top;

    const where = conditions.join(' AND ');
    const masters = await db.prepare(
      `SELECT * FROM users WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`
    ).bind(...bindings, limit, offset).all();

    return ok({ masters: masters.results.map(safeUser) }, C);
  }

  const masterMatch = path.match(/^\/api\/masters\/([^/]+)$/);
  if (masterMatch && method === 'GET') {
    const id = masterMatch[1];
    const master = await db.prepare('SELECT * FROM users WHERE id = ? AND role = ?').bind(id, 'master').first();
    if (!master) return err('Master not found', 404, C);

    const reviews = await db.prepare(
      'SELECT * FROM reviews WHERE master_id = ? ORDER BY created_at DESC LIMIT 20'
    ).bind(id).all();

    return ok({ master: safeUser(master), reviews: reviews.results }, C);
  }

  if (masterMatch && method === 'PUT') {
    const session = await getSession(request, db);
    if (!session) return err('Unauthorized', 401, C);
    const id = masterMatch[1];
    if (session.user_id !== id && session.role !== 'admin') return err('Forbidden', 403, C);

    const body = await request.json();
    const allowed = ['name','phone','telegram','country','city','zip','about','price','experience','cats','skills','avatar','online'];
    const updates = {};
    for (const k of allowed) {
      if (body[k] !== undefined) {
        updates[k] = Array.isArray(body[k]) ? JSON.stringify(body[k]) : body[k];
      }
    }
    if (Object.keys(updates).length === 0) return err('Nothing to update', 400, C);

    updates.updated_at = new Date().toISOString();
    const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    await db.prepare(`UPDATE users SET ${sets} WHERE id = ?`).bind(...Object.values(updates), id).run();

    const updated = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return ok({ user: safeUser(updated) }, C);
  }

  // ════ ORDERS ════
  if (path === '/api/orders' && method === 'GET') {
    const status = url.searchParams.get('status') || '';
    const country = url.searchParams.get('country') || '';
    const cat = url.searchParams.get('cat') || '';
    const clientId = url.searchParams.get('client_id') || '';
    const q = url.searchParams.get('q') || '';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let conditions = ['1=1'];
    const bindings = [];

    if (status) { conditions.push("o.status = ?"); bindings.push(status); }
    if (country) { conditions.push("o.country = ?"); bindings.push(country); }
    if (cat) { conditions.push("o.category = ?"); bindings.push(cat); }
    if (clientId) { conditions.push("o.client_id = ?"); bindings.push(clientId); }
    if (q) { conditions.push("o.title LIKE ?"); bindings.push(`%${q}%`); }

    const where = conditions.join(' AND ');
    const rows = await db.prepare(`
      SELECT o.*, 
        (SELECT COUNT(*) FROM order_responses r WHERE r.order_id = o.id) as responses_count
      FROM orders o
      WHERE ${where}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...bindings, limit, offset).all();

    return ok({ orders: rows.results }, C);
  }

  if (path === '/api/orders' && method === 'POST') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'client', 'admin');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const { title, description, category, country, city, zip, budget } = await request.json();
    if (!title || !category || !country || !city || !budget) return err('Required fields missing', 400, C);

    const result = await db.prepare(`
      INSERT INTO orders (client_id, client_name, title, description, category, country, city, zip, budget)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      session.user_id, session.name, title, description || null,
      category, country, city, zip || null, parseInt(budget)
    ).run();

    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(result.meta.last_row_id).first();
    return ok({ order }, C);
  }

  const orderMatch = path.match(/^\/api\/orders\/(\d+)$/);
  if (orderMatch && method === 'GET') {
    const id = orderMatch[1];
    const order = await db.prepare(`
      SELECT o.*, (SELECT COUNT(*) FROM order_responses r WHERE r.order_id = o.id) as responses_count
      FROM orders o WHERE o.id = ?
    `).bind(id).first();
    if (!order) return err('Order not found', 404, C);

    const responses = await db.prepare(`
      SELECT r.*, u.name, u.avatar, u.rate, u.city, u.country, u.verif_level, u.top_city, u.top_country
      FROM order_responses r
      JOIN users u ON r.master_id = u.id
      WHERE r.order_id = ?
    `).bind(id).all();

    return ok({ order, responses: responses.results }, C);
  }

  if (orderMatch && method === 'PUT') {
    const session = await getSession(request, db);
    if (!session) return err('Unauthorized', 401, C);
    const id = orderMatch[1];

    const order = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
    if (!order) return err('Not found', 404, C);
    if (order.client_id !== session.user_id && session.role !== 'admin') return err('Forbidden', 403, C);

    const body = await request.json();
    const allowed = ['status', 'title', 'description', 'budget'];
    const updates = {};
    for (const k of allowed) if (body[k] !== undefined) updates[k] = body[k];
    updates.updated_at = new Date().toISOString();

    const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    await db.prepare(`UPDATE orders SET ${sets} WHERE id = ?`).bind(...Object.values(updates), id).run();

    const updated = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first();
    return ok({ order: updated }, C);
  }

  // Apply to order
  const applyMatch = path.match(/^\/api\/orders\/(\d+)\/apply$/);
  if (applyMatch && method === 'POST') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'master');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const orderId = applyMatch[1];
    const body = await request.json().catch(() => ({}));
    const message = body.message || null;

    try {
      await db.prepare(
        'INSERT INTO order_responses (order_id, master_id, message) VALUES (?, ?, ?)'
      ).bind(orderId, session.user_id, message).run();
    } catch (e) {
      if (e.message.includes('UNIQUE')) return err('Already applied', 409, C);
      throw e;
    }

    return ok({ applied: true }, C);
  }

  // ════ REVIEWS ════
  const reviewsMatch = path.match(/^\/api\/reviews\/([^/]+)$/);
  if (reviewsMatch && method === 'GET') {
    const masterId = reviewsMatch[1];
    const reviews = await db.prepare(
      'SELECT * FROM reviews WHERE master_id = ? ORDER BY created_at DESC'
    ).bind(masterId).all();
    return ok({ reviews: reviews.results }, C);
  }

  if (path === '/api/reviews' && method === 'POST') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'client');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const { master_id, rating, text, order_id } = await request.json();
    if (!master_id || !rating) return err('master_id and rating required', 400, C);
    if (rating < 1 || rating > 5) return err('Rating 1-5', 400, C);

    await db.prepare(
      'INSERT INTO reviews (master_id, client_id, client_name, order_id, rating, text) VALUES (?,?,?,?,?,?)'
    ).bind(master_id, session.user_id, session.name, order_id || null, rating, text || null).run();

    // Update master avg rating
    const stats = await db.prepare(
      'SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE master_id = ?'
    ).bind(master_id).first();
    await db.prepare(
      'UPDATE users SET rate = ?, reviews_count = ? WHERE id = ?'
    ).bind(Math.round(stats.avg * 10) / 10, stats.cnt, master_id).run();

    return ok({ reviewed: true }, C);
  }

  // ════ ADMIN ════
  if (path === '/api/admin/users' && method === 'GET') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'admin');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const role = url.searchParams.get('role') || '';
    const q = url.searchParams.get('q') || '';
    const country = url.searchParams.get('country') || '';
    const top = url.searchParams.get('top') || '';
    const verif = url.searchParams.get('verif') || '';
    const sub = url.searchParams.get('sub') || '';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);

    let conditions = ["role != 'admin'"];
    const bindings = [];

    if (role) { conditions.push("role = ?"); bindings.push(role); }
    if (q) { conditions.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)"); bindings.push(`%${q}%`,`%${q}%`,`%${q}%`); }
    if (country) { conditions.push("country = ?"); bindings.push(country); }
    if (top === 'city') { conditions.push("top_city = 1"); }
    if (top === 'country') { conditions.push("top_country = 1"); }
    if (verif === 'ok') { conditions.push("verif_level >= 1"); }
    if (verif === 'no') { conditions.push("verif_level = 0"); }
    if (sub === '1') { conditions.push("has_sub = 1"); }
    if (sub === '0') { conditions.push("has_sub = 0"); }

    const where = conditions.join(' AND ');
    const users = await db.prepare(
      `SELECT * FROM users WHERE ${where} ORDER BY created_at DESC LIMIT ?`
    ).bind(...bindings, limit).all();

    return ok({ users: users.results.map(safeUser) }, C);
  }

  const adminUserMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (adminUserMatch && method === 'PUT') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'admin');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const id = adminUserMatch[1];
    const body = await request.json();

    // Admin can update these fields
    const allowed = [
      'name','email','phone','telegram','country','city','price','experience',
      'verif_level','verif_status','has_sub','sub_expiry',
      'top_city','top_country','blocked','cats','skills','rate','avatar'
    ];
    const updates = {};
    for (const k of allowed) {
      if (body[k] !== undefined) {
        updates[k] = Array.isArray(body[k]) ? JSON.stringify(body[k]) : body[k];
      }
    }
    if (Object.keys(updates).length === 0) return err('Nothing to update', 400, C);

    // Map boolean-like fields
    if (updates.top_city !== undefined) updates.top_city = updates.top_city ? 1 : 0;
    if (updates.top_country !== undefined) updates.top_country = updates.top_country ? 1 : 0;
    if (updates.blocked !== undefined) updates.blocked = updates.blocked ? 1 : 0;
    if (updates.has_sub !== undefined) updates.has_sub = updates.has_sub ? 1 : 0;

    updates.updated_at = new Date().toISOString();
    const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    await db.prepare(`UPDATE users SET ${sets} WHERE id = ?`).bind(...Object.values(updates), id).run();

    const updated = await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return ok({ user: safeUser(updated) }, C);
  }

  if (adminUserMatch && method === 'DELETE') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'admin');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const id = adminUserMatch[1];
    await db.prepare('DELETE FROM sessions WHERE user_id = ?').bind(id).run();
    await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
    return ok({ deleted: true }, C);
  }

  const adminOrderMatch = path.match(/^\/api\/admin\/orders\/(\d+)$/);
  if (adminOrderMatch && method === 'PUT') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'admin');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const id = adminOrderMatch[1];
    const { status } = await request.json();
    await db.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').bind(status, new Date().toISOString(), id).run();
    return ok({}, C);
  }

  // ════ STATS (admin) ════
  if (path === '/api/admin/stats' && method === 'GET') {
    const session = await getSession(request, db);
    const authErr = requireRole(session, 'admin');
    if (authErr) return err(authErr, authErr === 'Unauthorized' ? 401 : 403, C);

    const [masters, clients, orders, completed, online, pro] = await Promise.all([
      db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'master'").first(),
      db.prepare("SELECT COUNT(*) as n FROM users WHERE role = 'client'").first(),
      db.prepare("SELECT COUNT(*) as n FROM orders").first(),
      db.prepare("SELECT COUNT(*) as n FROM orders WHERE status = 'completed'").first(),
      db.prepare("SELECT COUNT(*) as n FROM users WHERE online = 1").first(),
      db.prepare("SELECT COUNT(*) as n FROM users WHERE has_sub = 1").first(),
    ]);

    return ok({
      masters: masters.n, clients: clients.n,
      orders: orders.n, completed: completed.n,
      online: online.n, pro: pro.n
    }, C);
  }

  // ── 404 ──
  return err('Not found', 404, C);
}

// Strip password and internal fields from user object
function safeUser(u) {
  if (!u) return null;
  const { password, ...rest } = u;

  // Parse JSON fields
  if (typeof rest.cats === 'string') {
    try { rest.cats = JSON.parse(rest.cats); } catch { rest.cats = []; }
  }
  if (typeof rest.skills === 'string') {
    try { rest.skills = JSON.parse(rest.skills); } catch { rest.skills = []; }
  }

  // Convert SQLite integers to booleans
  rest.online = !!rest.online;
  rest.blocked = !!rest.blocked;
  rest.has_sub = !!rest.has_sub;
  rest.top_city = !!rest.top_city;
  rest.top_country = !!rest.top_country;

  return rest;
}
