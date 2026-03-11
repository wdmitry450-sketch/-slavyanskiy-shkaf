/* ═══════════════════════════════════════════════════════════════════════
   CLOUDFLARE WORKERS API
   D1 Database + Telegram Bot Integration
   ═══════════════════════════════════════════════════════════════════════ */

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8727088510:AAENV-aXP7HTGmmR1pn4UCltWOsy7SSeCYk';
const TELEGRAM_API = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN;

// ═══════════════════════════════════════════════════════════════════════
// HANDLERS
// ═══════════════════════════════════════════════════════════════════════

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response('OK', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    try {
      // USER REGISTRATION
      if (path === '/api/register' && request.method === 'POST') {
        return await handleRegister(request, env, corsHeaders);
      }

      // USER LOGIN
      if (path === '/api/login' && request.method === 'POST') {
        return await handleLogin(request, env, corsHeaders);
      }

      // GET USERS
      if (path === '/api/users' && request.method === 'GET') {
        return await handleGetUsers(request, env, corsHeaders);
      }

      // UPDATE USER
      if (path.startsWith('/api/users/') && request.method === 'PUT') {
        return await handleUpdateUser(request, env, corsHeaders);
      }

      // CREATE ORDER
      if (path === '/api/orders' && request.method === 'POST') {
        return await handleCreateOrder(request, env, corsHeaders);
      }

      // GET ORDERS
      if (path === '/api/orders' && request.method === 'GET') {
        return await handleGetOrders(request, env, corsHeaders);
      }

      // SEND MESSAGE (CHAT)
      if (path === '/api/messages' && request.method === 'POST') {
        return await handleSendMessage(request, env, corsHeaders);
      }

      // BROADCAST MESSAGE
      if (path === '/api/broadcast' && request.method === 'POST') {
        return await handleBroadcast(request, env, corsHeaders);
      }

      // SEND TO TELEGRAM BOT
      if (path === '/api/telegram/send' && request.method === 'POST') {
        return await handleTelegramSend(request, corsHeaders);
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

// ═══════════════════════════════════════════════════════════════════════
// HANDLERS IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════

async function handleRegister(request, env, corsHeaders) {
  const data = await request.json();

  // Validate
  if (!data.email || !data.password || !data.name) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    // Check if email exists
    const existing = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(data.email).first();

    if (existing) {
      return new Response(JSON.stringify({ ok: false, error: 'Email already exists' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Create user
    const userId = 'u_' + Date.now();
    const result = await env.DB.prepare(`
      INSERT INTO users (id, email, password, name, phone, country, city, postalCode, role, createdAt, verifStatus, verifLevel, blocked)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `).bind(
      userId,
      data.email,
      data.password,
      data.name,
      data.phone || '',
      data.country || '',
      data.city || '',
      data.postalCode || '',
      data.role || 'client',
      new Date().toISOString(),
      'pending',
      0
    ).run();

    const user = {
      id: userId,
      email: data.email,
      name: data.name,
      role: data.role || 'client',
    };

    // Send registration notification to Telegram
    const msg = `
✅ Новый пользователь зарегистрирован!

👤 Имя: ${data.name}
📧 Email: ${data.email}
🏠 Роль: ${data.role === 'master' ? 'Мастер' : 'Заказчик'}
📍 Страна: ${data.country || 'Не указана'}
🏙️ Город: ${data.city || 'Не указан'}
⏰ Время: ${new Date().toLocaleString('ru-RU')}
    `;

    await sendTelegramMessage(msg, corsHeaders);

    return new Response(JSON.stringify({ ok: true, user }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleLogin(request, env, corsHeaders) {
  const { email, password } = await request.json();

  try {
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ? AND password = ?'
    ).bind(email, password).first();

    if (!user) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid credentials' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    if (user.blocked) {
      return new Response(JSON.stringify({ ok: false, error: 'Account blocked' }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true, user }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleGetUsers(request, env, corsHeaders) {
  try {
    const users = await env.DB.prepare('SELECT * FROM users').all();
    return new Response(JSON.stringify(users.results || []), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleUpdateUser(request, env, corsHeaders) {
  const userId = new URL(request.url).pathname.split('/').pop();
  const data = await request.json();

  try {
    const fields = [];
    const values = [];

    if (data.name) { fields.push('name = ?'); values.push(data.name); }
    if (data.phone) { fields.push('phone = ?'); values.push(data.phone); }
    if (data.country) { fields.push('country = ?'); values.push(data.country); }
    if (data.city) { fields.push('city = ?'); values.push(data.city); }
    if (data.about) { fields.push('about = ?'); values.push(data.about); }
    if (data.blocked !== undefined) { fields.push('blocked = ?'); values.push(data.blocked ? 1 : 0); }
    if (data.verifStatus) { fields.push('verifStatus = ?'); values.push(data.verifStatus); }

    if (fields.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'No fields to update' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    values.push(userId);
    await env.DB.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();

    return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleCreateOrder(request, env, corsHeaders) {
  const data = await request.json();

  try {
    const orderId = 'o_' + Date.now();
    await env.DB.prepare(`
      INSERT INTO orders (id, clientId, title, description, budget, category, city, country, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?)
    `).bind(
      orderId,
      data.clientId,
      data.title,
      data.description,
      data.budget || 0,
      data.category || '',
      data.city || '',
      data.country || '',
      new Date().toISOString()
    ).run();

    return new Response(JSON.stringify({ ok: true, orderId }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleGetOrders(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const clientId = url.searchParams.get('clientId');

    let query = 'SELECT * FROM orders';
    if (clientId) {
      query += ` WHERE clientId = '${clientId}'`;
    }
    query += ' ORDER BY createdAt DESC';

    const orders = await env.DB.prepare(query).all();
    return new Response(JSON.stringify(orders.results || []), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleSendMessage(request, env, corsHeaders) {
  const data = await request.json();

  try {
    const messageId = 'm_' + Date.now();
    await env.DB.prepare(`
      INSERT INTO messages (id, fromId, toId, text, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      messageId,
      data.fromId,
      data.toId,
      data.text,
      new Date().toISOString()
    ).run();

    return new Response(JSON.stringify({ ok: true, messageId }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleBroadcast(request, env, corsHeaders) {
  const { recipients, message } = await request.json();

  try {
    let users = [];

    if (recipients === 'all') {
      const result = await env.DB.prepare('SELECT id FROM users WHERE blocked = 0').all();
      users = result.results || [];
    } else if (recipients === 'masters') {
      const result = await env.DB.prepare("SELECT id FROM users WHERE role = 'master' AND blocked = 0").all();
      users = result.results || [];
    } else if (recipients === 'clients') {
      const result = await env.DB.prepare("SELECT id FROM users WHERE role = 'client' AND blocked = 0").all();
      users = result.results || [];
    }

    // Send to each user via Telegram
    const msg = `
📢 Сообщение от администратора:

${message}
    `;

    for (const user of users) {
      await sendTelegramMessage(msg, corsHeaders);
    }

    return new Response(JSON.stringify({ ok: true, sent: users.length }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

async function handleTelegramSend(request, corsHeaders) {
  const { message, userId } = await request.json();

  try {
    const result = await sendTelegramMessage(message, corsHeaders, userId);
    return new Response(JSON.stringify({ ok: true, result }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

async function sendTelegramMessage(message, corsHeaders, userId = null) {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: userId || '1234567890', // Replace with actual user ID or group ID
        text: message,
        parse_mode: 'HTML',
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Telegram error:', error);
    return { ok: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════
// DATABASE SCHEMA (execute once)
// ═══════════════════════════════════════════════════════════════════════

/*
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  city TEXT,
  postalCode TEXT,
  role TEXT DEFAULT 'client',
  about TEXT,
  avatar TEXT,
  createdAt TEXT,
  verifStatus TEXT DEFAULT 'pending',
  verifLevel INTEGER DEFAULT 0,
  blocked INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  clientId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  budget REAL,
  category TEXT,
  city TEXT,
  country TEXT,
  status TEXT DEFAULT 'open',
  createdAt TEXT,
  FOREIGN KEY (clientId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  fromId TEXT NOT NULL,
  toId TEXT NOT NULL,
  text TEXT,
  createdAt TEXT,
  FOREIGN KEY (fromId) REFERENCES users(id),
  FOREIGN KEY (toId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  user1Id TEXT NOT NULL,
  user2Id TEXT NOT NULL,
  lastMessage TEXT,
  lastMessageTime TEXT,
  FOREIGN KEY (user1Id) REFERENCES users(id),
  FOREIGN KEY (user2Id) REFERENCES users(id)
);
*/
