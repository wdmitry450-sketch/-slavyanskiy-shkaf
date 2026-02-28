// ═══════════════════════════════════════════════════════════════
// Славянский шкаф — Cloudflare Worker
// Два бота: APP бот (каталог) + ADMIN бот (управление)
// ═══════════════════════════════════════════════════════════════
//
// ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (все добавлять как Secret):
//
// APP БОТ (masterhub_app_bot) — для пользователей:
//   APP_BOT_TOKEN          — токен от @BotFather
//   APP_BOT_GROUP_ID       — ID группы/канала куда бот пишет пользователям
//
// ADMIN БОТ (slavyanskiy_shkaf_admin_bot) — только для тебя:
//   ADMIN_BOT_TOKEN        — токен от @BotFather
//   ADMIN_GROUP_ID         — ID твоей форум-группы с топиками
//   TOPIC_MASTERS_ID       — ID топика "📋 Регистрации мастеров"
//   TOPIC_CLIENTS_ID       — ID топика "🏠 Регистрации клиентов"
//   TOPIC_ORDERS_ID        — ID топика "🔧 Заявки и услуги"
//   TOPIC_STATS_ID         — ID топика "📊 Статистика"
//   TOPIC_CHATS_ID         — ID топика "💬 Новые чаты"
//   TOPIC_REVIEWS_ID       — ID топика "⭐ Отзывы"
//   TOPIC_PAYMENTS_ID      — ID топика "💳 Платежи"
//   TOPIC_COMPLAINTS_ID    — ID топика "🚨 Жалобы"
//
// ═══════════════════════════════════════════════════════════════

export default {

  // ──────────────────────────────────────────
  // HTTP запросы (из приложения)
  // ──────────────────────────────────────────
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let result;

      // ── Регистрация мастера ──
      if (path === '/api/notify/master-registered' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyMasterRegistered(env, data);
      }

      // ── Регистрация клиента ──
      else if (path === '/api/notify/client-registered' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyClientRegistered(env, data);
      }

      // ── Новая заявка клиента ──
      else if (path === '/api/notify/new-order' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyNewOrder(env, data);
      }

      // ── Мастер публикует услугу ──
      else if (path === '/api/notify/new-service' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyNewService(env, data);
      }

      // ── Новый чат открыт ──
      else if (path === '/api/notify/new-chat' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyNewChat(env, data);
      }

      // ── Новый отзыв ──
      else if (path === '/api/notify/new-review' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyNewReview(env, data);
      }

      // ── Новый платёж ──
      else if (path === '/api/notify/new-payment' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyNewPayment(env, data);
      }

      // ── Жалоба ──
      else if (path === '/api/notify/new-complaint' && request.method === 'POST') {
        const data = await request.json();
        result = await notifyNewComplaint(env, data);
      }

      // ── Статистика вручную (для теста) ──
      else if (path === '/api/stats/daily' && request.method === 'GET') {
        result = await sendDailyStats(env);
      }

      // ── Счётчики (инкремент из приложения) ──
      else if (path === '/api/stats/increment' && request.method === 'POST') {
        const data = await request.json();
        result = await incrementCounter(env, data.event);
      }

      else {
        return new Response(JSON.stringify({ error: 'Not found', path }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ ok: true, result }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },

  // ──────────────────────────────────────────
  // Scheduled tasks (cron)
  // ──────────────────────────────────────────
  async scheduled(event, env, ctx) {
    const cron = event.cron;

    // Каждый день в 09:00 — дневная статистика (за вчера)
    if (cron === '0 9 * * *') {
      await sendDailyStats(env);
    }

    // Каждый понедельник в 09:00 — недельная статистика (за прошлую неделю)
    if (cron === '0 9 * * 1') {
      await sendWeeklyStats(env);
    }

    // 1-е число каждого месяца в 09:00 — месячная статистика
    if (cron === '0 9 1 * *') {
      await sendMonthlyStats(env);
    }

    // 1 января в 09:00 — годовая статистика
    if (cron === '0 9 1 1 *') {
      await sendYearlyStats(env);
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// УВЕДОМЛЕНИЯ
// ═══════════════════════════════════════════════════════════════

// ── Регистрация мастера ──────────────────────
async function notifyMasterRegistered(env, data) {
  const { id, name, username, country, city, skills, status_type, reg_number } = data;
  const flag = countryFlag(country);

  // Сообщение для APP бота (пользователям — приветствие)
  const appMsg =
`👷 Добро пожаловать в MasterHub, <b>${name}</b>!

✅ Ваш профиль создан
${flag} ${city || ''}, ${country || ''}
🔧 ${skills ? skills.join(' · ') : ''}

Ваши данные проходят проверку. Мы уведомим вас когда профиль будет одобрен.`;

  // Сообщение для ADMIN бота (тебе — полная инфа)
  const adminMsg =
`👷 <b>Новый мастер</b>

🆔 <code>${id || 'auto'}</code>
👤 ${name}
📱 ${username ? '@' + username : 'без username'}
${flag} ${country || '—'} · ${city || '—'}
🏢 ${status_type || '—'}
🔢 ${reg_number ? reg_number.label + ': <code>' + reg_number.value + '</code>' : 'рег. номер не указан'}
🔧 ${skills ? skills.join(', ') : '—'}
⏰ ${nowStr()}`;

  // Кнопки действий в ADMIN боте
  const adminKeyboard = {
    inline_keyboard: [[
      { text: '✅ Одобрить', callback_data: `approve_master_${id}` },
      { text: '❌ Отклонить', callback_data: `reject_master_${id}` },
    ],[
      { text: '👤 Профиль в каталоге', web_app: { url: `https://slavyanskiy-shkaf.eu/admin#a-user-detail` } }
    ]]
  };

  await incrementCounter(env, 'masters_registered');

  // Шлём в оба бота параллельно
  await Promise.all([
    username ? sendToAppBot(env, username, appMsg) : null,       // APP бот → лично мастеру
    sendToAdminTopic(env, env.TOPIC_MASTERS_ID, adminMsg, adminKeyboard), // ADMIN бот → топик
  ]);
}


// ── Регистрация клиента ──────────────────────
async function notifyClientRegistered(env, data) {
  const { id, name, username, country, city, address } = data;
  const flag = countryFlag(country);

  const appMsg =
`🏠 Добро пожаловать в MasterHub, <b>${name}</b>!

✅ Ваш аккаунт создан
${flag} ${city || ''}, ${country || ''}

Теперь вы можете публиковать заявки и находить лучших мастеров рядом с вами.`;

  const adminMsg =
`🏠 <b>Новый клиент</b>

🆔 <code>${id || 'auto'}</code>
👤 ${name}
📱 ${username ? '@' + username : 'без username'}
${flag} ${country || '—'} · ${city || '—'}
📍 ${address || '—'}
⏰ ${nowStr()}`;

  const adminKeyboard = {
    inline_keyboard: [[
      { text: '👤 Открыть профиль', web_app: { url: `https://slavyanskiy-shkaf.eu/admin#a-user-detail` } },
      { text: '🚫 Заблокировать', callback_data: `block_client_${id}` },
    ]]
  };

  await incrementCounter(env, 'clients_registered');
  await Promise.all([
    username ? sendToAppBot(env, username, appMsg) : null,
    sendToAdminTopic(env, env.TOPIC_CLIENTS_ID, adminMsg, adminKeyboard),
  ]);
}


// ── Новая заявка клиента ─────────────────────
async function notifyNewOrder(env, data) {
  const { id, client_name, client_id, category, description, city, urgency, budget, requires_siret } = data;
  const urgencyEmoji = urgency === 'today' ? '🔥' : urgency === 'week' ? '📅' : '🕐';

  // APP бот → рассылаем мастерам у которых есть эта категория (в реальности через базу)
  // Пока шлём в общий канал каталога
  const appMsg =
`📋 <b>Новая заявка</b>

🔧 ${category || '—'}
📝 ${description ? description.substring(0, 120) + '...' : '—'}
📍 ${city || '—'}
${urgencyEmoji} ${urgency === 'today' ? 'Срочно — сегодня' : urgency === 'week' ? 'На этой неделе' : 'Гибко'}
💶 Бюджет: ${budget || 'не указан'}
${requires_siret ? '🏢 Требует рег. номер (SIRET/NIF/...)' : ''}

👆 Откройте каталог чтобы откликнуться`;

  const adminMsg =
`📋 <b>Новая заявка</b> #${id || '—'}

👤 Клиент: ${client_name} (<code>${client_id}</code>)
🔧 ${category || '—'}
📝 ${description ? description.substring(0, 150) : '—'}
📍 ${city || '—'}
${urgencyEmoji} ${urgency || '—'} · 💶 ${budget || '—'}
${requires_siret ? '🏢 Требует рег. номер' : ''}
⏰ ${nowStr()}`;

  const adminKeyboard = {
    inline_keyboard: [[
      { text: '👁 Просмотреть', web_app: { url: `https://slavyanskiy-shkaf.eu/admin#a-missions` } },
      { text: '🗑 Удалить заявку', callback_data: `delete_order_${id}` },
    ]]
  };

  await incrementCounter(env, 'orders_created');
  await Promise.all([
    sendToAppChannel(env, appMsg),
    sendToAdminTopic(env, env.TOPIC_ORDERS_ID, adminMsg, adminKeyboard),
  ]);
}

// ── Мастер публикует услугу ──────────────────
async function notifyNewService(env, data) {
  const { master_name, master_id, category, title, city, country, price } = data;
  const flag = countryFlag(country);

  const appMsg =
`🔧 <b>Новый мастер в каталоге</b>

👷 ${master_name}
📌 ${title || category || '—'}
${flag} ${city || '—'}
💶 ${price || 'Цена договорная'}

👆 Откройте каталог чтобы связаться`;

  const adminMsg =
`🔧 <b>Новая услуга</b>

👷 ${master_name} (<code>${master_id}</code>)
📌 ${title || category || '—'}
${flag} ${city || '—'}, ${country || '—'}
💶 ${price || 'договорная'}
⏰ ${nowStr()}`;

  const adminKeyboard = {
    inline_keyboard: [[
      { text: '👷 Профиль мастера', web_app: { url: `https://slavyanskiy-shkaf.eu/admin#a-user-detail` } },
      { text: '🗑 Снять с публикации', callback_data: `remove_service_${master_id}` },
    ]]
  };

  await incrementCounter(env, 'services_published');
  await Promise.all([
    sendToAppChannel(env, appMsg),
    sendToAdminTopic(env, env.TOPIC_ORDERS_ID, adminMsg, adminKeyboard),
  ]);
}

// ── Новый чат ────────────────────────────────
async function notifyNewChat(env, data) {
  const { master_name, master_id, client_name, client_id, order_title } = data;

  const adminMsg =
`💬 <b>Новый чат открыт</b>

👷 ${master_name} (<code>${master_id}</code>)
🏠 ${client_name} (<code>${client_id}</code>)
📋 ${order_title || '—'}
⏰ ${nowStr()}`;

  await incrementCounter(env, 'chats_opened');
  await sendToAdminTopic(env, env.TOPIC_CHATS_ID, adminMsg);
}

// ── Новый отзыв ──────────────────────────────
async function notifyNewReview(env, data) {
  const { master_name, master_id, client_name, rating, comment } = data;
  const stars = '⭐'.repeat(Math.min(rating || 5, 5));

  // APP бот → мастеру лично
  const appMsg =
`${stars} <b>Новый отзыв о вас!</b>

👤 ${client_name}
💬 ${comment ? '"' + comment + '"' : '—'}`;

  const adminMsg =
`⭐ <b>Новый отзыв</b>

👷 ${master_name} (<code>${master_id}</code>)
👤 ${client_name}
${stars} ${rating}/5
💬 ${comment ? '"' + comment.substring(0, 200) + '"' : '—'}
⏰ ${nowStr()}`;

  const adminKeyboard = {
    inline_keyboard: [[
      { text: '🗑 Удалить отзыв', callback_data: `delete_review_${master_id}` },
      { text: '🚨 Пожаловаться', callback_data: `flag_review_${master_id}` },
    ]]
  };

  await incrementCounter(env, 'reviews_left');
  await Promise.all([
    sendToAdminTopic(env, env.TOPIC_REVIEWS_ID, adminMsg, adminKeyboard),
  ]);
}

// ── Новый платёж ─────────────────────────────
async function notifyNewPayment(env, data) {
  const { amount, currency, payer_name, master_name, order_id, type } = data;
  const typeLabel = type === 'commission' ? '📊 Комиссия' : type === 'subscription' ? '🔄 Подписка' : '💰 Платёж';

  const adminMsg =
`💳 <b>${typeLabel}</b>

💶 <b>${amount} ${currency || 'EUR'}</b>
👤 ${payer_name || '—'}
👷 ${master_name || '—'}
📋 #${order_id || '—'}
⏰ ${nowStr()}`;

  await incrementCounter(env, 'payments');
  await sendToAdminTopic(env, env.TOPIC_PAYMENTS_ID, adminMsg);
}

// ── Жалоба ───────────────────────────────────
async function notifyNewComplaint(env, data) {
  const { from_name, from_id, against_name, against_id, reason, order_id, urgency } = data;
  const urgEmoji = urgency === 'high' ? '🔴' : urgency === 'medium' ? '🟡' : '🟢';

  const adminMsg =
`🚨 <b>Жалоба</b> ${urgEmoji}

👤 От: ${from_name} (<code>${from_id}</code>)
👤 На: ${against_name} (<code>${against_id}</code>)
📋 #${order_id || '—'}
📝 ${reason || '—'}
⏰ ${nowStr()}`;

  const adminKeyboard = {
    inline_keyboard: [[
      { text: '✅ Решить', callback_data: `resolve_complaint_${against_id}` },
      { text: '🚫 Заблокировать', callback_data: `block_user_${against_id}` },
    ],[
      { text: '👁 Открыть в админке', web_app: { url: `https://slavyanskiy-shkaf.eu/admin#a-complaints` } },
    ]]
  };

  await incrementCounter(env, 'complaints');
  await sendToAdminTopic(env, env.TOPIC_COMPLAINTS_ID, adminMsg, adminKeyboard);
}


// ═══════════════════════════════════════════════════════════════
// СТАТИСТИКА
// ═══════════════════════════════════════════════════════════════

async function sendDailyStats(env) {
  const stats = await getStats(env, 'day');
  const total = await getStats(env, 'total');

  const msg =
`📊 <b>Отчёт за вчера</b> — ${yesterdayStr()}

<b>За вчерашний день:</b>
👷 Новых мастеров: <b>${stats.masters_registered || 0}</b>
🏠 Новых клиентов: <b>${stats.clients_registered || 0}</b>
📋 Новых заявок: <b>${stats.orders_created || 0}</b>
🔧 Опубликовано услуг: <b>${stats.services_published || 0}</b>
💬 Открыто чатов: <b>${stats.chats_opened || 0}</b>
⭐ Оставлено отзывов: <b>${stats.reviews_left || 0}</b>
💳 Платежей: <b>${stats.payments || 0}</b>
🚨 Жалоб: <b>${stats.complaints || 0}</b>

<b>Всего в базе:</b>
👥 Мастеров: <b>${total.masters_registered || 0}</b>
👥 Клиентов: <b>${total.clients_registered || 0}</b>
📋 Заявок всего: <b>${total.orders_created || 0}</b>
⭐ Отзывов всего: <b>${total.reviews_left || 0}</b>

⏰ Отчёт сформирован: ${nowStr()}`;

  await resetDayCounters(env);
  return await sendToTopic(env, env.TOPIC_STATS_ID, msg);
}

async function sendWeeklyStats(env) {
  const stats = await getStats(env, 'week');

  const msg =
`📊 <b>Недельная статистика</b> — неделя ${weekStr()}

👷 Новых мастеров: <b>${stats.week_masters || 0}</b>
🏠 Новых клиентов: <b>${stats.week_clients || 0}</b>
📋 Создано заявок: <b>${stats.week_orders || 0}</b>
💬 Открыто чатов: <b>${stats.week_chats || 0}</b>
⭐ Отзывов: <b>${stats.week_reviews || 0}</b>
💳 Платежей: <b>${stats.week_payments || 0}</b>

📈 Активность: ${stats.week_orders > 0 ? '🟢 Есть заявки' : '🔴 Нет активности'}

⏰ ${nowStr()}`;

  await resetWeekCounters(env);
  return await sendToTopic(env, env.TOPIC_STATS_ID, msg);
}

async function sendMonthlyStats(env) {
  const stats = await getStats(env, 'month');

  const msg =
`📊 <b>Месячная статистика</b> — ${monthStr()}

👷 Новых мастеров: <b>${stats.month_masters || 0}</b>
🏠 Новых клиентов: <b>${stats.month_clients || 0}</b>
📋 Создано заявок: <b>${stats.month_orders || 0}</b>
💬 Открыто чатов: <b>${stats.month_chats || 0}</b>
⭐ Отзывов: <b>${stats.month_reviews || 0}</b>
💳 Платежей: <b>${stats.month_payments || 0}</b>
🚨 Жалоб: <b>${stats.month_complaints || 0}</b>

💹 Рост мастеров: ${stats.month_masters > 0 ? '+' + stats.month_masters : '0'}
💹 Рост клиентов: ${stats.month_clients > 0 ? '+' + stats.month_clients : '0'}

⏰ ${nowStr()}`;

  await resetMonthCounters(env);
  return await sendToTopic(env, env.TOPIC_STATS_ID, msg);
}

async function sendYearlyStats(env) {
  const stats = await getStats(env, 'year');

  const msg =
`🎉 <b>Годовая статистика</b> — ${yearStr()}

<b>Итоги года:</b>
👷 Мастеров зарегистрировано: <b>${stats.year_masters || 0}</b>
🏠 Клиентов зарегистрировано: <b>${stats.year_clients || 0}</b>
📋 Всего заявок создано: <b>${stats.year_orders || 0}</b>
🔧 Услуг опубликовано: <b>${stats.year_services || 0}</b>
💬 Чатов открыто: <b>${stats.year_chats || 0}</b>
⭐ Отзывов оставлено: <b>${stats.year_reviews || 0}</b>
💳 Платежей проведено: <b>${stats.year_payments || 0}</b>
🚨 Жалоб получено: <b>${stats.year_complaints || 0}</b>

🏆 <b>Платформа работает!</b>

⏰ ${nowStr()}`;

  await resetYearCounters(env);
  return await sendToTopic(env, env.TOPIC_STATS_ID, msg);
}

// ═══════════════════════════════════════════════════════════════
// СЧЁТЧИКИ (Cloudflare KV)
// ═══════════════════════════════════════════════════════════════

async function incrementCounter(env, event) {
  if (!env.STATS_KV) return;

  const today = todayStr();

  // Дневной счётчик
  const dayKey = `day:${today}:${event}`;
  const dayVal = parseInt(await env.STATS_KV.get(dayKey) || '0') + 1;
  await env.STATS_KV.put(dayKey, String(dayVal), { expirationTtl: 60 * 60 * 24 * 35 }); // 35 дней

  // Недельный
  const weekKey = `week:${weekStr()}:${event}`;
  const weekVal = parseInt(await env.STATS_KV.get(weekKey) || '0') + 1;
  await env.STATS_KV.put(weekKey, String(weekVal), { expirationTtl: 60 * 60 * 24 * 40 });

  // Месячный
  const monthKey = `month:${monthStr()}:${event}`;
  const monthVal = parseInt(await env.STATS_KV.get(monthKey) || '0') + 1;
  await env.STATS_KV.put(monthKey, String(monthVal), { expirationTtl: 60 * 60 * 24 * 400 });

  // Годовой
  const yearKey = `year:${yearStr()}:${event}`;
  const yearVal = parseInt(await env.STATS_KV.get(yearKey) || '0') + 1;
  await env.STATS_KV.put(yearKey, String(yearVal), { expirationTtl: 60 * 60 * 24 * 400 });

  // Всего за всё время
  const totalKey = `total:${event}`;
  const totalVal = parseInt(await env.STATS_KV.get(totalKey) || '0') + 1;
  await env.STATS_KV.put(totalKey, String(totalVal));
}

async function getStats(env, period) {
  if (!env.STATS_KV) return {};

  const events = ['masters_registered','clients_registered','orders_created','services_published','chats_opened','reviews_left','payments','complaints'];
  const stats = {};
  const prefix = period === 'total' ? 'total' : period === 'day' ? `day:${todayStr()}` : period === 'week' ? `week:${weekStr()}` : period === 'month' ? `month:${monthStr()}` : `year:${yearStr()}`;

  for (const event of events) {
    const key = period === 'total' ? `total:${event}` : `${prefix}:${event}`;
    const shortKey = period === 'total' ? event : `${period}_${event.split('_')[0]}`;
    stats[event] = parseInt(await env.STATS_KV.get(key) || '0');
    stats[shortKey] = stats[event];
  }

  return stats;
}

async function resetDayCounters(env) { /* KV с TTL — само истекает */ }
async function resetWeekCounters(env) { /* KV с TTL — само истекает */ }
async function resetMonthCounters(env) { /* KV с TTL — само истекает */ }
async function resetYearCounters(env) { /* KV с TTL — само истекает */ }

// ═══════════════════════════════════════════════════════════════
// TELEGRAM API — ДВА БОТА
// ═══════════════════════════════════════════════════════════════

// ADMIN бот → топик в форум-группе (с кнопками действий)
async function sendToAdminTopic(env, topicId, text, keyboard = null) {
  const body = {
    chat_id: env.ADMIN_GROUP_ID,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  if (topicId) body.message_thread_id = parseInt(topicId);
  if (keyboard) body.reply_markup = JSON.stringify(keyboard);
  return await telegramRequest(env.ADMIN_BOT_TOKEN, 'sendMessage', body);
}

// APP бот → лично пользователю (по username или chat_id)
async function sendToAppBot(env, chatIdOrUsername, text) {
  const body = {
    chat_id: chatIdOrUsername,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  return await telegramRequest(env.APP_BOT_TOKEN, 'sendMessage', body);
}

// APP бот → в общий канал/чат каталога (новые заявки, услуги)
async function sendToAppChannel(env, text) {
  if (!env.APP_CHANNEL_ID) return null;
  const body = {
    chat_id: env.APP_CHANNEL_ID,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
  return await telegramRequest(env.APP_BOT_TOKEN, 'sendMessage', body);
}

// Базовый запрос к Telegram API
async function telegramRequest(token, method, body) {
  if (!token) { console.error('Missing bot token for method:', method); return null; }
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await res.json();
  if (!result.ok) console.error(`Telegram ${method} error:`, JSON.stringify(result));
  return result;
}

// Старый алиас — оставлен для совместимости со stats функциями
async function sendToTopic(env, topicId, text) {
  return await sendToAdminTopic(env, topicId, text);
}

// ═══════════════════════════════════════════════════════════════
// УТИЛИТЫ
// ═══════════════════════════════════════════════════════════════

function nowStr() {
  return new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Paris', dateStyle: 'short', timeStyle: 'short' });
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('ru-RU', { timeZone: 'Europe/Paris' }).replace(/\./g, '-');
}

function todayStr() {
  return new Date().toLocaleDateString('ru-RU', { timeZone: 'Europe/Paris' }).replace(/\./g, '-');
}

function weekStr() {
  const d = new Date();
  const firstDay = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - firstDay) / 86400000 + firstDay.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function monthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function yearStr() {
  return String(new Date().getFullYear());
}

function countryFlag(country) {
  const flags = {
    'FR': '🇫🇷', 'DE': '🇩🇪', 'ES': '🇪🇸', 'IT': '🇮🇹',
    'BE': '🇧🇪', 'NL': '🇳🇱', 'PL': '🇵🇱', 'AT': '🇦🇹',
    'CH': '🇨🇭', 'PT': '🇵🇹', 'SE': '🇸🇪', 'NO': '🇳🇴',
    'DK': '🇩🇰', 'FI': '🇫🇮', 'CZ': '🇨🇿', 'SK': '🇸🇰',
    'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬', 'HR': '🇭🇷',
    'SI': '🇸🇮', 'GR': '🇬🇷',
  };
  if (!country) return '🌍';
  const code = country.toUpperCase().substring(0, 2);
  return flags[code] || '🌍';
}
