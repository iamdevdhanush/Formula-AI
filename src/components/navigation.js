/* ============================================
   FORMULAAI — NAVIGATION COMPONENT
   Sidebar (desktop) + Bottom nav (mobile)
   ============================================ */

const navItems = [
  { id: 'home',          icon: '⬡',  label: 'Home',         emoji: '🏠' },
  { id: 'race-engineer', icon: '◈',  label: 'Race Engineer', emoji: '🤖', ai: true },
  { id: 'live-race',     icon: '◉',  label: 'Live Race',     emoji: '🔴', live: true },
  { id: 'news',          icon: '◫',  label: 'News',          emoji: '📰' },
  { id: 'analytics',     icon: '◰',  label: 'Analytics',     emoji: '📊' },
  { id: 'drivers',       icon: '◎',  label: 'Drivers',       emoji: '👤' },
  { id: 'teams',         icon: '◱',  label: 'Teams',         emoji: '🏎️' },
  { id: 'circuits',      icon: '◲',  label: 'Circuits',      emoji: '🏁' },
  { id: 'calendar',      icon: '◳',  label: 'Calendar',      emoji: '📅' },
];

const mobileNavItems = [
  { id: 'home',          icon: '⬡',  label: 'Home'   },
  { id: 'live-race',     icon: '◉',  label: 'Live'   },
  { id: 'race-engineer', icon: '◈',  label: 'AI'     },
  { id: 'drivers',       icon: '◎',  label: 'Drivers'},
  { id: 'news',          icon: '◫',  label: 'News'   },
];

export function createNavigation(router) {
  // ── SIDEBAR ──────────────────────────────────────
  const sidebar = document.createElement('nav');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';

  // Logo
  const logoEl = document.createElement('a');
  logoEl.className = 'sidebar-logo';
  logoEl.href = '#';
  logoEl.innerHTML = `
    <div class="sidebar-logo-mark">F</div>
    <span class="sidebar-logo-text">FormulaAI</span>
  `;
  logoEl.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('home');
  });
  sidebar.appendChild(logoEl);

  // Nav items
  const navEl = document.createElement('div');
  navEl.className = 'sidebar-nav';

  navItems.forEach(item => {
    const el = document.createElement('a');
    el.className = 'nav-item';
    el.dataset.page = item.id;
    el.href = `#${item.id}`;
    el.innerHTML = `
      <span class="nav-item-icon">${item.emoji}</span>
      <span class="nav-item-label">
        ${item.label}
        ${item.live ? '<span class="live-dot" style="margin-left:4px"></span>' : ''}
        ${item.ai ? '<span style="font-size:9px;color:var(--accent-cyan);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-left:4px">AI</span>' : ''}
      </span>
    `;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(item.id);
      // Close sidebar on mobile-ish
      if (window.innerWidth < 1100) {
        sidebar.classList.remove('expanded');
      }
    });
    navEl.appendChild(el);
  });

  sidebar.appendChild(navEl);

  // Divider + Toggle button
  const divider = document.createElement('div');
  divider.className = 'sidebar-divider';
  sidebar.appendChild(divider);

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'nav-item sidebar-toggle';
  toggleBtn.style.cssText = 'width:calc(100% - 16px); margin: 0 8px;';
  toggleBtn.innerHTML = `
    <span class="nav-item-icon" id="toggle-icon">→</span>
    <span class="nav-item-label">Collapse</span>
  `;
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
    const icon = document.getElementById('toggle-icon');
    if (sidebar.classList.contains('expanded')) {
      icon.textContent = '←';
    } else {
      icon.textContent = '→';
    }
  });
  sidebar.appendChild(toggleBtn);

  // ── MOBILE NAV ───────────────────────────────────
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.id = 'mobile-nav';

  const mobileNavItems_el = document.createElement('div');
  mobileNavItems_el.className = 'mobile-nav-items';

  mobileNavItems.forEach(item => {
    const el = document.createElement('button');
    el.className = 'mobile-nav-item';
    el.dataset.page = item.id;
    el.innerHTML = `
      <span class="mobile-nav-icon">${item.icon}</span>
      <span class="mobile-nav-label">${item.label}</span>
    `;
    el.addEventListener('click', () => {
      router.navigate(item.id);
    });
    mobileNavItems_el.appendChild(el);
  });

  mobileNav.appendChild(mobileNavItems_el);

  // Floating AI Button
  const fab = document.createElement('button');
  fab.className = 'fab-ai';
  fab.id = 'fab-ai';
  fab.setAttribute('aria-label', 'Open Race Engineer AI');
  fab.innerHTML = '◈';
  fab.addEventListener('click', () => {
    router.navigate('race-engineer');
  });

  return { sidebar, mobileNav, fab };
}

export function updateNavActive(pageId) {
  // Desktop sidebar
  document.querySelectorAll('.sidebar .nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });
  // Mobile nav
  document.querySelectorAll('.mobile-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });
}
