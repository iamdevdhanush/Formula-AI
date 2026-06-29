import { getSessions } from '../services/calendar.service.js';
import { createSkeleton, createErrorState, createEmptyState } from '../components/states.js';

export function createCalendarPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = 'background:linear-gradient(135deg,var(--bg-primary) 0%,var(--bg-elevated) 100%);border-bottom:1px solid var(--border-subtle);padding:48px 40px 32px;position:relative;overflow:hidden';
  hero.innerHTML = '<div style="position:relative;z-index:1"><div style="font-size:11px;font-weight:700;color:var(--accent-amber);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">Current Season</div><h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Race Calendar</h1><p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">All Grands Prix on the current calendar. Data sourced from OpenF1 API.</p></div>';
  page.appendChild(hero);

  const content = document.createElement('div');
  content.id = 'calendar-content';
  content.style.cssText = 'padding:40px;max-width:900px;margin:0 auto';
  content.appendChild(createSkeleton('row'));
  content.appendChild(createSkeleton('row'));
  content.appendChild(createSkeleton('row'));

  page.appendChild(content);
  loadCalendar();

  return page;
}

async function loadCalendar() {
  try {
    const sessions = await getSessions();
    const content = document.getElementById('calendar-content');
    if (!content) return;

    content.innerHTML = '';

    if (sessions.length === 0) {
      content.appendChild(createEmptyState('Calendar data is currently unavailable.'));
      return;
    }

    const raceSessions = sessions.filter(s => s.type === 'Race');
    const now = new Date();
    const live = raceSessions.filter(s => s.status === 'live');
    const upcoming = raceSessions.filter(s => s.status === 'upcoming');
    const completed = raceSessions.filter(s => s.status === 'completed');

    if (live.length > 0) {
      content.appendChild(createCalendarGroup('\u{1F534} Live Now', live, 'live'));
    }
    if (upcoming.length > 0) {
      content.appendChild(createCalendarGroup('\u{1F3C1} Upcoming Races', upcoming, 'upcoming'));
    }
    if (completed.length > 0) {
      content.appendChild(createCalendarGroup('\u2705 Completed Races', completed.reverse(), 'completed'));
    }
  } catch (e) {
    const content = document.getElementById('calendar-content');
    if (content) {
      content.innerHTML = '';
      content.appendChild(createErrorState(e.message, loadCalendar));
    }
  }
}

function createCalendarGroup(title, races, type) {
  const section = document.createElement('div');
  section.style.cssText = 'margin-bottom:40px';
  section.innerHTML = '<div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary);margin-bottom:16px;display:flex;align-items:center;gap:8px">' + title + ' <span class="badge badge-surface">' + races.length + '</span></div>';

  races.forEach((race, i) => {
    section.appendChild(createCalendarItem(race, type, i));
  });

  return section;
}

function createCalendarItem(race, type, index) {
  const d = new Date(race.date);
  const day = d.getDate();
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();

  const isLive = type === 'live';
  const isDone = type === 'completed';

  const item = document.createElement('div');
  item.style.cssText = 'display:flex;align-items:center;gap:20px;padding:18px 20px;border-radius:14px;margin-bottom:8px;cursor:pointer;transition:all 150ms var(--ease-out);animation:fadeUp 400ms var(--ease-out) ' + (index * 50) + 'ms both;background:' + (isLive ? 'var(--accent-red-soft)' : 'var(--bg-surface)') + ';border:1px solid ' + (isLive ? 'rgba(225,6,0,0.25)' : 'var(--border-subtle)') + ';opacity:' + (isDone ? '0.6' : '1');

  const displayName = race.name || 'Unknown GP';
  const circuitName = race.circuit || race.location || '';

  item.innerHTML = '<div style="width:54px;height:60px;background:' + (isLive ? 'var(--accent-red)' : isDone ? 'var(--bg-elevated)' : 'var(--bg-elevated)') + ';border:1px solid ' + (isLive ? 'transparent' : 'var(--border-subtle)') + ';border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0"><div style="font-size:9px;font-weight:700;color:' + (isLive ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)') + ';text-transform:uppercase;letter-spacing:0.06em">' + month + '</div><div style="font-family:var(--font-mono);font-size:22px;font-weight:900;color:' + (isLive ? '#fff' : 'var(--text-primary)') + ';line-height:1">' + day + '</div><div style="font-size:9px;color:' + (isLive ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)') + '">' + year + '</div></div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">' + (race.flag ? '<span style="font-size:20px">' + race.flag + '</span>' : '') + '<span style="font-size:var(--text-base);font-weight:700;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + displayName + '</span>' + (isLive ? '<span class="badge badge-live"><span class="live-dot"></span> LIVE</span>' : '') + '</div><div style="font-size:var(--text-xs);color:var(--text-muted)">' + circuitName + '</div></div>';

  item.addEventListener('mouseenter', () => { if (!isLive) { item.style.background = 'var(--bg-elevated)'; item.style.borderColor = 'var(--border-default)'; item.style.opacity = '1'; } });
  item.addEventListener('mouseleave', () => { item.style.background = isLive ? 'var(--accent-red-soft)' : 'var(--bg-surface)'; item.style.borderColor = isLive ? 'rgba(225,6,0,0.25)' : 'var(--border-subtle)'; if (isDone) item.style.opacity = '0.6'; });

  return item;
}
