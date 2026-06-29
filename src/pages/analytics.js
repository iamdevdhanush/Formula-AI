/* ============================================
   FORMULAAI — ANALYTICS PAGE
   ============================================ */
import { standings, constructorStandings, liveLeaderboard } from '../data/mock-data.js';
import { createSparkline, createBarChart } from '../components/cards.js';

export function createAnalyticsPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = `
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-elevated) 100%);
    border-bottom: 1px solid var(--border-subtle);
    padding: 48px 40px 32px; position: relative; overflow: hidden;
  `;
  hero.innerHTML = `
    <div style="position:absolute;bottom:-60px;left:-40px;width:280px;height:280px;background:var(--accent-purple);filter:blur(100px);opacity:0.07;border-radius:50%"></div>
    <div style="position:relative;z-index:1">
      <div style="font-size:11px;font-weight:700;color:var(--accent-purple);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">Data Intelligence</div>
      <h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Analytics</h1>
      <p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">Deep race data, performance trends, and AI-powered insights.</p>
    </div>
  `;
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1400px;margin:0 auto';

  // Stats row
  const statsRow = document.createElement('div');
  statsRow.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px';
  statsRow.innerHTML = `
    ${[
      { label: 'Laps Completed', value: '374', sub: 'Race total', color: 'var(--accent-cyan)' },
      { label: 'Total Pit Stops', value: '14', sub: 'This race', color: 'var(--accent-amber)' },
      { label: 'Safety Cars', value: '0', sub: 'Clean race', color: 'var(--text-muted)' },
      { label: 'Fastest Lap', value: '1:28.8', sub: 'Russell · Lap 29', color: 'var(--accent-red)' },
    ].map(s => `
      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:20px;animation:fadeUp 400ms var(--ease-out) both">
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px">${s.label}</div>
        <div style="font-family:var(--font-mono);font-size:var(--text-3xl);font-weight:800;color:${s.color};line-height:1">${s.value}</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:6px">${s.sub}</div>
      </div>
    `).join('')}
  `;
  content.appendChild(statsRow);

  // Charts row
  const chartsRow = document.createElement('div');
  chartsRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px';

  // Race pace chart
  const paceCard = document.createElement('div');
  paceCard.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden';
  paceCard.innerHTML = `
    <div style="padding:20px 20px 0;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Race Pace Comparison</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Average lap time by stint — Top 6 drivers</div>
      </div>
    </div>
  `;

  const paceBody = document.createElement('div');
  paceBody.style.cssText = 'padding:20px';

  const paceItems = [
    { label: 'Russell (RUS)', value: 89.0, display: '1:29.0', color: '#27F4D2' },
    { label: 'Norris (NOR)', value: 89.2, display: '1:29.2', color: '#FF8000' },
    { label: 'Verstappen (VER)', value: 89.8, display: '1:29.8', color: '#3671C6' },
    { label: 'Hamilton (HAM)', value: 90.3, display: '1:30.3', color: '#E8002D' },
    { label: 'Leclerc (LEC)', value: 90.5, display: '1:30.5', color: '#E8002D' },
    { label: 'Piastri (PIA)', value: 89.5, display: '1:29.5', color: '#FF8000' },
  ];

  // Normalize: lower is better (faster)
  const maxVal = Math.max(...paceItems.map(i => i.value));
  const minVal = Math.min(...paceItems.map(i => i.value));
  const normalizedItems = paceItems.map(item => ({
    ...item,
    value: 100 - ((item.value - minVal) / (maxVal - minVal) * 80),
  }));

  const barChart = createBarChart(normalizedItems.map((item, i) => ({
    ...item,
    value: normalizedItems[i].value,
    display: paceItems[i].display,
  })));
  paceBody.appendChild(barChart);
  paceCard.appendChild(paceBody);
  chartsRow.appendChild(paceCard);

  // Points progression card
  const pointsCard = document.createElement('div');
  pointsCard.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden';
  pointsCard.innerHTML = `
    <div style="padding:20px 20px 0;display:flex;align-items:center;justify-content:space-between">
      <div>
        <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Championship Progression</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Cumulative points — Top 4 drivers</div>
      </div>
    </div>
    <div style="padding:20px;display:flex;flex-direction:column;gap:16px">
      ${[
        { driver: 'Verstappen', data: [25,50,68,93,118,143,168,183,207,227,237], color: '#3671C6' },
        { driver: 'Hamilton', data: [10,28,53,72,97,116,136,152,172,186,198], color: '#E8002D' },
        { driver: 'Norris', data: [12,24,44,62,87,106,121,137,152,162,172], color: '#FF8000' },
        { driver: 'Leclerc', data: [18,36,54,70,92,110,125,140,155,172,185], color: '#E8002D' },
      ].map(d => `
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:3px;height:14px;border-radius:2px;background:${d.color}"></div>
              <span style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary)">${d.driver}</span>
            </div>
            <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted)">${d.data[d.data.length-1]} pts</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Add sparklines dynamically
  const sparkContainer = pointsCard.querySelector('div[style*="flex-direction:column"]');
  const rows = sparkContainer.querySelectorAll('div > div');
  const driverData = [
    { data: [25,50,68,93,118,143,168,183,207,227,237], color: '#3671C6' },
    { data: [10,28,53,72,97,116,136,152,172,186,198], color: '#E8002D' },
    { data: [12,24,44,62,87,106,121,137,152,162,172], color: '#FF8000' },
    { data: [18,36,54,70,92,110,125,140,155,172,185], color: '#E8002D' },
  ];

  driverData.forEach((d, i) => {
    const sparkline = createSparkline(d.data, d.color, 36);
    sparkline.style.width = '100%';
    // Insert after each row's existing content
    const rowEl = sparkContainer.children[i];
    if (rowEl) rowEl.appendChild(sparkline);
  });

  chartsRow.appendChild(pointsCard);
  content.appendChild(chartsRow);

  // Tyre performance table
  const tyreSection = document.createElement('div');
  tyreSection.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden;margin-bottom:32px';
  tyreSection.innerHTML = `
    <div style="padding:20px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Tyre Performance Analysis</div>
      <span class="badge badge-cyan">AI Generated</span>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid var(--border-subtle)">
            ${['Compound','Avg Stint Length','Deg Rate','Peak Window','Current Leaders'].map(h => `
              <th style="padding:12px 20px;text-align:left;font-size:10px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">${h}</th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${[
            { compound: 'Soft', letter: 'S', color: '#e10600', stintLen: '18-22 laps', deg: 'High', peak: 'Laps 1-15', leaders: 'Russell, Piastri' },
            { compound: 'Medium', letter: 'M', color: '#ffd13b', textColor: '#000', stintLen: '26-32 laps', deg: 'Medium', peak: 'Laps 8-24', leaders: 'Verstappen, Norris' },
            { compound: 'Hard', letter: 'H', color: '#e0e0e0', textColor: '#000', stintLen: '35-45 laps', deg: 'Low', peak: 'Laps 15-35', leaders: 'Hamilton, Leclerc' },
          ].map(t => `
            <tr style="border-bottom:1px solid var(--border-subtle);transition:background 120ms;" onmouseenter="this.style.background='var(--bg-glass)'" onmouseleave="this.style.background='transparent'">
              <td style="padding:14px 20px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:22px;height:22px;border-radius:50%;background:${t.color};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${t.textColor||'#fff'}">${t.letter}</div>
                  <span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${t.compound}</span>
                </div>
              </td>
              <td style="padding:14px 20px;font-family:var(--font-mono);font-size:var(--text-sm);color:var(--text-secondary)">${t.stintLen}</td>
              <td style="padding:14px 20px">
                <span class="badge ${t.deg === 'High' ? 'badge-live' : t.deg === 'Medium' ? 'badge-amber' : 'badge-green'}">${t.deg}</span>
              </td>
              <td style="padding:14px 20px;font-size:var(--text-xs);color:var(--text-muted)">${t.peak}</td>
              <td style="padding:14px 20px;font-size:var(--text-sm);color:var(--text-secondary)">${t.leaders}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  content.appendChild(tyreSection);

  // Responsive
  function onResize() {
    const w = window.innerWidth;
    if (w < 768) {
      statsRow.style.gridTemplateColumns = 'repeat(2,1fr)';
      chartsRow.style.gridTemplateColumns = '1fr';
    } else if (w < 1100) {
      statsRow.style.gridTemplateColumns = 'repeat(2,1fr)';
      chartsRow.style.gridTemplateColumns = '1fr 1fr';
    } else {
      statsRow.style.gridTemplateColumns = 'repeat(4,1fr)';
      chartsRow.style.gridTemplateColumns = '1fr 1fr';
    }
  }
  onResize();
  window.addEventListener('resize', onResize, { signal });

  page.appendChild(content);
  return page;
}
