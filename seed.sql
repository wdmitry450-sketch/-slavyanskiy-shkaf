-- ═══════════════════════════════════════════════
-- Slavic Shkaf — Seed Demo Data
-- Run AFTER schema.sql:
--   wrangler d1 execute slavic-shkaf-db --file=seed.sql
-- ═══════════════════════════════════════════════

-- Demo masters (8 masters from v11)
INSERT OR IGNORE INTO users (id, email, password, role, name, phone, telegram, country, city, avatar, cats, skills, rate, reviews_count, price, experience, verif_level, verif_status, has_sub, online, top_city, top_country)
VALUES
('m_001', 'aleksey@example.com', 'demo123', 'master', 'Алексей М.', '+33 6 12 34 56 78', '@aleksey_m', 'Франция', 'Париж', '👷',
 '["plumbing","bathroom"]', '["Сантехника","Ванная под ключ","Отопление"]',
 4.9, 47, 45, 12, 3, 'verified', 1, 1, 1, 0),

('m_002', 'etien@example.com', 'demo123', 'master', 'Этьен Б.', '+32 4 98 76 54 32', '@etien_b', 'Бельгия', 'Брюссель', '👨‍🔧',
 '["electric","it"]', '["Электрика","RGE","Умный дом"]',
 4.8, 32, 55, 8, 3, 'verified', 1, 1, 1, 1),

('m_003', 'pavel@example.com', 'demo123', 'master', 'Павел К.', '+49 170 123 4567', '@pavel_k', 'Германия', 'Берлин', '🧑‍🏭',
 '["paint","floor"]', '["Покраска","Паркет","Шпаклёвка"]',
 4.7, 28, 38, 9, 2, 'verified', 0, 0, 0, 0),

('m_004', 'sonia@example.com', 'demo123', 'master', 'Соня Л.', '+33 6 98 76 54 32', '@sonya_l', 'Франция', 'Лион', '👩‍🔧',
 '["masonry","bathroom"]', '["Кладка","Плитка","Стяжка"]',
 5.0, 19, 42, 7, 2, 'verified', 1, 1, 0, 0),

('m_005', 'dmitry@example.com', 'demo123', 'master', 'Дмитрий В.', '+48 600 123 456', '@dmitry_v', 'Польша', 'Варшава', '🧔',
 '["carpentry","floor"]', '["Столярка","Паркет","Двери"]',
 4.6, 22, 35, 11, 2, 'verified', 0, 0, 0, 0),

('m_006', 'carlos@example.com', 'demo123', 'master', 'Карлос М.', '+34 612 345 678', '@carlos_m', 'Испания', 'Мадрид', '👱',
 '["ac","electric"]', '["Кондиционер","Вентиляция","Daikin"]',
 4.8, 35, 48, 10, 3, 'verified', 1, 1, 1, 0),

('m_007', 'irina@example.com', 'demo123', 'master', 'Ирина С.', '+43 664 123 4567', '@irina_s', 'Австрия', 'Вена', '👩',
 '["clean","move"]', '["Клининг","Химчистка","Переезды"]',
 4.9, 64, 28, 6, 2, 'verified', 1, 1, 0, 0),

('m_008', 'tomas@example.com', 'demo123', 'master', 'Томас Б.', '+31 6 12345678', '@tomas_b', 'Нидерланды', 'Амстердам', '🧑',
 '["roof","masonry"]', '["Кровля","Фасад","Гидроизоляция"]',
 4.7, 18, 52, 15, 3, 'verified', 1, 0, 0, 1);

-- Demo reviews for masters
INSERT OR IGNORE INTO reviews (master_id, client_id, client_name, rating, text, created_at)
VALUES
('m_001', 'admin_001', 'Жан-Поль Б.', 5, 'Отличная работа! Всё быстро и чисто.', '2024-11-12'),
('m_001', 'admin_001', 'Моника Р.', 5, 'Бойлер установил быстро, гарантия дана.', '2024-10-03'),
('m_002', 'admin_001', 'Клара М.', 5, 'Полная замена проводки — без нареканий.', '2024-12-05'),
('m_003', 'admin_001', 'Хельга Ш.', 5, 'Покрасил квартиру за 3 дня, идеально.', '2024-11-20'),
('m_004', 'admin_001', 'Люсьен Д.', 5, 'Ванная с нуля — очень довольны!', '2025-01-01'),
('m_005', 'admin_001', 'Анна К.', 5, '5 дверей установил аккуратно.', '2024-12-15'),
('m_006', 'admin_001', 'Педро Г.', 5, 'Климат в офисе — профессионально.', '2024-12-08'),
('m_007', 'admin_001', 'Вернер Х.', 5, 'Уборка после ремонта — всё блестит.', '2025-01-20'),
('m_008', 'admin_001', 'Ян Д.', 5, 'Кровля после шторма — быстро и надёжно.', '2025-02-05');

-- Update master ratings from reviews
UPDATE users SET rate = (
  SELECT ROUND(AVG(rating)*10)/10 FROM reviews WHERE master_id = users.id
), reviews_count = (
  SELECT COUNT(*) FROM reviews WHERE master_id = users.id
) WHERE role = 'master';

-- Demo client
INSERT OR IGNORE INTO users (id, email, password, role, name, phone, country, city)
VALUES ('c_001', 'client@example.com', 'demo123', 'client', 'Мари Д.', '+33 6 11 22 33 44', 'Франция', 'Париж');

-- Demo orders
INSERT OR IGNORE INTO orders (id, client_id, client_name, title, description, category, country, city, budget, status)
VALUES
(1, 'c_001', 'Мари Д.', 'Замена труб в ванной', 'Нужно заменить все трубы, ~15 кв.м', 'plumbing', 'Франция', 'Париж', 800, 'open'),
(2, 'c_001', 'Мари Д.', 'Замена проводки', '2-комнатная квартира, старая алюминиевая проводка', 'electric', 'Франция', 'Лион', 2000, 'in_progress'),
(3, 'c_001', 'Ганс М.', 'Покраска 3 комнат', 'Стены и потолок, площадь ~60 кв.м', 'paint', 'Германия', 'Берлин', 1200, 'open'),
(4, 'c_001', 'Карин Л.', 'Установка кондиционера', '3 комнаты, сплит-система', 'ac', 'Испания', 'Мадрид', 1500, 'open'),
(5, 'c_001', 'Лука Б.', 'Укладка паркета', 'Гостиная 30 кв.м, дуб, масло', 'floor', 'Италия', 'Рим', 900, 'completed');

-- Demo responses
INSERT OR IGNORE INTO order_responses (order_id, master_id)
VALUES (1, 'm_001'), (1, 'm_006'), (2, 'm_002'), (4, 'm_006'), (5, 'm_005');
