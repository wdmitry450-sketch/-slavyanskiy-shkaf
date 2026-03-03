/* ═══════════════════════════════════════════════════════════
   SLAVIC SHKAF — SHARED UTILITIES v2
   Подключается на каждой странице ПОСЛЕ data.js
═══════════════════════════════════════════════════════════ */

// ── Lang ───────────────────────────────────────────────────
let LANG = localStorage.getItem('shkaf_lang') || 'ru';
const t = key => T[LANG][key] || T['ru'][key] || key;
const tl = obj => (typeof obj === 'string') ? obj : (obj[LANG] || obj['ru'] || '');
function setLang(l) { LANG = l; localStorage.setItem('shkaf_lang', l); location.reload(); }

// ── Settings (от админки) ──────────────────────────────────
function getSettings() {
  try { const s = JSON.parse(localStorage.getItem('shkaf_settings')); return s || DEFAULTS; }
  catch { return DEFAULTS; }
}
function saveSettings(s) { localStorage.setItem('shkaf_settings', JSON.stringify(s)); }
const cfg = getSettings();

// ── Auth / Session ─────────────────────────────────────────
const AUTH_KEY = 'shkaf_auth';
const USERS_KEY = 'shkaf_users';

function getUser()  { try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)); } catch { return null; } }
function setUser(u) { sessionStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function clearUser(){ sessionStorage.removeItem(AUTH_KEY); }

function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; } }
function saveUsers(arr) { localStorage.setItem(USERS_KEY, JSON.stringify(arr)); }

function registerUser(data) {
  const users = getUsers();
  if (users.find(u => u.email === data.email)) return { ok: false, err: LANG==='ru' ? 'Email уже зарегистрирован' : 'Email already registered' };
  const user = { ...data, id: 'u_' + Date.now(), createdAt: new Date().toISOString(),
    verified: false, verifLevel: 0, sub: false, subExpiry: null,
    topCity: false, topCountry: false, topCityExpiry: null, topCountryExpiry: null,
    responses: [], blocked: false };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

function loginUser(email, password) {
  // Admin hardcoded
  if (email === 'admin@slavic-shkaf.eu' && password === 'admin2025') {
    return { ok: true, user: { id:'admin', name:'Admin', role:'admin', email } };
  }
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, err: LANG==='ru' ? 'Неверный email или пароль' : 'Invalid email or password' };
  if (user.blocked) return { ok: false, err: LANG==='ru' ? 'Аккаунт заблокирован' : 'Account blocked' };
  return { ok: true, user };
}

function resetPassword(email, newPassword) {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx === -1) return false;
  users[idx].password = newPassword;
  saveUsers(users);
  return true;
}

function updateUser(id, data) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  users[idx] = { ...users[idx], ...data };
  saveUsers(users);
  // Update session
  const sess = getUser();
  if (sess && sess.id === id) setUser({ ...sess, ...data });
  return true;
}

function doLogout() {
  clearUser();
  toast(LANG==='ru' ? 'До встречи! 👋' : 'See you! 👋');
  setTimeout(() => location.href = 'index.html', 600);
}

// ── Orders ─────────────────────────────────────────────────
const ORDERS_KEY = 'shkaf_orders';
function getOrders()      { try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || DEMO_ORDERS; } catch { return DEMO_ORDERS; } }
function saveOrders(arr)  { localStorage.setItem(ORDERS_KEY, JSON.stringify(arr)); }
function addOrder(o)      { const arr = getOrders(); arr.unshift({...o, id: Date.now()}); saveOrders(arr); }
function updateOrder(id, data) {
  const arr = getOrders();
  const i = arr.findIndex(o => o.id === id);
  if (i !== -1) { arr[i] = {...arr[i], ...data}; saveOrders(arr); }
}

// ── Chats ──────────────────────────────────────────────────
const CHATS_KEY = 'shkaf_chats';
function getChats()    { try { return JSON.parse(localStorage.getItem(CHATS_KEY)) || DEMO_CHATS; } catch { return DEMO_CHATS; } }
function saveChats(c)  { localStorage.setItem(CHATS_KEY, JSON.stringify(c)); }
function addMessage(chatId, msg) {
  const chats = getChats();
  const i = chats.findIndex(c => c.id === chatId);
  const message = {...msg, ts: new Date().toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'})};
  if (i !== -1) { chats[i].messages.push(message); }
  else { chats.push({ id: chatId, messages: [message] }); }
  saveChats(chats);
}

// ── Toast ──────────────────────────────────────────────────
function toast(msg, type='ok') {
  let box = document.getElementById('_toast');
  if (!box) {
    box = document.createElement('div');
    box.id = '_toast';
    box.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
    document.body.appendChild(box);
  }
  const bg = type==='err' ? '#ff4d4f' : type==='warn' ? '#ffc53d' : '#00d68f';
  const co = type==='ok' ? '#000' : '#fff';
  const el = document.createElement('div');
  el.style.cssText = `padding:13px 20px;border-radius:11px;font-size:14px;font-weight:700;color:${co};background:${bg};box-shadow:0 8px 28px rgba(0,0,0,.4);animation:_tin .25s ease;max-width:300px`;
  el.textContent = msg;
  if (!document.getElementById('_tinkf')) {
    const s = document.createElement('style');
    s.id='_tinkf'; s.textContent='@keyframes _tin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }
  box.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── Helpers ────────────────────────────────────────────────
const cflag   = name => CO.find(c=>c.ru===name||c.en===name)?.f || '🌍';
const catName = id   => { const s=SK.find(s=>s.id===id); return s ? tl(s) : id; };
const catIco  = id   => SK.find(s=>s.id===id)?.i || '🔨';
const getParam = k   => new URLSearchParams(location.search).get(k);

// ── Master card ────────────────────────────────────────────
function masterCardHTML(m) {
  const isTop = m.topCity || m.topCountry;
  return `<a class="mcard" href="profile.html?id=${m.id}">
    <div class="mcard-top">
      <div class="mcard-ava">${m.a}</div>
      ${m.online ? '<div class="mcard-online"></div>' : ''}
      <div class="mcard-badge">
        ${isTop ? '<span class="badge badge-y" style="margin-bottom:4px">🏆 ТОП</span><br>' : ''}
        <span class="badge badge-g">✅ Ур.${m.lvl}</span>
      </div>
    </div>
    <div class="mcard-body">
      <div class="mcard-name">${m.nm}</div>
      <div class="mcard-city">${cflag(m.country)} ${m.city}, ${m.country}</div>
      <div class="mcard-tags">${m.skills.slice(0,3).map(s=>`<span class="mcard-tag">${s}</span>`).join('')}</div>
      <div class="mcard-foot">
        <span class="mcard-rate"><strong>${m.rate}★</strong> <span>(${m.reviews})</span></span>
        <span class="mcard-price">${m.price}${cfg.currency || '€'}<span>/ч</span></span>
      </div>
    </div>
  </a>`;
}

// ── Nav ────────────────────────────────────────────────────
function initNav(activePage) {
  const u    = getUser();
  const navR = document.getElementById('nav-r');
  if (!navR) return;

  if (u) {
    let dash = 'client.html';
    if (u.role === 'master') dash = 'dashboard.html';
    if (u.role === 'admin')  dash = 'admin.html';
    navR.innerHTML = `
      <button class="lang-btn" onclick="setLang('${LANG==='ru'?'en':'ru'}')">${LANG==='ru'?'EN':'RU'}</button>
      <a href="${dash}" class="nav-user-btn">
        <div class="nav-ava">${u.name[0].toUpperCase()}</div>
        <span class="nav-uname">${u.name}</span>
      </a>
      <button class="nav-btn-ghost btn-sm" onclick="doLogout()">${t('logout')}</button>`;
  } else {
    navR.innerHTML = `
      <button class="lang-btn" onclick="setLang('${LANG==='ru'?'en':'ru'}')">${LANG==='ru'?'EN':'RU'}</button>
      <a href="login.html"    class="nav-btn-ghost">${t('login')}</a>
      <a href="register.html" class="nav-btn-cta">${t('register')}</a>`;
  }

  if (activePage) {
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === activePage);
    });
  }

  const burger = document.getElementById('nav-burger');
  const mob    = document.getElementById('nav-mob');
  if (burger && mob) {
    burger.style.display = 'flex';
    burger.addEventListener('click', () => mob.classList.toggle('open'));
  }
}

// ── Reveal ─────────────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
  }, { threshold: 0.08 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

// ── Auth guard ─────────────────────────────────────────────
function requireAuth(role) {
  const u = getUser();
  if (!u) { location.href = 'login.html'; return null; }
  if (role && u.role !== role && u.role !== 'admin') { location.href = 'index.html'; return null; }
  return u;
}

// ── Subscription check ─────────────────────────────────────
function hasSub(user) {
  if (!user) return false;
  if (user.sub && user.subExpiry) return new Date(user.subExpiry) > new Date();
  return user.sub === true; // demo
}

// ── Responses count this month ─────────────────────────────
function getMonthlyResponses(userId) {
  const orders = getOrders();
  const now = new Date();
  return orders.filter(o =>
    o.responses && o.responses.includes && o.responses.includes(userId) &&
    o.respondedAt && new Date(o.respondedAt).getMonth() === now.getMonth()
  ).length;
}

// ── Sorting masters (TOP first) ────────────────────────────
function sortedMasters(masters, city, country) {
  return [...masters].sort((a, b) => {
    const aTop = (city && a.city === city && a.topCity) ? 2 : (country && a.country === country && a.topCountry) ? 1 : 0;
    const bTop = (city && b.city === city && b.topCity) ? 2 : (country && b.country === country && b.topCountry) ? 1 : 0;
    if (bTop !== aTop) return bTop - aTop;
    return b.rate - a.rate;
  });
}

// ── Country/Cat select options ─────────────────────────────
function coOptions(sel) {
  return CO.map(c=>`<option value="${c.ru}"${c.ru===sel?' selected':''}>${c.f} ${tl(c)}</option>`).join('');
}
function catOptions(sel, all=true) {
  return (all ? `<option value="">${LANG==='ru'?'Все категории':'All categories'}</option>` : '') +
    SK.map(s=>`<option value="${s.id}"${s.id===sel?' selected':''}>${s.i} ${tl(s)}</option>`).join('');
}

// ── Status badge ───────────────────────────────────────────
function statusBadge(status) {
  const map = {
    open:       { cls:'badge-g', ru:'Открыта',      en:'Open'       },
    in_progress:{ cls:'badge-y', ru:'В работе',     en:'In Progress'},
    completed:  { cls:'badge-acc',ru:'Выполнено',   en:'Completed'  },
    cancelled:  { cls:'badge-r', ru:'Отменена',     en:'Cancelled'  },
    closed:     { cls:'badge-muted',ru:'Закрыта',   en:'Closed'     },
  };
  const s = map[status] || map.open;
  return `<span class="badge ${s.cls}">${LANG==='ru'?s.ru:s.en}</span>`;
}
