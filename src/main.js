/* ============================================
   FORMULAAI — MAIN APPLICATION ENTRY POINT
   Router + App Shell
   ============================================ */

import { createNavigation, updateNavActive } from './components/navigation.js';
import { createHomePage } from './pages/home.js';
import { createRaceEngineerPage } from './pages/race-engineer.js';
import { createLiveRacePage } from './pages/live-race.js';
import { createDriversPage } from './pages/drivers.js';
import { createTeamsPage } from './pages/teams.js';
import { createCircuitsPage } from './pages/circuits.js';
import { createCalendarPage } from './pages/calendar.js';
import { createNewsPage } from './pages/news.js';
import { createAnalyticsPage } from './pages/analytics.js';

// ── PAGE REGISTRY ──────────────────────────────────
const pages = {
  'home':          createHomePage,
  'race-engineer': createRaceEngineerPage,
  'live-race':     createLiveRacePage,
  'drivers':       createDriversPage,
  'teams':         createTeamsPage,
  'circuits':      createCircuitsPage,
  'calendar':      createCalendarPage,
  'news':          createNewsPage,
  'analytics':     createAnalyticsPage,
};

// ── TOPBAR METADATA ─────────────────────────────────
const pageMetadata = {
  'home':          { title: 'Home',          subtitle: 'Your AI motorsport intelligence platform' },
  'race-engineer': { title: 'Race Engineer', subtitle: 'AI-powered race strategy assistant' },
  'live-race':     { title: 'Live Race',     subtitle: '🔴 British Grand Prix · Round 12' },
  'drivers':       { title: 'Drivers',       subtitle: '2025 F1 World Championship' },
  'teams':         { title: 'Constructors',  subtitle: '2025 F1 World Constructors Championship' },
  'circuits':      { title: 'Circuits',      subtitle: '24 circuits on the 2025 calendar' },
  'calendar':      { title: 'Calendar',      subtitle: '2025 World Championship schedule' },
  'news':          { title: 'News',          subtitle: 'Latest race updates and analysis' },
  'analytics':     { title: 'Analytics',     subtitle: 'Race data, trends, and insights' },
};

// ── ROUTER ─────────────────────────────────────────
class Router {
  constructor() {
    this.currentPage = 'home';
    this.contentEl = null;
    this.topbarTitleEl = null;
    this.topbarSubtitleEl = null;
  }

  navigate(pageId) {
    if (!pages[pageId]) pageId = 'home';
    this.currentPage = pageId;

    // Update URL hash
    history.pushState(null, '', `#${pageId}`);

    // Update navigation active state
    updateNavActive(pageId);

    // Update topbar
    const meta = pageMetadata[pageId] || {};
    if (this.topbarTitleEl) this.topbarTitleEl.textContent = meta.title || 'FormulaAI';
    if (this.topbarSubtitleEl) this.topbarSubtitleEl.textContent = meta.subtitle || '';

    // Hide topbar on race-engineer page (has its own topbar)
    if (this.topbarEl) {
      this.topbarEl.style.display = pageId === 'race-engineer' ? 'none' : 'flex';
    }

    // Clear and render new page
    if (this.contentEl) {
      this.contentEl.innerHTML = '';
      const factory = pages[pageId];
      const pageEl = factory(this);
      pageEl.classList.add('page-enter');
      this.contentEl.appendChild(pageEl);
    }

    // Scroll to top
    if (this.contentEl) this.contentEl.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}

// ── APP INITIALIZATION ─────────────────────────────
function initApp() {
  const app = document.getElementById('app');
  const router = new Router();

  // ── NAVIGATION ──
  const { sidebar, mobileNav, fab } = createNavigation(router);
  app.appendChild(sidebar);
  app.appendChild(mobileNav);
  app.appendChild(fab);

  // ── MAIN CONTENT AREA ──
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  mainContent.id = 'main-content';

  // ── TOPBAR ──
  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.id = 'topbar';
  
  const topbarLeft = document.createElement('div');
  topbarLeft.className = 'topbar-left';

  // Mobile logo (visible on mobile)
  const mobileLogo = document.createElement('a');
  mobileLogo.href = '#home';
  mobileLogo.style.cssText = 'display:none;align-items:center;gap:8px;text-decoration:none;flex-shrink:0';
  mobileLogo.innerHTML = `
    <div style="width:28px;height:28px;background:var(--accent-red);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff">F</div>
    <span style="font-size:var(--text-base);font-weight:900;color:var(--text-primary);letter-spacing:-0.02em">FormulaAI</span>
  `;
  mobileLogo.addEventListener('click', (e) => { e.preventDefault(); router.navigate('home'); });

  const breadcrumb = document.createElement('div');
  breadcrumb.style.cssText = 'flex:1;min-width:0';
  
  const titleEl = document.createElement('div');
  titleEl.style.cssText = 'font-size:var(--text-base);font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
  titleEl.textContent = 'Home';
  
  const subtitleEl = document.createElement('div');
  subtitleEl.style.cssText = 'font-size:var(--text-xs);color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px';
  subtitleEl.textContent = 'Your AI motorsport intelligence platform';

  breadcrumb.appendChild(titleEl);
  breadcrumb.appendChild(subtitleEl);
  topbarLeft.appendChild(mobileLogo);
  topbarLeft.appendChild(breadcrumb);

  const topbarRight = document.createElement('div');
  topbarRight.className = 'topbar-right';
  topbarRight.innerHTML = `
    <!-- Race status pill -->
    <div style="display:flex;align-items:center;gap:6px;padding:5px 12px;background:var(--accent-red-soft);border:1px solid rgba(225,6,0,0.2);border-radius:9999px;cursor:pointer" id="live-pill">
      <span class="live-dot" style="width:6px;height:6px"></span>
      <span style="font-size:11px;font-weight:700;color:var(--accent-red)">LIVE</span>
      <span style="font-size:11px;color:var(--text-muted)">GBR R12</span>
    </div>
    
    <!-- Search -->
    <button class="icon-btn" id="topbar-search-btn" data-tooltip="Search" aria-label="Search">🔍</button>
    
    <!-- AI Button -->
    <button class="btn btn-primary btn-sm" id="topbar-ai-btn" style="gap:6px" aria-label="Open Race Engineer">
      <span>◈</span>
      <span style="display:none" id="ai-btn-label">Race Engineer</span>
    </button>
    
    <!-- Profile -->
    <div class="avatar avatar-sm" style="background:var(--bg-elevated);border:1px solid var(--border-subtle);cursor:pointer;font-size:12px" id="profile-btn">👤</div>
  `;

  topbar.appendChild(topbarLeft);
  topbar.appendChild(topbarRight);

  // Store refs in router
  router.topbarEl = topbar;
  router.topbarTitleEl = titleEl;
  router.topbarSubtitleEl = subtitleEl;

  // Topbar button handlers
  topbar.querySelector('#live-pill').addEventListener('click', () => router.navigate('live-race'));
  topbar.querySelector('#topbar-ai-btn').addEventListener('click', () => router.navigate('race-engineer'));

  mainContent.appendChild(topbar);

  // ── PAGE CONTAINER ──
  const pageContainer = document.createElement('div');
  pageContainer.id = 'page-container';
  router.contentEl = pageContainer;
  mainContent.appendChild(pageContainer);

  app.appendChild(mainContent);

  // ── TOAST CONTAINER ──
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);

  // ── RESPONSIVE TOPBAR ──
  function handleTopbarResize() {
    if (window.innerWidth < 768) {
      mobileLogo.style.display = 'flex';
      document.getElementById('ai-btn-label').style.display = 'none';
    } else {
      mobileLogo.style.display = 'none';
      if (window.innerWidth > 1100) {
        document.getElementById('ai-btn-label').style.display = 'block';
      }
    }
  }
  handleTopbarResize();
  window.addEventListener('resize', handleTopbarResize);

  // ── INITIAL ROUTE ──
  const hash = window.location.hash.replace('#', '') || 'home';
  router.navigate(pages[hash] ? hash : 'home');

  // ── BROWSER BACK/FORWARD ──
  window.addEventListener('popstate', () => {
    const h = window.location.hash.replace('#', '') || 'home';
    router.navigate(pages[h] ? h : 'home');
  });

  // ── SERVICE WORKER ──
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration failed - app still works
      });
    });
  }

  // ── WELCOME TOAST ──
  setTimeout(() => {
    showToast('🏎️ British GP is Live · Lap 34/52', 4000);
  }, 1500);
}

// ── TOAST UTILITY ─────────────────────────────────
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeIn 200ms reverse both';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

// ── BOOT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', initApp);
initApp();
