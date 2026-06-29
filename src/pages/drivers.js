import { getDrivers } from '../services/drivers.service.js';
import { getDriverStandings } from '../services/standings.service.js';
import { createDriverCard } from '../components/cards.js';
import { createSkeleton, createErrorState, createEmptyState } from '../components/states.js';

export function createDriversPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = 'background:linear-gradient(135deg,var(--bg-primary) 0%,var(--bg-elevated) 100%);border-bottom:1px solid var(--border-subtle);padding:48px 40px 32px;position:relative;overflow:hidden';
  hero.innerHTML = '<div style="position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:var(--accent-red);filter:blur(100px);opacity:0.07;border-radius:50%"></div><div style="position:relative;z-index:1"><div style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">Current Season</div><h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary);margin-bottom:8px">Drivers</h1><p style="font-size:var(--text-base);color:var(--text-muted);max-width:500px">Every driver on the current Formula 1 grid. Data sourced from OpenF1 API.</p></div>';
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1400px;margin:0 auto';

  const featuredEl = document.createElement('div');
  featuredEl.id = 'drivers-featured';
  featuredEl.appendChild(createSkeleton('card'));
  content.appendChild(featuredEl);

  const gridHeader = document.createElement('div');
  gridHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;margin-top:40px';
  gridHeader.innerHTML = '<div style="font-size:var(--text-lg);font-weight:700;color:var(--text-primary)">All Drivers</div>';
  content.appendChild(gridHeader);

  const gridEl = document.createElement('div');
  gridEl.id = 'drivers-grid';
  gridEl.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:16px';
  for (let i = 0; i < 6; i++) gridEl.appendChild(createSkeleton('card'));
  content.appendChild(gridEl);

  page.appendChild(content);

  function onResize() {
    const w = window.innerWidth;
    if (w < 600) gridEl.style.gridTemplateColumns = '1fr';
    else if (w < 1000) gridEl.style.gridTemplateColumns = 'repeat(2,1fr)';
    else gridEl.style.gridTemplateColumns = 'repeat(3,1fr)';
  }
  onResize();
  window.addEventListener('resize', onResize, { signal });

  loadDrivers();

  return page;
}

async function loadDrivers() {
  try {
    const [drivers, standings] = await Promise.all([
      getDrivers(),
      getDriverStandings(),
    ]);

    const featuredEl = document.getElementById('drivers-featured');
    if (featuredEl && drivers.length > 0) {
      featuredEl.innerHTML = '';
      const leader = standings[0] || drivers[0];
      featuredEl.appendChild(createFeaturedDriver(leader));
    } else if (featuredEl) {
      featuredEl.innerHTML = '';
      featuredEl.appendChild(createEmptyState('Driver data is currently unavailable.'));
    }

    const gridEl = document.getElementById('drivers-grid');
    if (gridEl && drivers.length > 0) {
      gridEl.innerHTML = '';
      drivers.forEach((driver, i) => {
        const card = createDriverCard(driver);
        card.style.animationDelay = i * 60 + 'ms';
        gridEl.appendChild(card);
      });
    } else if (gridEl) {
      gridEl.innerHTML = '';
      gridEl.appendChild(createEmptyState('No driver data available.'));
    }
  } catch (e) {
    ['drivers-featured', 'drivers-grid'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = '';
        el.appendChild(createErrorState(e.message, loadDrivers));
      }
    });
  }
}

function createFeaturedDriver(driver) {
  const card = document.createElement('div');
  card.style.cssText = 'background:linear-gradient(135deg,' + (driver.teamColor || '#666') + '15 0%,var(--bg-surface) 60%);border:1px solid ' + (driver.teamColor || '#666') + '30;border-radius:20px;padding:32px;position:relative;overflow:hidden;display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center';

  const wins = driver.wins || 0;
  const podiums = driver.podiums || 0;
  const points = driver.points || 0;

  card.innerHTML = '<div><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">' + (driver.flag ? '<span style="font-size:28px">' + driver.flag + '</span>' : '') + '<span class="badge" style="background:' + (driver.teamColor || '#666') + '20;color:' + (driver.teamColor || '#666') + ';border:1px solid ' + (driver.teamColor || '#666') + '40">' + driver.team + '</span><span class="badge badge-surface">Points Leader</span></div><h2 style="font-size:clamp(24px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary);margin-bottom:8px">' + driver.driver + '</h2><p style="font-size:var(--text-base);color:var(--text-muted);max-width:480px;line-height:1.7;margin-bottom:24px">' + driver.nationality + ' driver racing for ' + driver.team + '. Current championship position: ' + driver.pos + ' with ' + driver.points + ' points.</p><div style="display:grid;grid-template-columns:repeat(3,auto);gap:24px;margin-bottom:24px"><div><div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:800;color:' + (driver.teamColor || '#ffd700') + '">' + wins + '</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Wins</div></div><div><div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:800;color:var(--text-primary)">' + podiums + '</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Podiums</div></div><div><div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:800;color:var(--accent-red)">' + points + '</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Points</div></div></div></div><div style="text-align:center"><div style="font-family:var(--font-mono);font-size:120px;font-weight:900;color:' + (driver.teamColor || '#666') + ';opacity:0.15;line-height:1;user-select:none">' + (driver.number || '') + '</div></div>';

  return card;
}
