/* ═══════════════════════════════════════════════════════════
   SLAVIC SHKAF — SHARED UTILITIES
   Подключается на каждой странице после data.js
═══════════════════════════════════════════════════════════ */

// ── Auth / Session ─────────────────────────────────────────
const AUTH_KEY = 'shkaf_auth';
const getUser  = () => { try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)); } catch { return null; } };
const setUser  = u  => sessionStorage.setItem(AUTH_KEY, JSON.stringify(u));
const clearUser = () => sessionStorage.removeItem(AUTH_KEY);

// ── Helpers ────────────────────────────────────────────────
const cflag   = name => CO.find(c => c.ru === name)?.f || '🌍';
const catName = id   => SK.find(s => s.id === id)?.ru || id;
const stars   = n    => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
const getParam = k   => new URLSearchParams(location.search).get(k);

// ── Toast ──────────────────────────────────────────────────
function toast(msg, type = 'ok') {
  let box = document.getElementById('_toast');
  if (!box) {
    box = document.createElement('div');
    box.id = '_toast';
    box.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
    document.body.appendChild(box);
  }
  const bg = type === 'err' ? '#ff4d4f' : type === 'warn' ? '#ffc53d' : '#00d68f';
  const co = type === 'ok'  ? '#000' : '#fff';
  const el = document.createElement('div');
  el.style.cssText = `padding:13px 20px;border-radius:11px;font-size:14px;font-weight:700;color:${co};background:${bg};box-shadow:0 8px 28px rgba(0,0,0,.4);animation:_toastIn .25s ease;max-width:300px;font-family:'Manrope',sans-serif`;
  el.textContent = msg;
  if (!document.getElementById('_toastKf')) {
    const s = document.createElement('style');
    s.id = '_toastKf';
    s.textContent = '@keyframes _toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
    document.head.appendChild(s);
  }
  box.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── Nav render ─────────────────────────────────────────────
function initNav(activePage) {
  const u    = getUser();
  const navR = document.getElementById('nav-r');
  if (!navR) return;

  if (u) {
    const dash = u.role === 'master' ? 'dashboard.html' : 'client.html';
    navR.innerHTML = `
      <a href="${dash}" class="nav-user-btn">
        <div class="nav-ava">${u.name[0].toUpperCase()}</div>
        <span class="nav-uname">${u.name}</span>
      </a>
      <button class="nav-btn-ghost" onclick="doLogout()" style="margin-left:4px">Выйти</button>`;
  } else {
    navR.innerHTML = `
      <a href="login.html"    class="nav-btn-ghost">Войти</a>
      <a href="register.html" class="nav-btn-cta">Регистрация</a>`;
  }

  // Active link
  if (activePage) {
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === activePage);
    });
  }

  // Burger
  const burger = document.getElementById('nav-burger');
  const mob    = document.getElementById('nav-mob');
  if (burger && mob) {
    burger.style.display = 'flex';
    burger.addEventListener('click', () => mob.classList.toggle('open'));
  }
}

function doLogout() {
  clearUser();
  toast('До встречи! 👋');
  setTimeout(() => window.location.href = 'index.html', 700);
}

// ── Master card HTML ───────────────────────────────────────
function masterCardHTML(m, opts = {}) {
  const href = opts.href || `profile.html?id=${m.id}`;
  return `
  <a class="mcard" href="${href}">
    <div class="mcard-top">
      <div class="mcard-ava">${m.a}</div>
      ${m.online ? '<div class="mcard-online"></div>' : ''}
      <div class="mcard-badge"><span class="badge badge-g">✅ Ур.${m.lvl}</span></div>
    </div>
    <div class="mcard-body">
      <div class="mcard-name">${m.nm}</div>
      <div class="mcard-city">${cflag(m.country)} ${m.city}, ${m.country}</div>
      <div class="mcard-tags">${m.skills.slice(0, 3).map(s => `<span class="mcard-tag">${s}</span>`).join('')}</div>
      <div class="mcard-foot">
        <span class="mcard-rate"><strong>${m.rate}★</strong> <span>(${m.reviews} отз.)</span></span>
        <span class="mcard-price">${m.price}€<span>/ч</span></span>
      </div>
    </div>
  </a>`;
}

// ── Country / category select options ─────────────────────
function coOptions(sel) {
  return CO.map(c => `<option value="${c.ru}"${c.ru === sel ? ' selected' : ''}>${c.f} ${c.ru}</option>`).join('');
}
function catOptions(sel) {
  return `<option value="">Все категории</option>` +
    SK.map(s => `<option value="${s.id}"${s.id === sel ? ' selected' : ''}>${s.i} ${s.ru}</option>`).join('');
}

// ── Reveal on scroll ───────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

// ── Nav logo HTML helper ───────────────────────────────────
// Используется в шапке всех страниц
function navLogoHTML() {
  return `<a href="index.html" class="nav-logo">
    <img src="${LOGO_SRC}" alt="${SITE_NAME}" class="nav-logo-img">
  </a>`;
}
