/* ============================================
   FORMULAAI — LIVE RACE PAGE
   Full-page live race experience
   ============================================ */

import { currentRace, liveLeaderboard } from '../data/mock-data.js';
import { createTimingRow } from '../components/cards.js';
import { getTrackSvg } from '../components/cards.js';

export function createLiveRacePage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  // ── HERO BANNER ──────────────────────────────────
  const heroBanner = document.createElement('div');
  heroBanner.style.cssText = `
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-elevated) 100%);
    border-bottom: 1px solid var(--border-subtle);
    padding: 32px 40px;
    position: relative;
    overflow: hidden;
  `;
  heroBanner.innerHTML = `
    <div style="position:absolute;top:-80px;right:-80px;width:400px;height:400px;background:var(--accent-red);filter:blur(120px);opacity:0.08;border-radius:50%"></div>
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);pointer-events:none"></div>
    
    <div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px">
      <div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span class="live-dot"></span>
          <span style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.1em">Live Race</span>
          <span class="badge badge-live">British Grand Prix</span>
        </div>
        <h1 style="font-size:clamp(24px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">
          🇬🇧 Silverstone Circuit
        </h1>
        <div style="display:flex;align-items:center;gap:16px;margin-top:8px;flex-wrap:wrap">
          <span style="font-size:var(--text-sm);color:var(--text-muted)">Round 12 of 24</span>
          <span style="color:var(--border-subtle)">·</span>
          <span style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--accent-cyan)">LAP ${currentRace.lap} / ${currentRace.totalLaps}</span>
          <span style="color:var(--border-subtle)">·</span>
          <span style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--text-secondary)">⏱ ${currentRace.timeElapsed}</span>
        </div>
      </div>
      
      <div style="display:flex;gap:16px;flex-wrap:wrap">
        <!-- Race Lap Counter -->
        <div style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:16px;padding:16px 24px;text-align:center;min-width:120px;backdrop-filter:blur(10px)">
          <div style="font-family:var(--font-mono);font-size:var(--text-4xl);font-weight:900;color:var(--text-primary);line-height:1" id="lap-counter">${currentRace.lap}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:4px">of ${currentRace.totalLaps} laps</div>
        </div>
        <!-- Weather -->
        <div style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:16px;padding:16px 24px;backdrop-filter:blur(10px)">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:32px">${currentRace.weather.icon}</span>
            <div>
              <div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:700;color:var(--text-primary)">${currentRace.weather.temp}°C</div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:2px">Air · Track ${currentRace.weather.trackTemp}°C</div>
            </div>
          </div>
        </div>
        <!-- DRS Status -->
        <div style="background:${currentRace.drsEnabled ? 'var(--accent-cyan-soft)' : 'var(--bg-glass)'};border:1px solid ${currentRace.drsEnabled ? 'var(--border-cyan)' : 'var(--border-subtle)'};border-radius:16px;padding:16px 24px;text-align:center;backdrop-filter:blur(10px)">
          <div style="font-family:var(--font-mono);font-size:var(--text-xl);font-weight:900;color:${currentRace.drsEnabled ? 'var(--accent-cyan)' : 'var(--text-muted)'}">DRS</div>
          <div style="font-size:10px;color:${currentRace.drsEnabled ? 'var(--accent-cyan)' : 'var(--text-muted)'};text-transform:uppercase;letter-spacing:0.1em;margin-top:4px">${currentRace.drsEnabled ? 'ENABLED' : 'DISABLED'}</div>
        </div>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div style="margin-top:24px;position:relative;z-index:1">
      <div style="height:3px;background:var(--bg-elevated);border-radius:9999px;overflow:hidden">
        <div style="height:100%;width:${(currentRace.lap/currentRace.totalLaps*100).toFixed(1)}%;background:linear-gradient(90deg,var(--accent-red),var(--accent-cyan));border-radius:9999px;animation:progressFill 1s var(--ease-out) both"></div>
      </div>
    </div>
  `;
  page.appendChild(heroBanner);

  // ── MAIN CONTENT ─────────────────────────────────
  const content = document.createElement('div');
  content.style.cssText = 'display:grid;grid-template-columns:1fr 360px;gap:0;min-height:calc(100vh - 200px)';

  // Left: Timing sheet + AI panel
  const leftCol = document.createElement('div');
  leftCol.style.cssText = 'padding:28px 32px;border-right:1px solid var(--border-subtle)';

  // Section header
  const timingHeader = document.createElement('div');
  timingHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px';
  timingHeader.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px">
      <span class="live-dot"></span>
      <span style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Live Timing</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <span class="badge badge-cyan">Gap Update: 2s</span>
      <button class="btn btn-ghost btn-sm">⚙ Settings</button>
    </div>
  `;
  leftCol.appendChild(timingHeader);

  // Column headers
  const colHeaders = document.createElement('div');
  colHeaders.style.cssText = `
    display: grid;
    grid-template-columns: 36px 36px 1fr auto auto auto;
    gap: 8px;
    padding: 8px 16px;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 10px 10px 0 0;
  `;
  colHeaders.innerHTML = `
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Pos</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Tyre</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Driver</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Gap</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Last Lap</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Pit</div>
  `;
  leftCol.appendChild(colHeaders);

  const timingList = document.createElement('div');
  timingList.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-top:none;border-radius:0 0 10px 10px;overflow:hidden';
  liveLeaderboard.forEach(entry => {
    timingList.appendChild(createTimingRow(entry));
  });
  leftCol.appendChild(timingList);

  // Strategy overview
  const strategySection = document.createElement('div');
  strategySection.style.cssText = 'margin-top:28px';
  strategySection.innerHTML = `
    <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary);margin-bottom:16px">Strategy Overview</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      ${[
        { label: 'Fastest Lap', value: 'RUS 1:28.891', color: 'var(--accent-cyan)', sub: 'George Russell' },
        { label: 'Pit Stops', value: '14', color: 'var(--accent-amber)', sub: 'Total this race' },
        { label: 'Safety Cars', value: '0', color: 'var(--text-muted)', sub: 'No incidents' },
      ].map(s => `
        <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:16px;text-align:center">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px">${s.label}</div>
          <div style="font-family:var(--font-mono);font-size:var(--text-lg);font-weight:700;color:${s.color}">${s.value}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px">${s.sub}</div>
        </div>
      `).join('')}
    </div>
  `;
  leftCol.appendChild(strategySection);

  content.appendChild(leftCol);

  // Right: Track map + Race info
  const rightCol = document.createElement('div');
  rightCol.style.cssText = 'background:var(--bg-primary);padding:28px 24px;';

  rightCol.innerHTML = `
    <div style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary);margin-bottom:16px">Track Map</div>
    <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:20px;margin-bottom:20px">
      <div style="color:var(--text-muted);display:flex;align-items:center;justify-content:center;height:180px">
        ${getTrackSvg('silverstone')}
      </div>
      <div style="margin-top:12px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">Silverstone Circuit</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">5.891 km · 18 turns</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--accent-cyan)">2 DRS Zones</div>
          <div style="font-size:10px;color:var(--text-muted)">Wellington + Hangar</div>
        </div>
      </div>
    </div>
    
    <!-- Tire Usage -->
    <div style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary);margin-bottom:12px">Tyre Usage</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px">
      ${[
        { compound: 'Soft', letter: 'S', count: 3, color: '#e10600', bg: 'rgba(225,6,0,0.12)' },
        { compound: 'Medium', letter: 'M', count: 4, color: '#ffd13b', bg: 'rgba(255,209,59,0.12)' },
        { compound: 'Hard', letter: 'H', count: 3, color: '#d0d0d0', bg: 'rgba(255,255,255,0.06)' },
      ].map(t => `
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:22px;height:22px;border-radius:50%;background:${t.color};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${t.letter==='M'?'#000':'#fff'};flex-shrink:0">${t.letter}</div>
          <div style="font-size:var(--text-xs);color:var(--text-secondary);flex:1">${t.compound}</div>
          <div style="flex:2;height:6px;background:var(--bg-elevated);border-radius:9999px;overflow:hidden">
            <div style="height:100%;width:${(t.count/10*100).toFixed(0)}%;background:${t.color};border-radius:9999px;animation:progressFill 1s var(--ease-out) both"></div>
          </div>
          <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-secondary);min-width:20px;text-align:right">${t.count}</div>
        </div>
      `).join('')}
    </div>

    <!-- AI Insight -->
    <div style="background:linear-gradient(135deg,var(--bg-elevated),var(--bg-surface));border:1px solid var(--border-subtle);border-radius:16px;padding:20px;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.6"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:12px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.08em">◈ Race Engineer</span>
      </div>
      <p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.7">
        <strong style="color:var(--text-primary)">Critical window approaching:</strong> Verstappen's mediums are entering the peak degradation phase. Red Bull must decide within 5 laps whether to extend or pit for hard tyres.
      </p>
      <button class="btn btn-ghost btn-sm" style="margin-top:12px;font-size:var(--text-xs)">Ask Race Engineer →</button>
    </div>
  `;

  content.appendChild(rightCol);
  page.appendChild(content);

  // Responsive
  function onResize() {
    if (window.innerWidth < 900) {
      content.style.gridTemplateColumns = '1fr';
      leftCol.style.padding = '20px 16px';
    } else {
      content.style.gridTemplateColumns = '1fr 360px';
      leftCol.style.padding = '28px 32px';
    }
  }
  onResize();
  window.addEventListener('resize', onResize, { signal });

  return page;
}
