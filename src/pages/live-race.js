import { getCurrentSession } from '../services/calendar.service.js';
import { getLivePositions, getRaceControl, getActiveFlags } from '../services/race.service.js';
import { getSessionWeather } from '../services/weather.service.js';
import { createTimingRow, getTrackSvg } from '../components/cards.js';
import { createSkeleton, createErrorState, createEmptyState } from '../components/states.js';

export function createLiveRacePage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const content = document.createElement('div');
  content.id = 'live-race-content';
  content.style.cssText = 'min-height:80vh';
  content.appendChild(createSkeleton('card'));
  content.appendChild(createSkeleton('row'));
  page.appendChild(content);

  loadLiveRace(page);

  return page;
}

async function loadLiveRace(page) {
  const content = document.getElementById('live-race-content');
  if (!content) return;

  try {
    const session = await getCurrentSession();

    if (!session || session.status !== 'live') {
      content.innerHTML = '';
      content.appendChild(createNotLiveMessage());
      return;
    }

    const [positions, flags, weather, raceControl] = await Promise.all([
      getLivePositions(session.session_key),
      getActiveFlags(session.session_key),
      getSessionWeather(session.session_key),
      getRaceControl(session.session_key),
    ]);

    content.innerHTML = '';
    content.appendChild(createHeroBanner(session, weather, flags, positions));
    content.appendChild(createMainContent(session, positions, weather, flags, raceControl));
  } catch (e) {
    content.innerHTML = '';
    content.appendChild(createErrorState(e.message, () => loadLiveRace(page)));
  }
}

function createNotLiveMessage() {
  const container = document.createElement('div');
  container.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;padding:40px;text-align:center';
  container.innerHTML = '<div style="font-size:64px;margin-bottom:24px;opacity:0.3">\u{1F3C1}</div><h2 style="font-size:var(--text-2xl);font-weight:800;color:var(--text-primary);margin-bottom:12px">No Live Session</h2><p style="font-size:var(--text-base);color:var(--text-muted);max-width:400px;line-height:1.6">No live session currently active. Check the calendar for upcoming race weekends.</p>';
  return container;
}

function createHeroBanner(session, weather, flags, positions) {
  const section = document.createElement('div');
  section.style.cssText = 'background:linear-gradient(135deg,var(--bg-primary) 0%,var(--bg-elevated) 100%);border-bottom:1px solid var(--border-subtle);padding:32px 40px;position:relative;overflow:hidden';
  section.innerHTML = '<div style="position:absolute;top:-80px;right:-80px;width:400px;height:400px;background:var(--accent-red);filter:blur(120px);opacity:0.08;border-radius:50%"></div><div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px"><div><div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><span class="live-dot"></span><span style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.1em">Live</span><span class="badge badge-live">' + (session.name || 'Session') + '</span>' + (session.circuit ? '<span class="badge badge-surface">' + session.circuit + '</span>' : '') + '</div><h1 style="font-size:clamp(24px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">' + (session.flag || '') + ' ' + (session.circuit || '') + '</h1><div style="display:flex;align-items:center;gap:16px;margin-top:8px;flex-wrap:wrap"><span style="font-size:var(--text-sm);color:var(--text-muted)">' + new Date(session.date).toLocaleDateString() + '</span></div></div><div style="display:flex;gap:16px;flex-wrap:wrap">' + (weather ? '<div style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:16px;padding:16px 24px;backdrop-filter:blur(10px)"><div style="display:flex;align-items:center;gap:12px"><span style="font-size:32px">' + (weather.icon || '\u2600') + '</span><div><div style="font-family:var(--font-mono);font-size:var(--text-2xl);font-weight:700;color:var(--text-primary)">' + (weather.temp ?? 'N/A') + '\u00B0C</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px">' + (weather.condition || '') + '</div></div></div></div>' : '') + '</div></div>';

  return section;
}

function createMainContent(session, positions, weather, flags, raceControl) {
  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:grid;grid-template-columns:1fr 360px;gap:0;min-height:calc(100vh - 200px)';

  const leftCol = document.createElement('div');
  leftCol.style.cssText = 'padding:28px 32px;border-right:1px solid var(--border-subtle)';

  const timingHeader = document.createElement('div');
  timingHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:16px';
  timingHeader.innerHTML = '<div style="display:flex;align-items:center;gap:8px"><span class="live-dot"></span><span style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Live Timing</span></div><div style="display:flex;gap:8px">' + flags.map(f => '<span class="badge badge-live">' + f + '</span>').join('') + '</div>';
  leftCol.appendChild(timingHeader);

  const colHeaders = document.createElement('div');
  colHeaders.style.cssText = 'display:grid;grid-template-columns:36px 36px 1fr auto auto auto;gap:8px;padding:8px 16px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:10px 10px 0 0';
  colHeaders.innerHTML = '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Pos</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Tyre</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Driver</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Gap</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Last Lap</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Pit</div>';
  leftCol.appendChild(colHeaders);

  const timingList = document.createElement('div');
  timingList.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-top:none;border-radius:0 0 10px 10px;overflow:hidden';

  if (positions.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.cssText = 'padding:40px 20px;text-align:center;color:var(--text-muted);font-size:var(--text-sm)';
    emptyMsg.textContent = 'Position data is currently unavailable for this session.';
    timingList.appendChild(emptyMsg);
  } else {
    positions.forEach(entry => { timingList.appendChild(createTimingRow(entry)); });
  }

  leftCol.appendChild(timingList);

  if (raceControl && raceControl.length > 0) {
    const rcSection = document.createElement('div');
    rcSection.style.cssText = 'margin-top:20px';
    rcSection.innerHTML = '<div style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary);margin-bottom:12px">Race Control</div><div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:12px;padding:16px;max-height:200px;overflow-y:auto">';
    raceControl.slice(-5).reverse().forEach(msg => {
      rcSection.innerHTML += '<div style="font-size:var(--text-xs);color:var(--text-secondary);padding:6px 0;border-bottom:1px solid var(--border-subtle)">' + (msg.message || '') + '</div>';
    });
    rcSection.innerHTML += '</div>';
    leftCol.appendChild(rcSection);
  }

  wrapper.appendChild(leftCol);

  const rightCol = document.createElement('div');
  rightCol.style.cssText = 'background:var(--bg-primary);padding:28px 24px';
  rightCol.innerHTML = '<div style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary);margin-bottom:16px">Session Info</div><div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:20px;margin-bottom:20px"><div style="color:var(--text-muted);display:flex;align-items:center;justify-content:center;height:120px">' + getTrackSvg('default') + '</div><div style="margin-top:12px"><div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">' + (session.circuit || 'Current Circuit') + '</div><div style="font-size:var(--text-xs);color:var(--text-muted)">' + (session.name || '') + '</div></div></div><div style="background:linear-gradient(135deg,var(--bg-elevated),var(--bg-surface));border:1px solid var(--border-subtle);border-radius:16px;padding:20px;position:relative;overflow:hidden"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.6"></div><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:12px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.08em">\u25C7 Race Engineer</span></div><p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.7">All data displayed is sourced live from OpenF1 API. Position data, weather, and race control messages update in real-time during active sessions.</p></div>';

  wrapper.appendChild(rightCol);
  return wrapper;
}
