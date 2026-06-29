/* ============================================
   FORMULAAI — DRIVERS PAGE
   Editorial driver profiles
   ============================================ */

import { drivers, standings } from '../data/mock-data.js';
import { createDriverCard, createSparkline } from '../components/cards.js';

export function createDriversPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  // ── HERO ────────────────────────────────────────
  const hero = document.createElement('div');
  hero.style.cssText = `
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-elevated) 100%);
    border-bottom: 1px solid var(--border-subtle);
    padding: 48px 40px 32px;
    position: relative;
    overflow: hidden;
  `;
  hero.innerHTML = `
    <div style="position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:var(--accent-red);filter:blur(100px);opacity:0.07;border-radius:50%"></div>
    <div style="position:relative;z-index:1">
      <div style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">2025 Season</div>
      <h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary);margin-bottom:8px">Drivers</h1>
      <p style="font-size:var(--text-base);color:var(--text-muted);max-width:500px">Every driver on the 2025 Formula 1 grid. Ask your Race Engineer AI for deep analysis on any driver.</p>
    </div>
  `;
  page.appendChild(hero);

  // ── CONTENT ────────────────────────────────────
  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1400px;margin:0 auto';

  // Featured driver (WDC leader)
  const featured = createFeaturedDriver(drivers[0]);
  content.appendChild(featured);

  // Grid of driver cards
  const gridHeader = document.createElement('div');
  gridHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;margin-top:40px';
  gridHeader.innerHTML = `
    <div style="font-size:var(--text-lg);font-weight:700;color:var(--text-primary)">All Drivers</div>
    <div style="display:flex;gap:8px">
      <button class="tag active">All</button>
      <button class="tag">By Team</button>
      <button class="tag">By Points</button>
    </div>
  `;
  content.appendChild(gridHeader);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:16px';

  drivers.forEach((driver, i) => {
    const card = createDriverCard(driver);
    card.style.animationDelay = `${i * 60}ms`;
    grid.appendChild(card);
  });

  content.appendChild(grid);

  // Responsive
  function onResize() {
    const w = window.innerWidth;
    if (w < 600) grid.style.gridTemplateColumns = '1fr';
    else if (w < 1000) grid.style.gridTemplateColumns = 'repeat(2,1fr)';
    else grid.style.gridTemplateColumns = 'repeat(3,1fr)';
  }
  onResize();
  window.addEventListener('resize', onResize, { signal });

  page.appendChild(content);
  return page;
}

function createFeaturedDriver(driver) {
  const card = document.createElement('div');
  card.style.cssText = `
    background: linear-gradient(135deg, ${driver.teamColor}15 0%, var(--bg-surface) 60%);
    border: 1px solid ${driver.teamColor}30;
    border-radius: 20px;
    padding: 32px;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: center;
  `;

  card.innerHTML = `
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <span style="font-size:28px">${driver.flag}</span>
        <span class="badge" style="background:${driver.teamColor}20;color:${driver.teamColor};border:1px solid ${driver.teamColor}40">${driver.team}</span>
        <span class="badge badge-surface">WDC Leader</span>
      </div>
      <h2 style="font-size:clamp(24px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary);margin-bottom:8px">${driver.name}</h2>
      <p style="font-size:var(--text-base);color:var(--text-muted);max-width:480px;line-height:1.7;margin-bottom:24px">${driver.bio}</p>
      
      <div style="display:grid;grid-template-columns:repeat(5,auto);gap:24px;margin-bottom:24px">
        ${[
          { label: 'Championships', value: driver.championships, color: '#ffd700' },
          { label: 'Race Wins', value: driver.wins, color: driver.teamColor },
          { label: 'Podiums', value: driver.podiums, color: 'var(--text-primary)' },
          { label: 'Pole Positions', value: driver.poles, color: 'var(--accent-cyan)' },
          { label: 'Points 2025', value: driver.points, color: 'var(--accent-red)' },
        ].map(s => `
          <div>
            <div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:800;color:${s.color}">${s.value}</div>
            <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">${s.label}</div>
          </div>
        `).join('')}
      </div>
      
      <button class="btn btn-secondary btn-sm">◈ Analyze with AI →</button>
    </div>
    
    <div style="text-align:center">
      <div style="font-family:var(--font-mono);font-size:120px;font-weight:900;color:${driver.teamColor};opacity:0.15;line-height:1;user-select:none">${driver.number}</div>
    </div>
  `;

  return card;
}
