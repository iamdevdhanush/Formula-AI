import { getDriverStandings, getConstructorStandings } from '../services/standings.service.js';
import { getNews } from '../services/news.service.js';
import { getCurrentSession, getNextRace } from '../services/calendar.service.js';
import { getLivePositions } from '../services/race.service.js';
import { getSessionWeather } from '../services/weather.service.js';
import { getDrivers } from '../services/drivers.service.js';
import { createTimingRow, createNewsCard, createSparkline } from '../components/cards.js';
import { createSkeleton, createErrorState, createEmptyState } from '../components/states.js';

export function createHomePage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const ticker = createTickerBanner();
  page.appendChild(ticker);
  const hero = createHeroSection(router);
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding: 48px 40px; max-width: 1400px; margin: 0 auto;';
  content.className = 'anim-stagger';

  const row1 = document.createElement('div');
  row1.style.cssText = 'display:grid;grid-template-columns:1fr 380px;gap:24px;margin-bottom:40px;';
  const liveRaceWrap = document.createElement('div');
  liveRaceWrap.id = 'home-live-race';
  liveRaceWrap.appendChild(createSkeleton('card'));
  const newsWrap = document.createElement('div');
  newsWrap.id = 'home-news';
  newsWrap.appendChild(createSkeleton('card'));
  row1.appendChild(liveRaceWrap);
  row1.appendChild(newsWrap);
  content.appendChild(row1);

  const row2 = document.createElement('div');
  row2.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 320px;gap:24px;margin-bottom:40px;';
  const dsWrap = document.createElement('div');
  dsWrap.id = 'home-standings';
  dsWrap.appendChild(createSkeleton('card'));
  const csWrap = document.createElement('div');
  csWrap.id = 'home-constructor-standings';
  csWrap.appendChild(createSkeleton('card'));
  const upWrap = document.createElement('div');
  upWrap.id = 'home-upcoming';
  upWrap.appendChild(createSkeleton('card'));
  row2.appendChild(dsWrap);
  row2.appendChild(csWrap);
  row2.appendChild(upWrap);
  content.appendChild(row2);

  const row3 = document.createElement('div');
  row3.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:40px;';
  row3.appendChild(createInsightSection());
  const apWrap = document.createElement('div');
  apWrap.id = 'home-analytics';
  apWrap.appendChild(createSkeleton('card'));
  row3.appendChild(apWrap);
  content.appendChild(row3);

  page.appendChild(content);

  handleHomeResponsive(row1, row2, row3);
  window.addEventListener('resize', () => handleHomeResponsive(row1, row2, row3), { signal });

  loadHomeData();

  return page;
}

async function loadHomeData() {
  try {
    const [standings, constructorStandings, session, nextRace, news, drivers] = await Promise.all([
      getDriverStandings(),
      getConstructorStandings(),
      getCurrentSession(),
      getNextRace(),
      getNews(),
      getDrivers(),
    ]);

    let livePositions = [];
    let weather = null;
    if (session) {
      [livePositions, weather] = await Promise.all([
        getLivePositions(session.session_key).catch(() => []),
        getSessionWeather(session.session_key).catch(() => null),
      ]);
    }

    const liveRaceEl = document.getElementById('home-live-race');
    if (liveRaceEl) {
      liveRaceEl.innerHTML = '';
      liveRaceEl.appendChild(createLiveRaceSection(session, livePositions, weather));
    }

    const newsEl = document.getElementById('home-news');
    if (newsEl) {
      newsEl.innerHTML = '';
      newsEl.appendChild(createNewsSection(news));
    }

    const dsEl = document.getElementById('home-standings');
    if (dsEl && standings.length > 0) {
      dsEl.innerHTML = '';
      dsEl.appendChild(createStandingsSection(standings));
    } else if (dsEl) {
      dsEl.innerHTML = '';
      dsEl.appendChild(createEmptyState('Driver standings are currently unavailable.'));
    }

    const csEl = document.getElementById('home-constructor-standings');
    if (csEl && constructorStandings.length > 0) {
      csEl.innerHTML = '';
      csEl.appendChild(createConstructorStandingsSection(constructorStandings));
    } else if (csEl) {
      csEl.innerHTML = '';
      csEl.appendChild(createEmptyState('Constructor standings are currently unavailable.'));
    }

    const upEl = document.getElementById('home-upcoming');
    if (upEl && nextRace) {
      upEl.innerHTML = '';
      upEl.appendChild(createUpcomingSection([nextRace]));
    } else if (upEl) {
      upEl.innerHTML = '';
      const sessions = await getNextRace().catch(() => null);
      if (sessions) {
        upEl.innerHTML = '';
        upEl.appendChild(createUpcomingSection([sessions]));
      }
    }

    const apEl = document.getElementById('home-analytics');
    if (apEl && standings.length >= 3) {
      apEl.innerHTML = '';
      apEl.appendChild(createAnalyticsPreview(standings.slice(0, 3)));
    } else if (apEl) {
      apEl.innerHTML = '';
      apEl.appendChild(createEmptyState('Race pace analysis is currently unavailable.'));
    }
  } catch (e) {
    showErrorStates(e.message);
  }
}

function showErrorStates(msg) {
  ['home-live-race', 'home-news', 'home-standings', 'home-constructor-standings', 'home-upcoming', 'home-analytics'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = '';
      el.appendChild(createErrorState(msg, loadHomeData));
    }
  });
}

function handleHomeResponsive(row1, row2, row3) {
  const w = window.innerWidth;
  if (w < 768) {
    row1.style.gridTemplateColumns = '1fr';
    row2.style.gridTemplateColumns = '1fr';
    row3.style.gridTemplateColumns = '1fr';
  } else if (w < 1100) {
    row1.style.gridTemplateColumns = '1fr';
    row2.style.gridTemplateColumns = '1fr 1fr';
    row3.style.gridTemplateColumns = '1fr';
  } else {
    row1.style.gridTemplateColumns = '1fr 380px';
    row2.style.gridTemplateColumns = '1fr 1fr 320px';
    row3.style.gridTemplateColumns = '1fr 1fr';
  }
}

function createTickerBanner() {
  const banner = document.createElement('div');
  banner.className = 'ticker-banner';
  const label = document.createElement('div');
  label.className = 'ticker-label';
  label.innerHTML = '<span class="live-dot"></span><span style="font-size:10px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.08em">Live</span>';
  banner.appendChild(label);
  const track = document.createElement('div');
  track.className = 'ticker-track';
  const items = [
    { label: 'Data Source', value: 'OpenF1 API', color: 'var(--accent-cyan)' },
    { label: 'Status', value: 'Real Data', color: 'var(--accent-green)' },
  ];
  [...items, ...items].forEach(item => {
    const el = document.createElement('div');
    el.className = 'ticker-item';
    el.innerHTML = '<span style="color:' + (item.color || 'var(--text-muted)') + '; font-weight:600">' + item.label + '</span><span style="color:' + (item.color ? item.color : 'var(--text-secondary)') + '">' + item.value + '</span><span class="ticker-separator">\u00B7</span>';
    track.appendChild(el);
  });
  banner.appendChild(track);
  return banner;
}

function createHeroSection(router) {
  const hero = document.createElement('section');
  hero.style.cssText = 'position:relative;padding:80px 40px 64px;overflow:hidden;min-height:480px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center';
  hero.innerHTML = '<div class="glow-red" style="width:600px;height:400px;top:-100px;left:-100px;opacity:0.10"></div><div class="glow-cyan" style="width:400px;height:300px;bottom:-50px;right:-50px;opacity:0.08"></div><div style="position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(225,6,0,0.04) 0%, transparent 70%);pointer-events:none"></div>';
  const inner = document.createElement('div');
  inner.style.cssText = 'position:relative;z-index:1;max-width:780px;width:100%';

  const greetingText = getGreeting();
  inner.innerHTML = '<div style="position:relative;z-index:1;max-width:780px;width:100%"><div style="margin-bottom:12px"><div style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:12px;letter-spacing:0.04em">' + greetingText + ', Race Fan</div><h1 style="font-size:clamp(28px,5vw,52px);font-weight:900;line-height:1.05;letter-spacing:-0.04em;color:var(--text-primary);margin-bottom:8px">Your AI Race Engineer<br><span style="background:linear-gradient(135deg,#ff3d36 0%,var(--accent-red) 60%,#c00000 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">powered by real data.</span></h1><p style="font-size:var(--text-md);color:var(--text-muted);font-weight:400;max-width:520px;margin:0 auto;line-height:1.6">Every number, every chart, every answer comes from verified live sources.</p></div></div>';

  const searchWrapper = document.createElement('div');
  searchWrapper.style.cssText = 'position:relative;margin-top:36px;margin-bottom:24px';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'search-input';
  searchInput.placeholder = 'Ask your Race Engineer anything...';
  searchInput.style.cssText = 'width:100%;padding:22px 80px 22px 24px;font-size:var(--text-md);font-family:var(--font-primary);font-weight:400;color:var(--text-primary);background:var(--bg-surface);border:1px solid var(--border-default);border-radius:20px;transition:all 200ms var(--ease-out);caret-color:var(--accent-red)';
  searchInput.addEventListener('focus', () => { searchInput.style.borderColor = 'var(--border-default)'; searchInput.style.boxShadow = '0 0 0 1px var(--border-subtle), 0 20px 60px rgba(0,0,0,0.5)'; searchInput.style.background = 'var(--bg-elevated)'; });
  searchInput.addEventListener('blur', () => { searchInput.style.boxShadow = 'none'; searchInput.style.background = 'var(--bg-surface)'; });

  const searchBtn = document.createElement('button');
  searchBtn.innerHTML = '\u2191';
  searchBtn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:12px;background:var(--accent-red);color:#fff;font-size:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 150ms var(--ease-spring);border:none;box-shadow:var(--shadow-red)';
  searchBtn.addEventListener('click', () => { if (searchInput.value.trim()) router.navigate('race-engineer'); });
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && searchInput.value.trim()) router.navigate('race-engineer'); });

  searchWrapper.appendChild(searchInput);
  searchWrapper.appendChild(searchBtn);
  inner.appendChild(searchWrapper);
  hero.appendChild(inner);
  return hero;
}

function createLiveRaceSection(session, positions, weather) {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.style.cssText = 'overflow:visible';

  const isLive = session && new Date() >= new Date(session.date) && new Date() <= new Date(session.endDate || session.date);
  const lapStr = session ? new Date(session.date).toLocaleDateString() : 'No active session';

  section.innerHTML = '<div class="card-header"><div style="display:flex;align-items:center;gap:10px"><span class="live-dot"></span><span style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Live Race</span>' + (isLive ? '<span class="badge badge-live">LIVE</span>' : '') + '</div><div style="display:flex;align-items:center;gap:8px"><span style="font-size:var(--text-sm);color:var(--text-muted)">' + (session ? session.circuit + ' \u00B7 ' + lapStr : 'No live session currently active') + '</span></div></div>';

  if (!session) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.cssText = 'padding:40px 20px;text-align:center;color:var(--text-muted);font-size:var(--text-sm)';
    emptyMsg.textContent = 'No live session currently active.';
    section.appendChild(emptyMsg);
    return section;
  }

  if (positions.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.cssText = 'padding:40px 20px;text-align:center;color:var(--text-muted);font-size:var(--text-sm)';
    emptyMsg.textContent = 'Position data is currently unavailable for this session.';
    section.appendChild(emptyMsg);
    return section;
  }

  const timingSheet = document.createElement('div');
  const header = document.createElement('div');
  header.style.cssText = 'display:grid;grid-template-columns:36px 36px 1fr auto auto auto;gap:8px;padding:6px 16px;border-bottom:1px solid var(--border-subtle);border-top:1px solid var(--border-subtle)';
  header.innerHTML = '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Pos</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Tyre</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Driver</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Gap</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Last Lap</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Pit</div>';
  timingSheet.appendChild(header);
  positions.slice(0, 8).forEach(entry => { timingSheet.appendChild(createTimingRow(entry)); });
  section.appendChild(timingSheet);

  if (weather) {
    const weatherStrip = document.createElement('div');
    weatherStrip.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid var(--border-subtle);background:var(--bg-glass)';
    weatherStrip.innerHTML = '<div style="display:flex;align-items:center;gap:12px"><span style="font-size:24px">' + (weather.icon || '\u2600') + '</span><div><div style="font-size:var(--text-sm);font-weight:500;color:var(--text-primary)">' + (weather.condition || 'N/A') + '</div><div style="font-size:var(--text-xs);color:var(--text-muted)">Air ' + (weather.temp ?? 'N/A') + '\u00B0C \u00B7 Track ' + (weather.trackTemp ?? 'N/A') + '\u00B0C</div></div></div><div style="display:flex;gap:16px"><div style="text-align:center"><div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">' + (weather.humidity ?? 'N/A') + '%</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Humidity</div></div><div style="text-align:center"><div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:600;color:' + (weather.rain > 0 ? 'var(--accent-blue)' : 'var(--text-secondary)') + '">' + (weather.rain ?? 0) + 'mm</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Rain</div></div><div style="text-align:center"><div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">' + (weather.wind || 'N/A') + '</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Wind</div></div></div>';
    section.appendChild(weatherStrip);
  }

  return section;
}

function createNewsSection(news) {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.innerHTML = '<div class="card-header"><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Latest Updates</div></div>';

  if (!news || news.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.cssText = 'padding:40px 20px;text-align:center;color:var(--text-muted);font-size:var(--text-sm)';
    emptyMsg.textContent = 'News is currently unavailable.';
    section.appendChild(emptyMsg);
    return section;
  }

  news.slice(0, 5).forEach(article => { section.appendChild(createNewsCard(article)); });
  return section;
}

function createStandingsSection(standings) {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.innerHTML = '<div class="card-header"><div><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Driver Standings</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Current Season</div></div><span class="badge badge-surface">WDC</span></div>';

  const maxPts = standings[0]?.points || 1;
  standings.slice(0, 8).forEach(driver => {
    const pct = (driver.points / maxPts * 100).toFixed(1);
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:10px 20px;border-bottom:1px solid var(--border-subtle);cursor:pointer;transition:background 120ms';
    row.innerHTML = '<div style="font-family:var(--font-mono);font-size:var(--text-xs);color:' + (driver.pos <= 3 ? ['#ffd700','#c0c0c0','#cd7f32'][driver.pos-1] : 'var(--text-muted)') + ';min-width:18px;font-weight:600;text-align:center">' + driver.pos + '</div>' + (driver.flag ? '<span style="font-size:16px">' + driver.flag + '</span>' : '') + '<div style="flex:1;min-width:0"><div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + driver.driver + '</div><div style="font-size:var(--text-xs);color:' + driver.teamColor + ';margin-top:1px">' + driver.team + '</div></div><div style="text-align:right"><div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:700;color:var(--text-primary)">' + driver.points + '</div><div style="font-size:10px;color:var(--text-muted)">pts</div></div>';
    row.addEventListener('mouseenter', () => row.style.background = 'var(--bg-glass)');
    row.addEventListener('mouseleave', () => row.style.background = 'transparent');
    section.appendChild(row);
  });

  return section;
}

function createConstructorStandingsSection(standings) {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.innerHTML = '<div class="card-header"><div><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Constructor Standings</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Current Season</div></div><span class="badge badge-surface">WCC</span></div>';

  const maxPts = standings[0]?.points || 1;
  standings.forEach(team => {
    const pct = (team.points / maxPts * 100).toFixed(1);
    const row = document.createElement('div');
    row.style.cssText = 'padding:14px 20px;border-bottom:1px solid var(--border-subtle)';
    row.innerHTML = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px"><div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted);min-width:16px;text-align:center">' + team.pos + '</div><div style="width:10px;height:10px;border-radius:2px;background:' + team.color + ';flex-shrink:0"></div><div style="flex:1;font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">' + team.team + '</div><div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:700;color:var(--text-primary)">' + team.points + '</div></div><div class="progress-bar" style="margin-left:28px"><div class="progress-bar-fill" style="width:' + pct + '%;background:' + team.color + '"></div></div>';
    section.appendChild(row);
  });

  return section;
}

function createUpcomingSection(races) {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.style.cssText = 'display:flex;flex-direction:column';
  section.innerHTML = '<div class="card-header"><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Next Up</div></div>';

  if (!races || races.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.cssText = 'padding:40px 20px;text-align:center;color:var(--text-muted);font-size:var(--text-sm)';
    emptyMsg.textContent = 'Calendar is currently unavailable.';
    section.appendChild(emptyMsg);
    return section;
  }

  races.slice(0, 5).forEach(race => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border-subtle);cursor:pointer;transition:background 120ms';
    const d = new Date(race.date);
    const month = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    item.innerHTML = '<div style="width:40px;height:44px;background:var(--bg-elevated);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--border-subtle)"><div style="font-size:9px;color:var(--accent-red);font-weight:700;letter-spacing:0.06em">' + month + '</div><div style="font-family:var(--font-mono);font-size:var(--text-md);font-weight:800;color:var(--text-primary);line-height:1">' + day + '</div></div><div style="flex:1;min-width:0"><div style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (race.flag || '') + ' ' + (race.name || '').replace(' Grand Prix','').replace(' GP','') + '</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (race.circuit || race.location || '') + '</div></div>';
    item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-glass)');
    item.addEventListener('mouseleave', () => item.style.background = 'transparent');
    section.appendChild(item);
  });

  return section;
}

function createInsightSection() {
  const section = document.createElement('div');
  section.className = 'anim-fade-up';
  const insightCard = document.createElement('div');
  insightCard.style.cssText = 'background:linear-gradient(135deg,var(--bg-elevated) 0%,var(--bg-surface) 100%);border:1px solid var(--border-subtle);border-radius:20px;padding:28px;position:relative;overflow:hidden;height:100%';
  insightCard.innerHTML = '<div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.5"></div><div style="position:absolute;bottom:-60px;right:-60px;width:200px;height:200px;background:var(--accent-red);filter:blur(80px);opacity:0.06;border-radius:50%"></div><div style="display:flex;align-items:center;gap:8px;margin-bottom:20px"><div style="width:28px;height:28px;border-radius:8px;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff">F</div><div><div style="font-size:var(--text-xs);font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.1em">AI Race Insight</div><div style="font-size:10px;color:var(--text-muted)">Powered by real data</div></div></div><h2 style="font-size:var(--text-xl);font-weight:800;color:var(--text-primary);line-height:1.2;letter-spacing:-0.03em;margin-bottom:14px">Every number you see comes<br>from verified live sources.</h2><p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;margin-bottom:20px">Standings, weather, telemetry, and race data are fetched from the OpenF1 API. No fabricated values. No placeholders. If data is unavailable, we tell you.</p><button class="btn btn-secondary btn-sm" style="gap:6px"><span>\u25C7</span><span>Ask the Race Engineer</span></button>';
  section.appendChild(insightCard);
  return section;
}

function createAnalyticsPreview(standings) {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.innerHTML = '<div class="card-header"><div><div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Current Standings</div><div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Top ' + standings.length + ' drivers</div></div></div>';

  const chartBody = document.createElement('div');
  chartBody.style.cssText = 'padding:20px;display:flex;flex-direction:column;gap:16px';

  const maxPts = standings[0]?.points || 1;
  standings.forEach(d => {
    const row = document.createElement('div');
    row.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px"><div style="display:flex;align-items:center;gap:8px"><div style="width:3px;height:16px;border-radius:2px;background:' + d.teamColor + '"></div><span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">' + d.driver + '</span></div><span style="font-family:var(--font-mono);font-size:var(--text-sm);color:var(--text-muted)">' + d.points + ' pts</span></div><div class="progress-bar"><div class="progress-bar-fill" style="width:' + ((d.points / maxPts) * 100).toFixed(1) + '%;background:' + d.teamColor + '"></div></div>';
    chartBody.appendChild(row);
  });

  section.appendChild(chartBody);

  const strip = document.createElement('div');
  strip.style.cssText = 'padding:14px 20px;border-top:1px solid var(--border-subtle);background:var(--accent-cyan-soft);display:flex;align-items:center;gap:10px';
  strip.innerHTML = '<span style="font-size:16px">\u25C7</span><span style="font-size:var(--text-xs);color:var(--text-secondary)"><strong style="color:var(--accent-cyan)">Real data:</strong> All standings are fetched live from OpenF1 API.</span>';
  section.appendChild(strip);

  return section;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}
