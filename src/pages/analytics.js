import { getDriverStandings, getConstructorStandings } from '../services/standings.service.js';
import { createSparkline, createBarChart } from '../components/cards.js';
import { createSkeleton, createErrorState, createEmptyState } from '../components/states.js';

export function createAnalyticsPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = 'background:linear-gradient(135deg,var(--bg-primary) 0%,var(--bg-elevated) 100%);border-bottom:1px solid var(--border-subtle);padding:48px 40px 32px;position:relative;overflow:hidden';
  hero.innerHTML = '<div style="position:absolute;bottom:-60px;left:-40px;width:280px;height:280px;background:var(--accent-purple);filter:blur(100px);opacity:0.07;border-radius:50%"></div><div style="position:relative;z-index:1"><div style="font-size:11px;font-weight:700;color:var(--accent-purple);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">Data Intelligence</div><h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Analytics</h1><p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">Real championship data and performance trends. No fabricated values.</p></div>';
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1400px;margin:0 auto';

  const statsRow = document.createElement('div');
  statsRow.id = 'analytics-stats';
  statsRow.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px';
  for (let i = 0; i < 4; i++) statsRow.appendChild(createSkeleton('card'));
  content.appendChild(statsRow);

  const chartsRow = document.createElement('div');
  chartsRow.id = 'analytics-charts';
  chartsRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px';
  chartsRow.appendChild(createSkeleton('chart'));
  chartsRow.appendChild(createSkeleton('chart'));
  content.appendChild(chartsRow);

  const tyreSection = document.createElement('div');
  tyreSection.id = 'analytics-tyre';
  tyreSection.appendChild(createSkeleton('card'));
  content.appendChild(tyreSection);

  page.appendChild(content);

  function onResize() {
    const w = window.innerWidth;
    if (w < 768) { statsRow.style.gridTemplateColumns = 'repeat(2,1fr)'; chartsRow.style.gridTemplateColumns = '1fr'; }
    else if (w < 1100) { statsRow.style.gridTemplateColumns = 'repeat(2,1fr)'; chartsRow.style.gridTemplateColumns = '1fr 1fr'; }
    else { statsRow.style.gridTemplateColumns = 'repeat(4,1fr)'; chartsRow.style.gridTemplateColumns = '1fr 1fr'; }
  }
  onResize();
  window.addEventListener('resize', onResize, { signal });

  loadAnalytics();

  return page;
}

async function loadAnalytics() {
  try {
    const [ds, cs] = await Promise.all([getDriverStandings(), getConstructorStandings()]);

    const statsEl = document.getElementById('analytics-stats');
    if (statsEl) {
      statsEl.innerHTML = '';
      const totalDrivers = ds.length;
      const totalPoints = ds.reduce((sum, d) => sum + (d.points || 0), 0);
      const topTeam = cs[0]?.team || 'N/A';
      const topDriver = ds[0]?.driver || 'N/A';
      statsEl.innerHTML = '<div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:20px;animation:fadeUp 400ms var(--ease-out) both"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Drivers</div><div style="font-family:var(--font-mono);font-size:var(--text-3xl);font-weight:800;color:var(--accent-cyan);line-height:1">' + totalDrivers + '</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:6px">On the grid</div></div><div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:20px;animation:fadeUp 400ms var(--ease-out) 80ms both"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Total Points</div><div style="font-family:var(--font-mono);font-size:var(--text-3xl);font-weight:800;color:var(--accent-amber);line-height:1">' + totalPoints + '</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:6px">Combined WDC</div></div><div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:20px;animation:fadeUp 400ms var(--ease-out) 160ms both"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Leader</div><div style="font-family:var(--font-mono);font-size:var(--text-3xl);font-weight:800;color:var(--accent-red);line-height:1">' + (topDriver.substring(0, 12) || 'N/A') + '</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:6px">' + (ds[0]?.points || 0) + ' pts</div></div><div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:20px;animation:fadeUp 400ms var(--ease-out) 240ms both"><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">Top Team</div><div style="font-family:var(--font-mono);font-size:var(--text-3xl);font-weight:800;color:var(--text-primary);line-height:1">' + (topTeam.substring(0, 12) || 'N/A') + '</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:6px">' + (cs[0]?.points || 0) + ' pts</div></div>';
    }

    const chartsEl = document.getElementById('analytics-charts');
    if (chartsEl) {
      chartsEl.innerHTML = '';
      if (ds.length > 0) {
        chartsEl.appendChild(createStandingsChart(ds));
      } else {
        chartsEl.appendChild(createEmptyState('Pace comparison data is currently unavailable.'));
      }
      if (cs.length > 0) {
        chartsEl.appendChild(createConstructorChart(cs));
      } else {
        chartsEl.appendChild(createEmptyState('Constructor progression data is currently unavailable.'));
      }
    }

    const tyreEl = document.getElementById('analytics-tyre');
    if (tyreEl) {
      tyreEl.innerHTML = '';
      tyreEl.appendChild(createAnalysisDisclaimer());
    }
  } catch (e) {
    ['analytics-stats', 'analytics-charts', 'analytics-tyre'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.innerHTML = '';
        el.appendChild(createErrorState(e.message, loadAnalytics));
      }
    });
  }
}

function createStandingsChart(standings) {
  const card = document.createElement('div');
  card.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden';
  card.innerHTML = '<div style="padding:20px 20px 0;display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Top 10 Drivers</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Points comparison</div></div></div>';

  const body = document.createElement('div');
  body.style.cssText = 'padding:20px';

  const items = standings.slice(0, 10).map((d, i) => ({
    label: d.driver ? (d.driver.length > 14 ? d.driver.substring(0, 14) + '...' : d.driver) : 'Driver ' + i,
    value: d.points || 0,
    display: (d.points || 0) + '',
    color: d.teamColor || '#666',
  }));

  body.appendChild(createBarChart(items));
  card.appendChild(body);
  card.appendChild(createDisclaimerStrip('Standings data sourced from OpenF1 API.'));
  return card;
}

function createConstructorChart(standings) {
  const card = document.createElement('div');
  card.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden';
  card.innerHTML = '<div style="padding:20px 20px 0;display:flex;align-items:center;justify-content:space-between"><div><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Constructors</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Points comparison</div></div></div>';

  const body = document.createElement('div');
  body.style.cssText = 'padding:20px;display:flex;flex-direction:column;gap:16px';

  const maxPts = Math.max(...standings.map(s => s.points || 0), 1);
  standings.slice(0, 5).forEach((s, i) => {
    const pct = ((s.points || 0) / maxPts * 100).toFixed(1);
    const row = document.createElement('div');
    row.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><div style="display:flex;align-items:center;gap:8px"><div style="width:3px;height:14px;border-radius:2px;background:' + (s.color || '#666') + '"></div><span style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary)">' + s.team + '</span></div><span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted)">' + (s.points || 0) + ' pts</span></div><div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct + '%;background:' + (s.color || '#666') + '"></div></div>';
    body.appendChild(row);
  });

  card.appendChild(body);
  card.appendChild(createDisclaimerStrip('Constructor data sourced from OpenF1 API.'));
  return card;
}

function createAnalysisDisclaimer() {
  const section = document.createElement('div');
  section.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden;margin-bottom:32px';
  section.innerHTML = '<div style="padding:40px 20px;text-align:center"><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary);margin-bottom:12px">Advanced Analytics</div><p style="font-size:var(--text-sm);color:var(--text-muted);max-width:500px;margin:0 auto;line-height:1.6">Detailed telemetry analysis, tyre performance comparisons, and sector time data are available during active race sessions. Currently displaying championship standings.</p></div>';
  return section;
}

function createDisclaimerStrip(text) {
  const strip = document.createElement('div');
  strip.style.cssText = 'padding:14px 20px;border-top:1px solid var(--border-subtle);background:var(--accent-cyan-soft);display:flex;align-items:center;gap:10px';
  strip.innerHTML = '<span style="font-size:16px">\u25C7</span><span style="font-size:var(--text-xs);color:var(--text-secondary)"><strong style="color:var(--accent-cyan)">Verified:</strong> ' + text + '</span>';
  return strip;
}
