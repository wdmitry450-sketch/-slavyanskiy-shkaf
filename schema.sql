-- ═══════════════════════════════════════════════
-- Slavic Shkaf — D1 Database Schema
-- Run: wrangler d1 execute slavic-shkaf-db --file=schema.sql
-- ═══════════════════════════════════════════════

-- Users (masters + clients)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('master','client','admin')),
  name TEXT,
  phone TEXT,
  telegram TEXT,
  country TEXT,
  city TEXT,
  zip TEXT,
  about TEXT,
  avatar TEXT DEFAULT '👤',
  -- Master fields
  cats TEXT DEFAULT '[]',        -- JSON array of category IDs
  skills TEXT DEFAULT '[]',      -- JSON array of skill strings
  rate REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  experience INTEGER DEFAULT 0,
  -- Verification
  verif_level INTEGER DEFAULT 0,
  verif_status TEXT DEFAULT 'pending',
  -- Subscription
  has_sub INTEGER DEFAULT 0,     -- 0/1 boolean
  sub_expiry TEXT,               -- ISO date
  -- TOP
  top_city INTEGER DEFAULT 0,    -- 0/1
  top_country INTEGER DEFAULT 0, -- 0/1
  -- Status
  online INTEGER DEFAULT 0,
  blocked INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Orders (job postings from clients)
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL REFERENCES users(id),
  client_name TEXT,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  zip TEXT,
  budget INTEGER NOT NULL,
  status TEXT DEFAULT 'open' CHECK(status IN ('open','in_progress','completed','cancelled')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Order responses (bids from masters)
CREATE TABLE IF NOT EXISTS order_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  master_id TEXT NOT NULL REFERENCES users(id),
  message TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(order_id, master_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  master_id TEXT NOT NULL REFERENCES users(id),
  client_id TEXT NOT NULL REFERENCES users(id),
  client_name TEXT,
  order_id INTEGER REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  text TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Sessions (simple token auth)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Verification docs (metadata only, files stored externally)
CREATE TABLE IF NOT EXISTS verif_docs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id),
  doc_type TEXT NOT NULL, -- license, insurance, guarantee, id
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  reviewed_at TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE INDEX IF NOT EXISTS idx_users_top ON users(top_city, top_country);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_responses_order ON order_responses(order_id);
CREATE INDEX IF NOT EXISTS idx_responses_master ON order_responses(master_id);
CREATE INDEX IF NOT EXISTS idx_reviews_master ON reviews(master_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ── Seed admin account ──
INSERT OR IGNORE INTO users (id, email, password, role, name, verif_level, has_sub)
VALUES (
  'admin_001',
  'admin@slavic-shkaf.eu',
  'admin2025',
  'admin',
  'Administrator',
  3,
  1
);
