/* ============================================
   FORMULAAI — HOME PAGE
   The editorial AI-first homepage
   ============================================ */

import {
  currentRace, standings, constructorStandings, liveLeaderboard,
  news, suggestedQuestions, trendingTopics, calendar
} from '../data/mock-data.js';
import { createTimingRow, createNewsCard, createInsightCard, createWeatherCard, createSparkline } from '../components/cards.js';

export function createHomePage(router) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  // ── TICKER BANNER ────────────────────────────────
  const ticker = createTickerBanner();
  page.appendChild(ticker);

  // ── HERO SECTION ─────────────────────────────────
  const hero = createHeroSection(router);
  page.appendChild(hero);

  // ── MAIN CONTENT ─────────────────────────────────
  const content = document.createElement('div');
  content.style.cssText = 'padding: 48px 40px; max-width: 1400px; margin: 0 auto;';
  content.className = 'anim-stagger';

  // Row 1: Live Race + News
  const row1 = document.createElement('div');
  row1.style.cssText = 'display:grid;grid-template-columns:1fr 380px;gap:24px;margin-bottom:40px;';
  row1.appendChild(createLiveRaceSection());
  row1.appendChild(createNewsSection());
  content.appendChild(row1);

  // Row 2: Standings + Strategy + Upcoming
  const row2 = document.createElement('div');
  row2.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 320px;gap:24px;margin-bottom:40px;';
  row2.appendChild(createStandingsSection());
  row2.appendChild(createConstructorStandingsSection());
  row2.appendChild(createUpcomingSection());
  content.appendChild(row2);

  // Row 3: AI Insight + Analytics preview
  const row3 = document.createElement('div');
  row3.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:40px;';
  row3.appendChild(createInsightSection());
  row3.appendChild(createAnalyticsPreview());
  content.appendChild(row3);

  page.appendChild(content);

  // Make responsive
  handleHomeResponsive(row1, row2, row3);
  window.addEventListener('resize', () => handleHomeResponsive(row1, row2, row3));

  return page;
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

// ── TICKER BANNER ────────────────────────────────────
function createTickerBanner() {
  const banner = document.createElement('div');
  banner.className = 'ticker-banner';
  
  const tickerItems = [
    { label: '🔴 LIVE', value: 'British GP · Lap 34/52', color: 'var(--accent-red)' },
    { label: '🏆 P1', value: 'VER +0.0s', color: 'var(--accent-cyan)' },
    { label: '⚡ P2', value: 'NOR +3.4s' },
    { label: '🛡️ P3', value: 'HAM +7.9s' },
    { label: '🌡️ Track', value: '31°C' },
    { label: '💨 Wind', value: '14km/h NNE' },
    { label: '🔢 Fastest', value: 'RUS 1:28.891' },
    { label: '🛞 Leaders', value: 'Medium tyres' },
    { label: '🏁 Next Race', value: 'Hungarian GP · Jul 20' },
  ];

  const label = document.createElement('div');
  label.className = 'ticker-label';
  label.innerHTML = `
    <span class="live-dot"></span>
    <span style="font-size:10px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.08em">Live</span>
  `;
  banner.appendChild(label);

  const track = document.createElement('div');
  track.className = 'ticker-track';
  
  // Double for seamless loop
  [...tickerItems, ...tickerItems].forEach(item => {
    const el = document.createElement('div');
    el.className = 'ticker-item';
    el.innerHTML = `
      <span style="color:${item.color || 'var(--text-muted)'}; font-weight:600">${item.label}</span>
      <span style="color:${item.color ? item.color : 'var(--text-secondary)'}">${item.value}</span>
      <span class="ticker-separator">·</span>
    `;
    track.appendChild(el);
  });

  banner.appendChild(track);
  return banner;
}

// ── HERO SECTION ─────────────────────────────────────
function createHeroSection(router) {
  const hero = document.createElement('section');
  hero.style.cssText = `
    position: relative;
    padding: 80px 40px 64px;
    overflow: hidden;
    min-height: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  `;

  // Background effects
  hero.innerHTML = `
    <div class="glow-red" style="width:600px;height:400px;top:-100px;left:-100px;opacity:0.10"></div>
    <div class="glow-cyan" style="width:400px;height:300px;bottom:-50px;right:-50px;opacity:0.08"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center, rgba(225,6,0,0.04) 0%, transparent 70%);pointer-events:none"></div>
  `;

  const inner = document.createElement('div');
  inner.style.cssText = 'position:relative;z-index:1;max-width:780px;width:100%';

  // Race status pill
  const pill = document.createElement('div');
  pill.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:28px';
  pill.innerHTML = `
    <div style="display:inline-flex;align-items:center;gap:8px;padding:6px 16px;background:var(--accent-red-soft);border:1px solid rgba(225,6,0,0.25);border-radius:9999px">
      <span class="live-dot"></span>
      <span style="font-size:11px;font-weight:700;color:var(--accent-red);letter-spacing:0.1em;text-transform:uppercase">Round 12 · Silverstone</span>
      <span style="color:var(--text-muted);font-size:11px">·</span>
      <span style="font-size:11px;color:var(--accent-red);font-weight:600">Lap 34/52</span>
    </div>
    <div style="padding:6px 14px;background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:9999px;font-size:11px;color:var(--text-muted);font-weight:500">
      🇬🇧 British Grand Prix
    </div>
  `;
  inner.appendChild(pill);

  // Greeting + heading
  const heading = document.createElement('div');
  heading.style.cssText = 'margin-bottom:12px';
  
  const greetingText = getGreeting();
  heading.innerHTML = `
    <div style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:12px;letter-spacing:0.04em">
      ${greetingText}, Race Fan
    </div>
    <h1 style="font-size:clamp(28px,5vw,52px);font-weight:900;line-height:1.05;letter-spacing:-0.04em;color:var(--text-primary);margin-bottom:8px">
      Your AI Race Engineer<br>
      <span style="background:linear-gradient(135deg,#ff3d36 0%,var(--accent-red) 60%,#c00000 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">is watching the race.</span>
    </h1>
    <p style="font-size:var(--text-md);color:var(--text-muted);font-weight:400;max-width:520px;margin:0 auto;line-height:1.6">
      Ask anything about live race strategy, telemetry, regulations, drivers, or history.
    </p>
  `;
  inner.appendChild(heading);

  // Search bar
  const searchWrapper = document.createElement('div');
  searchWrapper.style.cssText = 'position:relative;margin-top:36px;margin-bottom:24px';
  
  const searchIcon = document.createElement('div');
  searchIcon.style.cssText = 'position:absolute;left:22px;top:50%;transform:translateY(-50%);pointer-events:none;z-index:2;display:flex;align-items:center;gap:6px';
  searchIcon.innerHTML = `
    <span style="font-size:20px;opacity:0.5">◈</span>
    <div style="width:1px;height:18px;background:var(--border-default)"></div>
  `;

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'search-input';
  searchInput.id = 'hero-search-input';
  searchInput.placeholder = 'Ask your Race Engineer... try "Why is Verstappen on mediums?"';
  searchInput.style.cssText = `
    width: 100%;
    padding: 22px 80px 22px 70px;
    font-size: var(--text-md);
    font-family: var(--font-primary);
    font-weight: 400;
    color: var(--text-primary);
    background: var(--bg-surface);
    border: 1px solid var(--border-default);
    border-radius: 20px;
    transition: all 200ms var(--ease-out);
    caret-color: var(--accent-red);
  `;
  searchInput.setAttribute('aria-label', 'Ask the Race Engineer AI');

  searchInput.addEventListener('focus', () => {
    searchInput.style.borderColor = 'var(--border-default)';
    searchInput.style.boxShadow = '0 0 0 1px var(--border-subtle), 0 20px 60px rgba(0,0,0,0.5)';
    searchInput.style.background = 'var(--bg-elevated)';
  });
  searchInput.addEventListener('blur', () => {
    searchInput.style.boxShadow = 'none';
    searchInput.style.background = 'var(--bg-surface)';
  });

  const searchBtn = document.createElement('button');
  searchBtn.style.cssText = `
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: var(--accent-red);
    color: #fff;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 150ms var(--ease-spring);
    border: none;
    box-shadow: var(--shadow-red);
  `;
  searchBtn.innerHTML = '↑';
  searchBtn.setAttribute('aria-label', 'Submit question');
  
  searchBtn.addEventListener('mouseenter', () => {
    searchBtn.style.transform = 'translateY(-50%) scale(1.08)';
  });
  searchBtn.addEventListener('mouseleave', () => {
    searchBtn.style.transform = 'translateY(-50%) scale(1)';
  });

  // Navigate to chat on search
  const handleSearch = (router) => {
    const q = searchInput.value.trim();
    if (q) router.navigate('race-engineer');
  };

  searchBtn.addEventListener('click', () => handleSearch(router));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) handleSearch(router);
  });

  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(searchInput);
  searchWrapper.appendChild(searchBtn);
  inner.appendChild(searchWrapper);

  // Trending topics / suggested questions
  const trending = document.createElement('div');
  trending.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;justify-content:center;';
  
  suggestedQuestions.slice(0, 5).forEach(q => {
    const chip = document.createElement('button');
    chip.style.cssText = `
      padding: 8px 16px;
      background: var(--bg-glass);
      border: 1px solid var(--border-subtle);
      border-radius: 9999px;
      font-size: var(--text-xs);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 150ms var(--ease-out);
      white-space: nowrap;
      font-family: var(--font-primary);
    `;
    chip.textContent = q;
    chip.addEventListener('mouseenter', () => {
      chip.style.background = 'var(--bg-glass-hover)';
      chip.style.borderColor = 'var(--border-default)';
      chip.style.color = 'var(--text-primary)';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.background = 'var(--bg-glass)';
      chip.style.borderColor = 'var(--border-subtle)';
      chip.style.color = 'var(--text-secondary)';
    });
    chip.addEventListener('click', () => {
      searchInput.value = q;
      router.navigate('race-engineer');
    });
    trending.appendChild(chip);
  });

  inner.appendChild(trending);
  hero.appendChild(inner);
  return hero;
}

// ── LIVE RACE SECTION ────────────────────────────────
function createLiveRaceSection() {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.style.cssText = 'overflow:visible';

  section.innerHTML = `
    <div class="card-header">
      <div style="display:flex;align-items:center;gap:10px">
        <span class="live-dot"></span>
        <span style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Live Race</span>
        <span class="badge badge-live">LIVE</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <span class="badge badge-surface">Lap ${currentRace.lap}/${currentRace.totalLaps}</span>
        <span style="font-size:var(--text-sm);color:var(--text-muted)">🇬🇧 Silverstone</span>
      </div>
    </div>
  `;

  // Race progress bar
  const progressPct = (currentRace.lap / currentRace.totalLaps * 100).toFixed(1);
  const progressBar = document.createElement('div');
  progressBar.style.cssText = 'padding:0 20px;margin-top:0;margin-bottom:12px;margin-top:16px';
  progressBar.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:6px">
      <span style="font-size:var(--text-xs);color:var(--text-muted)">Race Progress</span>
      <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--accent-cyan)">${progressPct}%</span>
    </div>
    <div class="progress-bar" style="height:3px">
      <div class="progress-bar-fill cyan" style="width:${progressPct}%"></div>
    </div>
  `;
  section.appendChild(progressBar);

  // Timing sheet
  const timingSheet = document.createElement('div');
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    display: grid;
    grid-template-columns: 36px 36px 1fr auto auto auto;
    gap: 8px;
    padding: 6px 16px;
    border-bottom: 1px solid var(--border-subtle);
    border-top: 1px solid var(--border-subtle);
  `;
  header.innerHTML = `
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Pos</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:center">Tyre</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Driver</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Gap</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Last Lap</div>
    <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;text-align:right">Pit</div>
  `;
  timingSheet.appendChild(header);

  liveLeaderboard.forEach(entry => {
    timingSheet.appendChild(createTimingRow(entry));
  });

  section.appendChild(timingSheet);

  // Weather strip
  const weatherStrip = document.createElement('div');
  weatherStrip.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-top: 1px solid var(--border-subtle);
    background: var(--bg-glass);
  `;
  weatherStrip.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <span style="font-size:24px">${currentRace.weather.icon}</span>
      <div>
        <div style="font-size:var(--text-sm);font-weight:500;color:var(--text-primary)">${currentRace.weather.condition}</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted)">Air ${currentRace.weather.temp}°C · Track ${currentRace.weather.trackTemp}°C</div>
      </div>
    </div>
    <div style="display:flex;gap:16px">
      <div style="text-align:center">
        <div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${currentRace.weather.humidity}%</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Humidity</div>
      </div>
      <div style="text-align:center">
        <div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:600;color:${currentRace.weather.rain > 0 ? 'var(--accent-blue)' : 'var(--text-secondary)'}">${currentRace.weather.rain}mm</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Rain</div>
      </div>
      <div style="text-align:center">
        <div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${currentRace.weather.wind}</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em">Wind</div>
      </div>
    </div>
  `;
  section.appendChild(weatherStrip);

  return section;
}

// ── NEWS SECTION ─────────────────────────────────────
function createNewsSection() {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';

  section.innerHTML = `
    <div class="card-header">
      <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Latest News</div>
      <button class="btn btn-ghost btn-sm">All News →</button>
    </div>
  `;

  news.forEach(article => {
    section.appendChild(createNewsCard(article));
  });

  return section;
}

// ── DRIVER STANDINGS ─────────────────────────────────
function createStandingsSection() {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';

  section.innerHTML = `
    <div class="card-header">
      <div>
        <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Driver Standings</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">2025 · After Round 11</div>
      </div>
      <span class="badge badge-surface">WDC</span>
    </div>
  `;

  const maxPts = standings[0].points;

  standings.slice(0, 8).forEach(driver => {
    const pct = (driver.points / maxPts * 100).toFixed(1);
    const row = document.createElement('div');
    row.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background 120ms;
    `;
    row.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:${driver.pos <= 3 ? ['#ffd700','#c0c0c0','#cd7f32'][driver.pos-1] : 'var(--text-muted)'};min-width:18px;font-weight:600;text-align:center">${driver.pos}</div>
      <span style="font-size:16px">${driver.flag}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${driver.driver}</div>
        <div style="font-size:var(--text-xs);color:${driver.teamColor};margin-top:1px">${driver.team}</div>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:700;color:var(--text-primary)">${driver.points}</div>
        <div style="font-size:10px;color:var(--text-muted)">pts</div>
      </div>
    `;
    row.addEventListener('mouseenter', () => row.style.background = 'var(--bg-glass)');
    row.addEventListener('mouseleave', () => row.style.background = 'transparent');
    section.appendChild(row);
  });

  return section;
}

// ── CONSTRUCTOR STANDINGS ────────────────────────────
function createConstructorStandingsSection() {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';

  section.innerHTML = `
    <div class="card-header">
      <div>
        <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Constructor Standings</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">2025 · After Round 11</div>
      </div>
      <span class="badge badge-surface">WCC</span>
    </div>
  `;

  const maxPts = constructorStandings[0].points;

  constructorStandings.forEach(team => {
    const pct = (team.points / maxPts * 100).toFixed(1);
    const row = document.createElement('div');
    row.style.cssText = 'padding:14px 20px;border-bottom:1px solid var(--border-subtle);';
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
        <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted);min-width:16px;text-align:center">${team.pos}</div>
        <div style="width:10px;height:10px;border-radius:2px;background:${team.color};flex-shrink:0"></div>
        <div style="flex:1;font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${team.team}</div>
        <div style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:700;color:var(--text-primary)">${team.points}</div>
      </div>
      <div class="progress-bar" style="margin-left:28px">
        <div class="progress-bar-fill" style="width:${pct}%;background:${team.color}"></div>
      </div>
    `;
    section.appendChild(row);
  });

  // Simple points trend sparkline
  const sparkData = [340, 360, 375, 390, 400, 405];
  const sparkSection = document.createElement('div');
  sparkSection.style.cssText = 'padding:16px 20px;border-top:1px solid var(--border-subtle)';
  sparkSection.innerHTML = `
    <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em">Red Bull Points Trend</div>
  `;
  const sparkline = createSparkline(sparkData, '#3671C6', 50);
  sparkline.style.width = '100%';
  sparkSection.appendChild(sparkline);
  section.appendChild(sparkSection);

  return section;
}

// ── UPCOMING SECTION ─────────────────────────────────
function createUpcomingSection() {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';
  section.style.cssText = 'display:flex;flex-direction:column;';

  section.innerHTML = `
    <div class="card-header">
      <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Calendar</div>
      <button class="btn btn-ghost btn-sm">Full →</button>
    </div>
  `;

  const upcomingRaces = calendar.filter(r => r.status === 'upcoming').slice(0, 5);

  upcomingRaces.forEach(race => {
    const item = document.createElement('div');
    item.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      transition: background 120ms;
    `;
    const d = new Date(race.date);
    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const month = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
    const day = d.getDate();

    item.innerHTML = `
      <div style="width:40px;height:44px;background:var(--bg-elevated);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;border:1px solid var(--border-subtle)">
        <div style="font-size:9px;color:var(--accent-red);font-weight:700;letter-spacing:0.06em">${month}</div>
        <div style="font-family:var(--font-mono);font-size:var(--text-md);font-weight:800;color:var(--text-primary);line-height:1">${day}</div>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:var(--text-xs);font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${race.flag} ${race.race.replace(' Grand Prix','').replace(' GP','')}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Round ${race.round}</div>
      </div>
    `;

    item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-glass)');
    item.addEventListener('mouseleave', () => item.style.background = 'transparent');
    section.appendChild(item);
  });

  return section;
}

// ── AI INSIGHT SECTION ───────────────────────────────
function createInsightSection() {
  const section = document.createElement('div');
  section.className = 'anim-fade-up';

  const insightCard = document.createElement('div');
  insightCard.style.cssText = `
    background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%);
    border: 1px solid var(--border-subtle);
    border-radius: 20px;
    padding: 28px;
    position: relative;
    overflow: hidden;
    height: 100%;
  `;
  insightCard.innerHTML = `
    <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.5"></div>
    <div style="position:absolute;bottom:-60px;right:-60px;width:200px;height:200px;background:var(--accent-red);filter:blur(80px);opacity:0.06;border-radius:50%"></div>
    
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px">
      <div style="width:28px;height:28px;border-radius:8px;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff">F</div>
      <div>
        <div style="font-size:var(--text-xs);font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.1em">AI Race Insight</div>
        <div style="font-size:10px;color:var(--text-muted)">Updated live · Lap 34</div>
      </div>
      <div style="margin-left:auto">
        <span class="badge badge-live"><span class="live-dot"></span>Live</span>
      </div>
    </div>
    
    <h2 style="font-size:var(--text-xl);font-weight:800;color:var(--text-primary);line-height:1.2;letter-spacing:-0.03em;margin-bottom:14px">
      Russell's soft tyre gamble<br>could rewrite this race.
    </h2>
    
    <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;margin-bottom:20px">
      On lap 28, Mercedes pitted George Russell onto a fresh set of soft-compound tyres. This is a calculated two-stop risk. His current pace is 0.8s faster per lap than Verstappen — if maintained, he closes 18 seconds in the remaining laps.
    </p>
    
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
      <div style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:10px;padding:12px;text-align:center">
        <div style="font-family:var(--font-mono);font-size:var(--text-lg);font-weight:700;color:var(--accent-cyan)">0.8s</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Pace Advantage/Lap</div>
      </div>
      <div style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:10px;padding:12px;text-align:center">
        <div style="font-family:var(--font-mono);font-size:var(--text-lg);font-weight:700;color:var(--accent-amber)">18</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">Laps Remaining</div>
      </div>
      <div style="background:var(--bg-glass);border:1px solid var(--border-subtle);border-radius:10px;padding:12px;text-align:center">
        <div style="font-family:var(--font-mono);font-size:var(--text-lg);font-weight:700;color:var(--accent-red)">64%</div>
        <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;margin-top:2px">P1 Probability</div>
      </div>
    </div>
    
    <button class="btn btn-secondary btn-sm" style="gap:6px">
      <span>◈</span>
      <span>Deep Dive with Race Engineer</span>
    </button>
  `;

  section.appendChild(insightCard);
  return section;
}

// ── ANALYTICS PREVIEW ────────────────────────────────
function createAnalyticsPreview() {
  const section = document.createElement('div');
  section.className = 'card anim-fade-up';

  section.innerHTML = `
    <div class="card-header">
      <div>
        <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">Race Pace Analysis</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Lap times over stint — Top 3</div>
      </div>
      <button class="btn btn-ghost btn-sm">Full →</button>
    </div>
  `;

  // Fake lap time data for sparklines
  const verData = [89.8,89.6,89.9,90.1,89.7,89.9,90.2,90.0,90.3,90.1,90.5,90.3];
  const norData = [89.1,89.0,89.3,89.1,89.0,88.9,88.8,88.9,89.0,88.8,88.7,88.8];
  const rusData = [88.5,88.4,88.3,88.4,88.5,88.3,88.2,88.3,88.4,88.2,88.1,88.0];

  const chartBody = document.createElement('div');
  chartBody.style.cssText = 'padding:20px;display:flex;flex-direction:column;gap:20px';

  const drivers = [
    { name: 'Verstappen', color: '#3671C6', data: verData, gap: '0.0s ahead', tyre: 'M' },
    { name: 'Norris',     color: '#FF8000', data: norData, gap: '3.4s back',  tyre: 'M' },
    { name: 'Russell',    color: '#27F4D2', data: rusData, gap: '21s back',   tyre: 'S' },
  ];

  drivers.forEach(d => {
    const row = document.createElement('div');
    row.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:3px;height:16px;border-radius:2px;background:${d.color}"></div>
          <span style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${d.name}</span>
          <span style="width:16px;height:16px;border-radius:50%;background:${d.color === '#27F4D2' ? '#27F4D2' : d.color === '#FF8000' ? '#ffd13b' : '#e10600'};font-size:9px;display:flex;align-items:center;justify-content:center;font-weight:700;color:${d.color === '#27F4D2' ? '#000' : d.color === '#FF8000' ? '#000' : '#fff'}">${d.tyre}</span>
        </div>
        <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted)">${d.gap}</div>
      </div>
    `;
    const sparkline = createSparkline(d.data, d.color, 44);
    sparkline.style.width = '100%';
    row.appendChild(sparkline);
    chartBody.appendChild(row);
  });

  section.appendChild(chartBody);

  // AI insight strip
  const strip = document.createElement('div');
  strip.style.cssText = 'padding:14px 20px;border-top:1px solid var(--border-subtle);background:var(--accent-cyan-soft);display:flex;align-items:center;gap:10px';
  strip.innerHTML = `
    <span style="font-size:16px">◈</span>
    <span style="font-size:var(--text-xs);color:var(--text-secondary)"><strong style="color:var(--accent-cyan)">AI:</strong> Russell's soft compound is producing the fastest sector 3 times. Undercut attempt window opens within 6 laps.</span>
  `;
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
