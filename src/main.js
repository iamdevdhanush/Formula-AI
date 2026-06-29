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

const pageMetadata = {
  'home':          { title: 'Home',          subtitle: 'Your AI motorsport intelligence platform' },
  'race-engineer': { title: 'Race Engineer', subtitle: 'AI-powered race strategy assistant' },
  'live-race':     { title: 'Live Race',     subtitle: 'Real-time session data' },
  'drivers':       { title: 'Drivers',       subtitle: 'Current F1 grid' },
  'teams':         { title: 'Constructors',  subtitle: 'World Constructors Championship' },
  'circuits':      { title: 'Circuits',      subtitle: 'Circuits on the current calendar' },
  'calendar':      { title: 'Calendar',      subtitle: 'World Championship schedule' },
  'news':          { title: 'News',          subtitle: 'Latest race updates and analysis' },
  'analytics':     { title: 'Analytics',     subtitle: 'Race data, trends, and insights' },
};

class Router {
  constructor() {
    this.currentPage = null;
    this.contentEl = null;
    this.topbarEl = null;
    this.topbarTitleEl = null;
    this.topbarSubtitleEl = null;
    this._resizeController = null;
  }

  navigate(pageId) {
    if (!pages[pageId]) pageId = 'home';
    if (pageId === this.currentPage) return;
    this.currentPage = pageId;

    if (this._resizeController) this._resizeController.abort();
    this._resizeController = new AbortController();

    history.pushState(null, '', '#' + pageId);
    updateNavActive(pageId);

    const meta = pageMetadata[pageId] || {};
    if (this.topbarTitleEl) this.topbarTitleEl.textContent = meta.title || 'FormulaAI';
    if (this.topbarSubtitleEl) this.topbarSubtitleEl.textContent = meta.subtitle || '';

    if (this.topbarEl) this.topbarEl.style.display = pageId === 'race-engineer' ? 'none' : 'flex';

    if (!this.contentEl) return;

    const container = this.contentEl;
    container.style.transition = 'opacity 120ms ease-out';
    container.style.opacity = '0';

    setTimeout(() => {
      container.innerHTML = '';
      const factory = pages[pageId];
      const pageEl = factory(this, this._resizeController.signal);
      pageEl.classList.add('page-enter');
      container.appendChild(pageEl);
      container.scrollTop = 0;
      requestAnimationFrame(() => { container.style.opacity = '1'; });
    }, 120);
  }
}

function initApp() {
  const app = document.getElementById('app');
  const router = new Router();

  const { sidebar, mobileNav, fab } = createNavigation(router);
  app.appendChild(sidebar);
  app.appendChild(mobileNav);
  app.appendChild(fab);

  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';
  mainContent.id = 'main-content';

  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.id = 'topbar';

  const topbarLeft = document.createElement('div');
  topbarLeft.className = 'topbar-left';

  const mobileLogo = document.createElement('a');
  mobileLogo.href = '#home';
  mobileLogo.style.cssText = 'display:none;align-items:center;gap:8px;text-decoration:none;flex-shrink:0';
  mobileLogo.innerHTML = '<div style="width:28px;height:28px;background:var(--accent-red);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff">F</div><span style="font-size:var(--text-base);font-weight:900;color:var(--text-primary);letter-spacing:-0.02em">FormulaAI</span>';
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
  topbarRight.innerHTML = '<div style="display:flex;align-items:center;gap:6px;padding:5px 12px;background:var(--accent-red-soft);border:1px solid rgba(225,6,0,0.2);border-radius:9999px;cursor:pointer" id="live-pill"><span class="live-dot" style="width:6px;height:6px"></span><span style="font-size:11px;font-weight:700;color:var(--accent-red)">LIVE</span><span style="font-size:11px;color:var(--text-muted)">OpenF1</span></div><button class="icon-btn" id="topbar-search-btn" data-tooltip="Search" aria-label="Search">\u{1F50D}</button><button class="btn btn-primary btn-sm" id="topbar-ai-btn" style="gap:6px" aria-label="Open Race Engineer"><span>\u25C7</span><span style="display:none" id="ai-btn-label">Race Engineer</span></button><div class="avatar avatar-sm" style="background:var(--bg-elevated);border:1px solid var(--border-subtle);cursor:pointer;font-size:12px" id="profile-btn">\u{1F464}</div>';

  topbar.appendChild(topbarLeft);
  topbar.appendChild(topbarRight);

  router.topbarEl = topbar;
  router.topbarTitleEl = titleEl;
  router.topbarSubtitleEl = subtitleEl;

  topbar.querySelector('#live-pill').addEventListener('click', () => router.navigate('live-race'));
  topbar.querySelector('#topbar-ai-btn').addEventListener('click', () => router.navigate('race-engineer'));

  mainContent.appendChild(topbar);

  const pageContainer = document.createElement('div');
  pageContainer.id = 'page-container';
  router.contentEl = pageContainer;
  mainContent.appendChild(pageContainer);
  app.appendChild(mainContent);

  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);

  function handleTopbarResize() {
    if (window.innerWidth < 768) {
      mobileLogo.style.display = 'flex';
      document.getElementById('ai-btn-label').style.display = 'none';
    } else {
      mobileLogo.style.display = 'none';
      if (window.innerWidth > 1100) document.getElementById('ai-btn-label').style.display = 'block';
    }
  }
  handleTopbarResize();
  window.addEventListener('resize', handleTopbarResize);

  const hash = window.location.hash.replace('#', '') || 'home';
  router.navigate(pages[hash] ? hash : 'home');

  window.addEventListener('popstate', () => {
    const h = window.location.hash.replace('#', '') || 'home';
    router.navigate(pages[h] ? h : 'home');
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
  }
}

let _booted = false;
function boot() {
  if (_booted) return;
  _booted = true;
  initApp();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
