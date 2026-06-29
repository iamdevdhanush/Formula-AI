import { getConstructors } from '../services/constructors.service.js';
import { createSkeleton, createErrorState, createEmptyState } from '../components/states.js';

export function createTeamsPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = 'background:linear-gradient(135deg,var(--bg-primary) 0%,var(--bg-elevated) 100%);border-bottom:1px solid var(--border-subtle);padding:48px 40px 32px;position:relative;overflow:hidden';
  hero.innerHTML = '<div style="position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:var(--accent-red);filter:blur(100px);opacity:0.06;border-radius:50%"></div><div style="position:relative;z-index:1"><div style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">Current Season</div><h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Constructors</h1><p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">The teams competing in the current Formula 1 World Championship. Data sourced from OpenF1 API.</p></div>';
  page.appendChild(hero);

  const content = document.createElement('div');
  content.id = 'teams-content';
  content.style.cssText = 'padding:40px;max-width:1400px;margin:0 auto;display:flex;flex-direction:column;gap:20px';

  for (let i = 0; i < 5; i++) {
    const skeleton = createSkeleton('card');
    skeleton.style.animationDelay = i * 80 + 'ms';
    content.appendChild(skeleton);
  }

  page.appendChild(content);
  loadTeams();

  return page;
}

async function loadTeams() {
  try {
    const constructors = await getConstructors();
    const content = document.getElementById('teams-content');
    if (!content) return;

    content.innerHTML = '';

    if (constructors.length === 0) {
      content.appendChild(createEmptyState('Constructor data is currently unavailable.'));
      return;
    }

    const maxPts = Math.max(...constructors.map(t => t.points || 0), 1);

    constructors.forEach((team, i) => {
      content.appendChild(createTeamCard(team, i, maxPts));
    });
  } catch (e) {
    const content = document.getElementById('teams-content');
    if (content) {
      content.innerHTML = '';
      content.appendChild(createErrorState(e.message, loadTeams));
    }
  }
}

function createTeamCard(team, rank, maxPts) {
  const card = document.createElement('div');
  card.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-left:4px solid ' + (team.color || '#666') + ';border-radius:16px;padding:28px 32px;display:grid;grid-template-columns:60px 1fr auto;gap:24px;align-items:center;cursor:pointer;transition:all 200ms var(--ease-out);animation:fadeUp 400ms var(--ease-out) ' + (rank * 80) + 'ms both;position:relative;overflow:hidden';

  card.addEventListener('mouseenter', () => { card.style.borderColor = 'var(--border-default)'; card.style.borderLeftColor = team.color || '#666'; card.style.transform = 'translateX(4px)'; card.style.background = 'linear-gradient(135deg, ' + (team.color || '#666') + '08 0%, var(--bg-surface) 60%)'; });
  card.addEventListener('mouseleave', () => { card.style.borderColor = 'var(--border-subtle)'; card.style.borderLeftColor = team.color || '#666'; card.style.transform = 'translateX(0)'; card.style.background = 'var(--bg-surface)'; });

  const pct = ((team.points || 0) / maxPts * 100).toFixed(1);
  const championships = team.championships || 0;
  const wins = team.wins || 0;
  const pts = team.points || 0;

  card.innerHTML = '<div style="text-align:center"><div style="font-family:var(--font-mono);font-size:40px;font-weight:900;color:' + (team.color || '#666') + ';opacity:0.5;line-height:1">' + (team.position || rank + 1) + '</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Rank</div></div><div><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-wrap:wrap"><h2 style="font-size:var(--text-xl);font-weight:900;letter-spacing:-0.03em;color:var(--text-primary)">' + team.name + '</h2>' + (championships > 0 ? '<span class="badge badge-amber">\u{1F3C6} ' + championships + 'x Champion</span>' : '<span class="badge badge-surface">Contender</span>') + '</div><div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:16px"><span style="font-size:var(--text-xs);color:var(--text-muted)">\u2699\uFE0F ' + team.engine + '</span><span style="font-size:var(--text-xs);color:var(--text-muted)">\u{1F4CD} ' + team.base + '</span></div><div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Championship Points</span><span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-secondary)">' + pts + ' pts</span></div><div style="height:4px;background:var(--bg-elevated);border-radius:9999px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + (team.color || '#666') + ';border-radius:9999px;animation:progressFill 800ms var(--ease-out) ' + (rank * 100) + 'ms both"></div></div></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;min-width:180px"><div style="text-align:center;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:12px;padding:12px"><div style="font-family:var(--font-mono);font-size:var(--text-xl);font-weight:800;color:' + (team.color || '#666') + '">' + wins + '</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Total Wins</div></div><div style="text-align:center;background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:12px;padding:12px"><div style="font-family:var(--font-mono);font-size:var(--text-xl);font-weight:800;color:var(--text-primary)">' + pts + '</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Current Pts</div></div></div>';

  return card;
}
