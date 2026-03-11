-- Slavic Shkaf Database Schema
-- Cloudflare D1 (SQLite)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK(role IN ('master', 'client', 'admin')),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  country TEXT,
  city TEXT,
  postal_code TEXT,
  avatar_url TEXT,
  bio TEXT,
  experience TEXT,
  telegram_chat_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'blocked', 'pending')),
  is_premium INTEGER NOT NULL DEFAULT 0,
  premium_until TEXT,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- User categories (many-to-many)
CREATE TABLE IF NOT EXISTS user_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, category_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  category_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  budget REAL,
  currency TEXT DEFAULT '€',
  deadline TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
  is_premium INTEGER NOT NULL DEFAULT 0,
  is_top INTEGER NOT NULL DEFAULT 0,
  top_until TEXT,
  views_count INTEGER DEFAULT 0,
  responses_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Responses (master applies to order)
CREATE TABLE IF NOT EXISTS responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  master_id INTEGER NOT NULL,
  message TEXT,
  proposed_budget REAL,
  proposed_deadline TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (master_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(order_id, master_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  order_id INTEGER,
  content TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  target_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(order_id, reviewer_id)
);

-- Documents (master licenses etc)
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  doc_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Calendar events
CREATE TABLE IF NOT EXISTS calendar_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  order_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,
  event_time TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Broadcasts log
CREATE TABLE IF NOT EXISTS broadcasts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_id INTEGER NOT NULL,
  target TEXT NOT NULL CHECK(target IN ('all', 'masters', 'clients')),
  message TEXT NOT NULL,
  sent_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'sending', 'sent', 'failed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports / complaints
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reporter_id INTEGER NOT NULL,
  target_user_id INTEGER,
  target_order_id INTEGER,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'reviewed', 'resolved')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table for JWT refresh
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_category ON orders(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_premium ON orders(is_premium, is_top);
CREATE INDEX IF NOT EXISTS idx_responses_order ON responses(order_id);
CREATE INDEX IF NOT EXISTS idx_responses_master ON responses(master_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_categories ON user_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_user ON calendar_events(user_id, event_date);

-- Seed admin user (password: admin123)
INSERT OR IGNORE INTO users (id, role, name, email, password_hash, country, status)
VALUES (1, 'admin', 'Admin', 'admin@slavicshkaf.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'DE', 'active');
