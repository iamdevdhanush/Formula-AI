/* ============================================
   FORMULAAI — CIRCUITS PAGE
   ============================================ */
import { circuits } from '../data/mock-data.js';
import { createCircuitCard } from '../components/cards.js';

export function createCircuitsPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = `
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-elevated) 100%);
    border-bottom: 1px solid var(--border-subtle);
    padding: 48px 40px 32px;
    position: relative; overflow: hidden;
  `;
  hero.innerHTML = `
    <div style="position:absolute;top:-60px;right:-40px;width:280px;height:280px;background:var(--accent-cyan);filter:blur(100px);opacity:0.06;border-radius:50%"></div>
    <div style="position:relative;z-index:1">
      <div style="font-size:11px;font-weight:700;color:var(--accent-cyan);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">2025 Calendar</div>
      <h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Circuits</h1>
      <p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">Every circuit on the 2025 Formula 1 World Championship calendar.</p>
    </div>
  `;
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1400px;margin:0 auto';

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:20px';

  circuits.forEach((circuit, i) => {
    const card = createCircuitCard(circuit);
    card.style.animationDelay = `${i * 60}ms`;
    card.className += ' anim-fade-up';
    grid.appendChild(card);
  });

  content.appendChild(grid);

  function onResize() {
    const w = window.innerWidth;
    if (w < 640) grid.style.gridTemplateColumns = '1fr';
    else if (w < 1000) grid.style.gridTemplateColumns = 'repeat(2,1fr)';
    else grid.style.gridTemplateColumns = 'repeat(3,1fr)';
  }
  onResize();
  window.addEventListener('resize', onResize, { signal });

  page.appendChild(content);
  return page;
}
