/* ============================================
   FORMULAAI — TEAMS PAGE
   ============================================ */
import { teams } from '../data/mock-data.js';

export function createTeamsPage(router, signal) {
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
    <div style="position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:var(--accent-red);filter:blur(100px);opacity:0.06;border-radius:50%"></div>
    <div style="position:relative;z-index:1">
      <div style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">2025 Season</div>
      <h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Constructors</h1>
      <p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">The teams competing for the 2025 World Constructors' Championship.</p>
    </div>
  `;
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1400px;margin:0 auto;display:flex;flex-direction:column;gap:20px';

  teams.forEach((team, i) => {
    const card = createTeamCard(team, i);
    content.appendChild(card);
  });

  page.appendChild(content);
  return page;
}

function createTeamCard(team, rank) {
  const card = document.createElement('div');
  card.style.cssText = `
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-left: 4px solid ${team.color};
    border-radius: 16px;
    padding: 28px 32px;
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: 24px;
    align-items: center;
    cursor: pointer;
    transition: all 200ms var(--ease-out);
    animation: fadeUp 400ms var(--ease-out) ${rank * 80}ms both;
    position: relative;
    overflow: hidden;
  `;

  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'var(--border-default)';
    card.style.borderLeftColor = team.color;
    card.style.transform = 'translateX(4px)';
    card.style.background = `linear-gradient(135deg, ${team.color}08 0%, var(--bg-surface) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = 'var(--border-subtle)';
    card.style.borderLeftColor = team.color;
    card.style.transform = 'translateX(0)';
    card.style.background = 'var(--bg-surface)';
  });

  card.innerHTML = `
    <!-- Position -->
    <div style="text-align:center">
      <div style="font-family:var(--font-mono);font-size:40px;font-weight:900;color:${team.color};opacity:0.5;line-height:1">${team.position}</div>
      <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Rank</div>
    </div>
    
    <!-- Team info -->
    <div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap">
        <h2 style="font-size:var(--text-xl);font-weight:900;letter-spacing:-0.03em;color:var(--text-primary)">${team.name}</h2>
        ${team.championships > 0 ? `<span class="badge badge-amber">🏆 ${team.championships}x Champion</span>` : '<span class="badge badge-surface">Contender</span>'}
      </div>
      <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:16px">
        <span style="font-size:var(--text-xs);color:var(--text-muted)">⚙️ ${team.engine}</span>
        <span style="font-size:var(--text-xs);color:var(--text-muted)">📍 ${team.base}</span>
        <span style="font-size:var(--text-xs);color:var(--text-muted)">👔 ${team.principal}</span>
        <span style="font-size:var(--text-xs);color:var(--text-muted)">📅 Est. ${team.founded}</span>
      </div>
      
      <!-- Progress bar -->
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Championship Points</span>
          <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-secondary)">${team.points} pts</span>
        </div>
        <div style="height:4px;background:var(--bg-elevated);border-radius:9999px;overflow:hidden">
          <div style="height:100%;width:${(team.points/405*100).toFixed(1)}%;background:${team.color};border-radius:9999px;animation:progressFill 800ms var(--ease-out) ${rank * 100}ms both"></div>
        </div>
      </div>
    </div>
    
    <!-- Stats -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;min-width:180px">
      <div style="text-align:center;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:12px;padding:12px">
        <div style="font-family:var(--font-mono);font-size:var(--text-xl);font-weight:800;color:${team.color}">${team.wins}</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Total Wins</div>
      </div>
      <div style="text-align:center;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:12px;padding:12px">
        <div style="font-family:var(--font-mono);font-size:var(--text-xl);font-weight:800;color:var(--text-primary)">${team.points}</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">2025 Pts</div>
      </div>
    </div>
  `;

  return card;
}
