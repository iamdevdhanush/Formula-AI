/* ============================================
   FORMULAAI — CARDS COMPONENT LIBRARY
   All reusable card components
   ============================================ */

// ── TRACK SVG OUTLINES ──────────────────────────────
const trackPaths = {
  silverstone: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 60 Q20 40 40 25 Q70 10 100 15 Q130 18 150 30 Q170 42 175 60 Q178 80 165 95 Q148 108 120 110 Q90 113 65 105 Q40 95 30 80 Z"
      stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <path d="M30 60 Q20 40 40 25 Q70 10 100 15 Q130 18 150 30 Q170 42 175 60 Q178 80 165 95 Q148 108 120 110 Q90 113 65 105 Q40 95 30 80 Z"
      stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="100" cy="15" r="4" fill="var(--accent-red)" opacity="0.9"/>
  </svg>`,
  monza: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 90 L40 50 Q40 20 70 20 L130 20 Q160 20 160 50 L160 90 Q160 105 145 105 L55 105 Q40 105 40 90 Z"
      stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <path d="M40 90 L40 50 Q40 20 70 20 L130 20 Q160 20 160 50 L160 90 Q160 105 145 105 L55 105 Q40 105 40 90 Z"
      stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="40" cy="55" r="4" fill="var(--accent-red)" opacity="0.9"/>
  </svg>`,
  monaco: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 95 L20 50 Q20 20 50 20 L90 20 Q110 20 115 35 L140 70 Q155 90 155 100 Q155 105 145 105 L30 105 Q20 105 20 95 Z"
      stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <path d="M20 95 L20 50 Q20 20 50 20 L90 20 Q110 20 115 35 L140 70 Q155 90 155 100 Q155 105 145 105 L30 105 Q20 105 20 95 Z"
      stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="20" cy="50" r="4" fill="var(--accent-red)" opacity="0.9"/>
  </svg>`,
  spa: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 80 Q15 60 30 40 Q50 15 80 20 Q100 23 110 40 L130 70 Q145 90 170 85 Q185 80 185 65 L185 45"
      stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <path d="M25 80 Q15 60 30 40 Q50 15 80 20 Q100 23 110 40 L130 70 Q145 90 170 85 Q185 80 185 65 L185 45"
      stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="80" cy="20" r="4" fill="var(--accent-cyan)" opacity="0.9"/>
  </svg>`,
  default: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="60" rx="70" ry="40"
      stroke="currentColor" stroke-width="8" fill="none" opacity="0.6"/>
    <ellipse cx="100" cy="60" rx="70" ry="40"
      stroke="currentColor" stroke-width="2" fill="none"/>
    <circle cx="100" cy="20" r="4" fill="var(--accent-red)" opacity="0.9"/>
  </svg>`,
};

export function getTrackSvg(circuitId) {
  return trackPaths[circuitId] || trackPaths.default;
}

// ── DRIVER CARD ──────────────────────────────────────
export function createDriverCard(driver) {
  const card = document.createElement('div');
  card.className = 'driver-card card-interactive anim-fade-up';
  card.innerHTML = `
    <div class="driver-card-flag" style="background: ${driver.teamColor}"></div>
    <div class="driver-card-body">
      <div class="driver-card-number">${driver.number}</div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span style="font-size:20px">${driver.flag}</span>
        <span class="badge badge-surface" style="border-color:${driver.teamColor}33;color:${driver.teamColor}">${driver.abbr}</span>
      </div>
      <div class="driver-card-name">${driver.name}</div>
      <div class="driver-card-team" style="color:${driver.teamColor}">${driver.team}</div>
      <div class="driver-card-stats">
        <div class="driver-stat-item">
          <div class="driver-stat-value" style="color:${driver.teamColor}">${driver.wins}</div>
          <div class="driver-stat-label">Wins</div>
        </div>
        <div class="driver-stat-item">
          <div class="driver-stat-value">${driver.podiums}</div>
          <div class="driver-stat-label">Podiums</div>
        </div>
        <div class="driver-stat-item">
          <div class="driver-stat-value">${driver.points}</div>
          <div class="driver-stat-label">Points</div>
        </div>
      </div>
    </div>
  `;
  return card;
}

// ── RACE CARD ────────────────────────────────────────
export function createRaceCard(race, isLive = false) {
  const card = document.createElement('div');
  card.className = 'race-card card-interactive';
  card.innerHTML = `
    <div class="race-card-hero" style="background: linear-gradient(135deg, ${isLive ? 'rgba(225,6,0,0.15)' : 'var(--bg-elevated)'} 0%, var(--bg-surface) 100%)">
      ${isLive ? '<div class="glow-red" style="width:200px;height:200px;top:-60px;right:-60px;opacity:0.2"></div>' : ''}
      <span style="font-size:48px;position:relative;z-index:1">${race.flag}</span>
    </div>
    <div class="race-card-body">
      <div class="race-card-round">
        Round ${race.round} · 2025
        ${isLive ? `<span class="badge badge-live" style="margin-left:8px"><span class="live-dot"></span> LIVE</span>` : ''}
      </div>
      <div class="race-card-name">${race.race}</div>
      <div class="race-card-meta">
        <span>🏟️ ${race.circuit.split(',')[0]}</span>
        <span>📅 ${formatDate(race.date)}</span>
        ${race.winner ? `<span>🏆 ${race.winner}</span>` : ''}
      </div>
    </div>
  `;
  return card;
}

// ── NEWS CARD ────────────────────────────────────────
export function createNewsCard(article) {
  const card = document.createElement('div');
  card.className = 'news-card';
  card.innerHTML = `
    <div>
      <div class="news-card-category">${article.category}</div>
      <div class="news-card-title">${article.title}</div>
      <div class="news-card-meta">${article.time} · ${article.readTime}</div>
    </div>
    <div class="news-card-image" style="background: var(--bg-elevated); display:flex;align-items:center;justify-content:center;font-size:28px">
      ${article.category === 'Live' ? '🔴' : article.category === 'Strategy' ? '🧠' : article.category === 'Technical' ? '⚙️' : article.category === 'Incident' ? '⚠️' : '📊'}
    </div>
  `;
  return card;
}

// ── TIMING ROW ───────────────────────────────────────
export function createTimingRow(entry, isFirst = false) {
  const row = document.createElement('div');
  row.className = 'timing-row';
  
  const posClass = entry.pos === 1 ? 'first' : entry.pos === 2 ? 'second' : entry.pos === 3 ? 'third' : '';
  const gapColor = entry.pos === 1 ? 'var(--accent-cyan)' : 
                   parseFloat(entry.interval) < 1.5 ? 'var(--accent-amber)' : 'var(--text-secondary)';
  
  row.innerHTML = `
    <div class="timing-pos ${posClass}">${entry.pos}</div>
    <div style="display:flex;align-items:center;justify-content:center">
      <div class="timing-tire ${entry.tire}" style="font-size:9px">${entry.tire[0].toUpperCase()}</div>
    </div>
    <div>
      <div class="timing-driver">
        ${entry.drs ? '<span style="color:var(--accent-cyan);font-size:10px;font-weight:700;margin-right:4px">DRS</span>' : ''}
        ${entry.driver}
      </div>
      <div class="timing-team" style="color:${entry.teamColor};opacity:0.8">${entry.team}</div>
    </div>
    <div class="timing-gap" style="color:${gapColor}">${entry.gap}</div>
    <div class="timing-gap" style="color:var(--text-muted)">${entry.lastLap}</div>
    <div class="timing-gap">${entry.pit}x</div>
  `;
  return row;
}

// ── CIRCUIT CARD ─────────────────────────────────────
export function createCircuitCard(circuit) {
  const card = document.createElement('div');
  card.className = 'circuit-card card-interactive';
  card.innerHTML = `
    <div class="circuit-track-area" style="color:var(--text-muted)">
      ${getTrackSvg(circuit.id)}
    </div>
    <div class="circuit-card-body">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:18px">${circuit.flag}</span>
        <span class="badge badge-surface">${circuit.turns} turns</span>
      </div>
      <div style="font-size:var(--text-sm);font-weight:var(--weight-bold);color:var(--text-primary);letter-spacing:var(--tracking-snug)">${circuit.race}</div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">${circuit.name}</div>
      <div style="display:flex;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--border-subtle)">
        <div>
          <div style="font-family:var(--font-mono);font-size:var(--text-xs);font-weight:600;color:var(--text-primary)">${circuit.length}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Length</div>
        </div>
        <div>
          <div style="font-family:var(--font-mono);font-size:var(--text-xs);font-weight:600;color:var(--accent-cyan)">${circuit.lapRecord.time}</div>
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em">Lap Record</div>
        </div>
      </div>
    </div>
  `;
  return card;
}

// ── STAT CHIPS ROW ───────────────────────────────────
export function createStatRow(stats) {
  const row = document.createElement('div');
  row.className = 'grid-4';
  stats.forEach(stat => {
    const chip = document.createElement('div');
    chip.className = 'stat-chip';
    chip.innerHTML = `
      <div class="stat-chip-value" style="${stat.color ? `color:${stat.color}` : ''}">${stat.value}</div>
      <div class="stat-chip-label">${stat.label}</div>
    `;
    row.appendChild(chip);
  });
  return row;
}

// ── INSIGHT CARD ─────────────────────────────────────
export function createInsightCard(insight) {
  const card = document.createElement('div');
  card.className = 'insight-card';
  card.innerHTML = `
    <div class="insight-card-label">
      <span>◈</span>
      <span>AI Insight</span>
    </div>
    <div class="insight-card-content">${insight}</div>
  `;
  return card;
}

// ── WEATHER MINI CARD ────────────────────────────────
export function createWeatherCard(weather) {
  const card = document.createElement('div');
  card.className = 'weather-card';
  card.innerHTML = `
    <div class="weather-icon">${weather.icon}</div>
    <div style="flex:1">
      <div class="weather-temp">${weather.temp}°C</div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">${weather.condition}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;text-align:right">
      <div style="font-size:var(--text-xs);color:var(--text-muted)">Track <span style="font-family:var(--font-mono);color:var(--text-secondary)">${weather.trackTemp}°C</span></div>
      <div style="font-size:var(--text-xs);color:var(--text-muted)">Wind <span style="font-family:var(--font-mono);color:var(--text-secondary)">${weather.wind}</span></div>
      <div style="font-size:var(--text-xs);color:var(--text-muted)">Humidity <span style="font-family:var(--font-mono);color:var(--text-secondary)">${weather.humidity}%</span></div>
    </div>
  `;
  return card;
}

// ── INLINE CHART (SVG Sparkline) ─────────────────────
export function createSparkline(data, color = 'var(--accent-red)', height = 40) {
  const width = 160;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 4;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + ((max - v) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.overflow = 'visible';

  // Area fill
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  const areaPoints = `${pad},${height - pad} ${points} ${pad + w},${height - pad}`;
  area.setAttribute('points', areaPoints);
  area.setAttribute('fill', color);
  area.setAttribute('opacity', '0.08');
  svg.appendChild(area);

  // Line
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', points);
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', color);
  polyline.setAttribute('stroke-width', '2');
  polyline.setAttribute('stroke-linecap', 'round');
  polyline.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(polyline);

  // End dot
  const lastX = pad + w;
  const lastY = pad + ((max - data[data.length - 1]) / range) * h;
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('cx', lastX);
  dot.setAttribute('cy', lastY);
  dot.setAttribute('r', '3');
  dot.setAttribute('fill', color);
  svg.appendChild(dot);

  return svg;
}

// ── BAR CHART (horizontal) ───────────────────────────
export function createBarChart(items, color = 'var(--accent-red)') {
  const container = document.createElement('div');
  container.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
  
  const maxVal = Math.max(...items.map(i => i.value));
  
  items.forEach(item => {
    const pct = (item.value / maxVal * 100).toFixed(1);
    const row = document.createElement('div');
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <span style="font-size:var(--text-sm);color:var(--text-secondary)">${item.label}</span>
        <span style="font-family:var(--font-mono);font-size:var(--text-sm);font-weight:600;color:var(--text-primary)">${item.display || item.value}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width:${pct}%;background:${item.color || color}"></div>
      </div>
    `;
    container.appendChild(row);
  });
  
  return container;
}

// ── UTILITY ──────────────────────────────────────────
export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatLapTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(3);
  return `${m}:${s.padStart(6, '0')}`;
}
