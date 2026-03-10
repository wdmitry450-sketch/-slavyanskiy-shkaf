/**
 * components.js — Reusable UI components
 * Pre-built HTML components for consistent rendering
 */

const Components = {
  /**
   * Render master card
   * @param {object} master
   * @returns {string} HTML
   */
  masterCard: (master) => {
    const topBadges = [
      master.topCity ? '<span class="badge badge-y" style="font-size:9px">🏆 TOP</span>' : '',
      master.topCountry ? '<span class="badge badge-o" style="font-size:9px">🌍 TOP</span>' : ''
    ].filter(Boolean).join('');
    
    return `
      <a class="mcard" href="profile.html?id=${master.id}">
        <div class="mc-top">
          <div class="mc-ava">${master.avatar || '👤'}</div>
          <div class="mc-info">
            <div class="mc-name">${Helper.sanitizeHtml(master.name)} ${topBadges}</div>
            <div class="mc-loc">${Helper.flagImg(master.iso)} ${Helper.sanitizeHtml(master.city)}, ${Helper.sanitizeHtml(master.country)}</div>
          </div>
          <div class="mc-rate">${master.rate || 0}🔨</div>
        </div>
        <div class="mc-skills">${(master.skills || []).slice(0, 3).map(s => `<span class="msk">${s}</span>`).join('')}</div>
        <div class="mc-foot">
          <span class="mc-price">${master.price || 0}€${i18n.t('general.per_hour')}</span>
          ${master.online ? '<span class="badge badge-g">🟢 ' + i18n.t('lbl.online') + '</span>' : '<span class="badge">⚫</span>'}
        </div>
      </a>
    `;
  },
  
  /**
   * Render rating badge
   * @param {number} rating
   * @returns {string} HTML
   */
  ratingBadge: (rating) => {
    const stars = Math.round(rating);
    const starsHtml = '⭐'.repeat(Math.min(stars, 5));
    return `<span style="color:var(--yellow);font-weight:900">${starsHtml}</span>`;
  },
  
  /**
   * Render status badge
   * @param {string} status - 'open', 'in_progress', 'completed', 'cancelled'
   * @returns {string} HTML
   */
  statusBadge: (status) => {
    const statuses = {
      open: { icon: '🟢', text: i18n.t('status.open'), color: 'badge-g' },
      in_progress: { icon: '🔄', text: i18n.t('status.in_progress'), color: 'badge-y' },
      completed: { icon: '✅', text: i18n.t('status.completed'), color: 'badge-b' },
      cancelled: { icon: '❌', text: i18n.t('status.cancelled'), color: 'badge-r' }
    };
    
    const s = statuses[status] || statuses.open;
    return `<span class="badge ${s.color}"> ${s.icon} ${s.text}</span>`;
  },
  
  /**
   * Render button
   * @param {string} text
   * @param {string} type - 'primary', 'outline', 'danger', 'warn'
   * @param {string} onclick
   * @returns {string} HTML
   */
  button: (text, type = 'primary', onclick = '') => {
    const buttonClass = {
      primary: 'btn-p',
      outline: 'btn-o',
      danger: 'btn-r',
      warn: 'btn-y'
    }[type] || 'btn-p';
    
    return `<button class="btn ${buttonClass}" onclick="${onclick}">${text}</button>`;
  },
  
  /**
   * Render form group
   * @param {string} label
   * @param {string} inputHtml
   * @param {string} error
   * @returns {string} HTML
   */
  formGroup: (label, inputHtml, error = '') => {
    return `
      <div style="margin-bottom:12px">
        <label style="font-size:12px;font-weight:700;color:var(--ink3);margin-bottom:5px;display:block">${label}</label>
        ${inputHtml}
        ${error ? `<div style="font-size:11px;color:var(--red);margin-top:4px">${error}</div>` : ''}
      </div>
    `;
  },
  
  /**
   * Render loader
   * @returns {string} HTML
   */
  loader: () => {
    return `
      <div style="display:flex;align-items:center;justify-content:center;padding:40px">
        <div style="width:40px;height:40px;border:4px solid var(--bdr);border-top:4px solid var(--g);
                    border-radius:50%;animation:spin 1s linear infinite"></div>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  },
  
  /**
   * Render empty state
   * @param {string} icon
   * @param {string} title
   * @param {string} message
   * @returns {string} HTML
   */
  emptyState: (icon = '📭', title = 'No data', message = '') => {
    return `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:48px;margin-bottom:12px">${icon}</div>
        <h3 style="font-size:16px;font-weight:800;margin-bottom:8px">${title}</h3>
        ${message ? `<p style="font-size:13px;color:var(--ink3)">${message}</p>` : ''}
      </div>
    `;
  },
  
  /**
   * Render alert
   * @param {string} type - 'success', 'error', 'warning', 'info'
   * @param {string} message
   * @returns {string} HTML
   */
  alert: (type, message) => {
    const alerts = {
      success: { bg: 'rgba(0,214,143,.1)', border: 'var(--g)', icon: '✅', color: 'var(--g)' },
      error: { bg: 'rgba(239,68,68,.1)', border: 'var(--red)', icon: '❌', color: 'var(--red)' },
      warning: { bg: 'rgba(251,191,36,.1)', border: 'var(--yellow)', icon: '⚠️', color: 'var(--yellow)' },
      info: { bg: 'rgba(124,111,255,.1)', border: 'var(--acc)', icon: 'ℹ️', color: 'var(--acc)' }
    };
    
    const alert = alerts[type] || alerts.info;
    return `
      <div style="background:${alert.bg};border-left:4px solid ${alert.border};padding:12px 14px;
                  border-radius:8px;display:flex;align-items:flex-start;gap:10px;margin-bottom:12px">
        <span style="font-size:18px">${alert.icon}</span>
        <span style="color:${alert.color};font-size:13px">${message}</span>
      </div>
    `;
  },
  
  /**
   * Render tab navigation
   * @param {array} tabs - [{ name, icon, active }]
   * @param {Function} onClick
   * @returns {string} HTML
   */
  tabs: (tabs, onClick = '') => {
    return `
      <div style="display:flex;gap:8px;border-bottom:1px solid var(--bdr);overflow-x:auto">
        ${tabs.map((tab, i) => `
          <button style="padding:10px 14px;border:none;background:none;color:${tab.active ? 'var(--g)' : 'var(--ink3)'};
                         border-bottom:3px solid ${tab.active ? 'var(--g)' : 'transparent'};cursor:pointer;
                         font-weight:${tab.active ? '800' : '600'};white-space:nowrap;transition:.2s"
                  onclick="${onClick}('${i}')">${tab.icon || ''} ${tab.name}</button>
        `).join('')}
      </div>
    `;
  }
};
