// Jay × Hermes Memory Wiki — app.js
// Pure vanilla JS — no frameworks, works from file:// or HTTP

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  let state = {
    logs: [],
    topics: [],
    meta: {},
    view: 'recent',        // 'recent' | 'today' | 'logs' | 'topics' | 'topic-detail' | 'search'
    expandedLog: null,     // date string of expanded card
    activeTopic: null,     // topic name
    searchQuery: '',
  };

  // ── Data Loading ───────────────────────────────────────────────────────────
  async function loadJSON(path) {
    // Works for file:// if user allows local XHR, falls back gracefully
    try {
      const resp = await fetch(path);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      console.warn(`Failed to load ${path}:`, err);
      return null;
    }
  }

  async function loadAllData() {
    const base = getBasePath();
    const [logs, topics, meta] = await Promise.all([
      loadJSON(base + 'data/logs.json'),
      loadJSON(base + 'data/topics.json'),
      loadJSON(base + 'data/meta.json'),
    ]);
    state.logs = (logs || []).sort((a, b) => b.date.localeCompare(a.date));
    state.topics = topics || [];
    state.meta = meta || {};
    return true;
  }

  function getBasePath() {
    // When served from file:// the base is relative to index.html
    // When served from GitHub Pages it's also relative
    return './';
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatDate(dateStr) {
    try {
      const d = new Date(dateStr + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  }

  function isToday(dateStr) {
    const today = new Date();
    const d = new Date(dateStr + 'T00:00:00');
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  }

  function isWithinDays(dateStr, days) {
    const d = new Date(dateStr + 'T00:00:00');
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return d >= cutoff;
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escapeHtml(text).replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>');
  }

  function logMatchesSearch(log, q) {
    if (!q) return true;
    const lower = q.toLowerCase();
    const fields = [
      log.title, log.summary, log.date,
      ...(log.topics || []),
      ...(log.work_done || []),
      ...(log.key_decisions || []),
      ...(log.open_items || []),
    ];
    return fields.some(f => f && f.toLowerCase().includes(lower));
  }

  // ── SVG Icons ──────────────────────────────────────────────────────────────
  const icons = {
    today: `<svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 1v4M11 1v4M2 7h12"/></svg>`,
    logs:  `<svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4h12M2 8h8M2 12h6"/></svg>`,
    topics:`<svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="8" r="2.5"/><circle cx="11" cy="4.5" r="2"/><circle cx="11" cy="11.5" r="2"/><path d="M7.4 7.1l1.8-1.4M7.4 8.9l1.8 1.4"/></svg>`,
    search:`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" class="search-icon"><circle cx="6.5" cy="6.5" r="4"/><path d="M10.5 10.5l3 3"/></svg>`,
    check: `<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1.5,5 4,7.5 8.5,2.5"/></svg>`,
    warn:  `<svg class="open-icon" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 1.5l5.5 9.5H1L6.5 1.5z"/><path d="M6.5 5v3M6.5 9.5v.5"/></svg>`,
    chevron:`<svg class="log-chevron" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5l4 4 4-4"/></svg>`,
    recent:`<svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3.5l2.5 1.5"/></svg>`,
  };

  // ── Render Helpers ─────────────────────────────────────────────────────────
  function renderTopicPills(topics, query='') {
    if (!topics || !topics.length) return '';
    return `<div class="log-topic-pills">
      ${topics.map(t => `<span class="topic-pill" data-topic="${escapeHtml(t)}">${highlight(t, query)}</span>`).join('')}
    </div>`;
  }

  function renderLogCard(log, query='') {
    const isExpanded = state.expandedLog === log.date;
    const workDone = (log.work_done || []).map(item =>
      `<div class="work-item">${icons.check ? `<div class="work-check">${icons.check}</div>` : ''}<span>${highlight(item, query)}</span></div>`
    ).join('');
    const decisions = (log.key_decisions || []).map(item =>
      `<div class="decision-item"><div class="decision-dot"></div><span>${highlight(item, query)}</span></div>`
    ).join('');
    const openItems = (log.open_items || []).map(item =>
      `<div class="open-item">${icons.warn}<span>${highlight(item, query)}</span></div>`
    ).join('');

    return `<div class="log-card ${isExpanded ? 'expanded' : ''}" data-date="${escapeHtml(log.date)}">
      <div class="log-card-header">
        <div class="log-date-badge">${formatDate(log.date)}</div>
        <div class="log-card-title">${highlight(log.title || 'Untitled', query)}</div>
        ${renderTopicPills(log.topics, query)}
        ${icons.chevron}
      </div>
      ${isExpanded ? `<div class="log-card-body">
        ${log.summary ? `<div class="log-summary">${highlight(log.summary, query)}</div>` : ''}
        ${workDone ? `<div class="log-section">
          <div class="log-section-title">✅ Work Done</div>
          ${workDone}
        </div>` : ''}
        ${decisions ? `<div class="log-section">
          <div class="log-section-title">💡 Key Decisions</div>
          ${decisions}
        </div>` : ''}
        ${openItems ? `<div class="log-section">
          <div class="log-section-title">⚠️ Open Items</div>
          ${openItems}
        </div>` : ''}
      </div>` : ''}
    </div>`;
  }

  // ── Views ──────────────────────────────────────────────────────────────────
  function renderRecentView() {
    const recent = state.logs.filter(l => isWithinDays(l.date, 7));
    let html = `<div class="page-title">Recent Activity</div>
      <div class="page-subtitle">Last 7 days · ${recent.length} session${recent.length !== 1 ? 's' : ''}</div>`;
    if (!recent.length) {
      html += `<div class="empty-state"><div class="empty-state-icon">📭</div><p>No sessions in the last 7 days.</p></div>`;
    } else {
      html += recent.map(l => renderLogCard(l)).join('');
    }
    return html;
  }

  function renderTodayView() {
    const today = state.logs.find(l => isToday(l.date));
    let html = `<div class="page-title">Today</div>`;
    if (!today) {
      const todayStr = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
      html += `<div class="today-empty">
        <div style="font-size:28px;margin-bottom:12px;opacity:0.3">📅</div>
        <div style="font-size:14px;font-weight:500;color:var(--text-dim);margin-bottom:6px">${todayStr}</div>
        <div style="font-size:13px;color:var(--text-muted)">No session logged yet for today.</div>
      </div>`;
    } else {
      html += `<div class="page-subtitle">${formatDate(today.date)}</div>`;
      // Force expanded for today's card
      const saved = state.expandedLog;
      state.expandedLog = today.date;
      html += renderLogCard(today);
      state.expandedLog = saved;
    }
    return html;
  }

  function renderLogsView() {
    let html = `<div class="page-title">Daily Logs</div>
      <div class="page-subtitle">All sessions · ${state.logs.length} total</div>`;
    if (!state.logs.length) {
      html += `<div class="empty-state"><div class="empty-state-icon">📓</div><p>No logs yet.</p></div>`;
    } else {
      html += state.logs.map(l => renderLogCard(l)).join('');
    }
    return html;
  }

  function renderTopicsView() {
    let html = `<div class="page-title">Topics</div>
      <div class="page-subtitle">${state.topics.length} topics across all sessions</div>
      <div class="topics-grid">`;
    state.topics.forEach(t => {
      html += `<div class="topic-card ${state.activeTopic === t.name ? 'active' : ''}" data-topic="${escapeHtml(t.name)}">
        <span class="topic-name">${escapeHtml(t.name)}</span>
        <span class="topic-count">${t.count}</span>
      </div>`;
    });
    html += '</div>';

    if (state.activeTopic) {
      const filtered = state.logs.filter(l => l.topics && l.topics.includes(state.activeTopic));
      html += `<div class="page-title" style="font-size:16px;margin-bottom:8px">Sessions tagged: <span style="color:var(--accent)">${escapeHtml(state.activeTopic)}</span></div>`;
      if (!filtered.length) {
        html += `<div class="empty-state"><p>No sessions found for this topic.</p></div>`;
      } else {
        html += filtered.map(l => renderLogCard(l)).join('');
      }
    }
    return html;
  }

  function renderSearchView() {
    const q = state.searchQuery;
    const results = state.logs.filter(l => logMatchesSearch(l, q));
    let html = `<div class="page-title">Search Results</div>
      <div class="search-results-header">${results.length} result${results.length !== 1 ? 's' : ''} for "<strong>${escapeHtml(q)}</strong>"</div>`;
    if (!results.length) {
      html += `<div class="empty-state"><div class="empty-state-icon">🔍</div><p>No results found for "${escapeHtml(q)}"</p></div>`;
    } else {
      html += results.map(l => renderLogCard(l, q)).join('');
    }
    return html;
  }

  // ── Main Render ────────────────────────────────────────────────────────────
  function render() {
    const main = document.getElementById('main-content');
    if (!main) return;

    let html = '';
    switch (state.view) {
      case 'today':   html = renderTodayView(); break;
      case 'logs':    html = renderLogsView(); break;
      case 'topics':  html = renderTopicsView(); break;
      case 'search':  html = renderSearchView(); break;
      default:        html = renderRecentView(); break;
    }
    main.innerHTML = html;
    bindCardEvents();
    updateSidebarActive();
    updateMobileTabsActive();
    renderSidebarLogs();
  }

  function renderSidebarLogs() {
    const container = document.getElementById('sidebar-log-list');
    if (!container) return;
    const recent = state.logs.slice(0, 12);
    container.innerHTML = recent.map(l =>
      `<div class="sidebar-log-item ${state.expandedLog === l.date && state.view === 'logs' ? 'active' : ''}" data-date="${escapeHtml(l.date)}" data-view="logs">
        <div class="sidebar-log-date">${formatDate(l.date)}</div>
        <div class="sidebar-log-title">${escapeHtml(l.title || 'Untitled')}</div>
      </div>`
    ).join('');

    container.querySelectorAll('.sidebar-log-item').forEach(el => {
      el.addEventListener('click', () => {
        state.view = 'logs';
        state.expandedLog = el.dataset.date;
        state.searchQuery = '';
        render();
      });
    });
  }

  // ── Event Binding ──────────────────────────────────────────────────────────
  function bindCardEvents() {
    // Log card toggle
    document.querySelectorAll('.log-card').forEach(card => {
      const header = card.querySelector('.log-card-header');
      if (!header) return;
      header.addEventListener('click', (e) => {
        // Don't expand if clicking a topic pill
        if (e.target.closest('.topic-pill')) return;
        const date = card.dataset.date;
        state.expandedLog = state.expandedLog === date ? null : date;
        render();
      });
    });

    // Topic pill clicks (inside cards)
    document.querySelectorAll('.topic-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        state.activeTopic = pill.dataset.topic;
        state.view = 'topics';
        state.searchQuery = '';
        render();
      });
    });

    // Topic card clicks (in topics view)
    document.querySelectorAll('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.topic;
        state.activeTopic = state.activeTopic === name ? null : name;
        render();
      });
    });
  }

  function updateSidebarActive() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === state.view);
    });
  }

  function updateMobileTabsActive() {
    document.querySelectorAll('.mobile-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === state.view);
    });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  function navigate(view) {
    state.view = view;
    state.searchQuery = '';
    if (view !== 'topics') state.activeTopic = null;
    document.getElementById('search-box').value = '';
    render();
  }

  // ── Search ─────────────────────────────────────────────────────────────────
  let searchTimeout;
  function onSearch(q) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = q.trim();
      if (state.searchQuery) {
        state.view = 'search';
      } else {
        state.view = 'recent';
      }
      render();
    }, 180);
  }

  // ── Build UI ───────────────────────────────────────────────────────────────
  function buildUI() {
    const app = document.getElementById('app');

    // Header
    const lastUpdated = state.meta.last_updated
      ? `Updated ${formatDate(state.meta.last_updated)}`
      : '';

    app.innerHTML = `
      <header id="header">
        <div class="header-brand">
          <div class="header-title">${escapeHtml(state.meta.site_title || 'Jay × Hermes')}</div>
          <div class="header-subtitle">${escapeHtml(state.meta.subtitle || 'Memory Wiki')}</div>
        </div>
        ${lastUpdated ? `<div class="header-meta">· ${escapeHtml(lastUpdated)}</div>` : ''}
        <div class="header-spacer"></div>
        <div class="search-wrap">
          ${icons.search}
          <input id="search-box" type="search" placeholder="Search sessions…" autocomplete="off" spellcheck="false"/>
        </div>
      </header>

      <div id="mobile-tabs">
        <button class="mobile-tab active" data-view="recent">Recent</button>
        <button class="mobile-tab" data-view="today">Today</button>
        <button class="mobile-tab" data-view="logs">Logs</button>
        <button class="mobile-tab" data-view="topics">Topics</button>
      </div>

      <div id="body">
        <nav id="sidebar">
          <div class="sidebar-section">
            <div class="sidebar-section-label">Navigation</div>
            <button class="nav-item active" data-view="recent">${icons.recent} Recent Activity <span class="nav-badge">7d</span></button>
            <button class="nav-item" data-view="today">${icons.today} Today</button>
          </div>
          <div class="sidebar-divider"></div>
          <div class="sidebar-section">
            <div class="sidebar-section-label">Archive</div>
            <button class="nav-item" data-view="logs">${icons.logs} Daily Logs <span class="nav-badge">${state.logs.length}</span></button>
            <button class="nav-item" data-view="topics">${icons.topics} Topics <span class="nav-badge">${state.topics.length}</span></button>
          </div>
          <div class="sidebar-divider"></div>
          <div class="sidebar-section">
            <div class="sidebar-section-label">Recent Sessions</div>
            <div class="sidebar-log-list" id="sidebar-log-list"></div>
          </div>
        </nav>

        <main id="main">
          <div id="main-content"></div>
        </main>
      </div>
    `;

    // Nav click events
    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.view));
    });

    // Mobile tab events
    document.querySelectorAll('.mobile-tab[data-view]').forEach(tab => {
      tab.addEventListener('click', () => navigate(tab.dataset.view));
    });

    // Search
    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', e => onSearch(e.target.value));
    searchBox.addEventListener('keydown', e => { if (e.key === 'Escape') { searchBox.value = ''; navigate('recent'); } });

    render();
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  async function init() {
    const app = document.getElementById('app');
    app.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#666;font-size:13px;">Loading…</div>`;

    const ok = await loadAllData();
    if (!ok) {
      app.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#ef4444;font-size:13px;">
        Failed to load data. If opening from file://, run a local server or allow local file access.<br>
        <code style="margin-left:8px;font-size:11px">python -m http.server 8080</code>
      </div>`;
      return;
    }

    buildUI();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
