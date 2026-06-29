/* ============================================
   FORMULAAI — NEWS PAGE
   ============================================ */
import { news } from '../data/mock-data.js';

export function createNewsPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = `
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-elevated) 100%);
    border-bottom: 1px solid var(--border-subtle);
    padding: 48px 40px 32px; position: relative; overflow: hidden;
  `;
  hero.innerHTML = `
    <div style="position:relative;z-index:1">
      <div style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">FormulaAI News</div>
      <h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Latest News</h1>
      <p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">Breaking race updates, technical analysis, and strategic insights.</p>
    </div>
  `;
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 320px;gap:32px;align-items:start';

  // Main news list
  const mainCol = document.createElement('div');
  
  // Featured article
  const featured = createFeaturedArticle(news[0]);
  mainCol.appendChild(featured);

  // News list
  const newsHeader = document.createElement('div');
  newsHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin:28px 0 16px';
  newsHeader.innerHTML = `
    <div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">All Stories</div>
    <div style="display:flex;gap:8px">
      <button class="tag active">All</button>
      <button class="tag">Strategy</button>
      <button class="tag">Technical</button>
      <button class="tag">Incidents</button>
    </div>
  `;
  mainCol.appendChild(newsHeader);

  const list = document.createElement('div');
  list.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden';

  news.forEach((article, i) => {
    const item = createNewsListItem(article, i);
    list.appendChild(item);
  });

  mainCol.appendChild(list);
  content.appendChild(mainCol);

  // Sidebar
  const sidebar = createNewsSidebar();
  content.appendChild(sidebar);

  // Responsive
  function onResize() {
    if (window.innerWidth < 900) {
      content.style.gridTemplateColumns = '1fr';
      sidebar.style.display = 'none';
    } else {
      content.style.gridTemplateColumns = '1fr 320px';
      sidebar.style.display = 'flex';
    }
  }
  onResize();
  window.addEventListener('resize', onResize, { signal });

  page.appendChild(content);
  return page;
}

function createFeaturedArticle(article) {
  const card = document.createElement('div');
  card.style.cssText = `
    background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-surface) 100%);
    border: 1px solid var(--border-subtle);
    border-radius: 20px;
    padding: 32px;
    cursor: pointer;
    transition: all 200ms var(--ease-out);
    position: relative;
    overflow: hidden;
    animation: fadeUp 400ms var(--ease-out) both;
  `;

  card.innerHTML = `
    <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.5"></div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
      <span class="badge badge-live">Featured</span>
      <span class="badge" style="background:var(--accent-red-soft);color:var(--accent-red);border:1px solid rgba(225,6,0,0.2)">${article.category}</span>
    </div>
    <h2 style="font-size:clamp(18px,3vw,28px);font-weight:800;color:var(--text-primary);letter-spacing:-0.03em;line-height:1.2;margin-bottom:12px">${article.title}</h2>
    <p style="font-size:var(--text-base);color:var(--text-muted);line-height:1.7;margin-bottom:20px">${article.summary}</p>
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div style="font-size:var(--text-xs);color:var(--text-muted)">${article.time} · ${article.readTime}</div>
      <button class="btn btn-secondary btn-sm">Read Full Story →</button>
    </div>
  `;

  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-2px)';
    card.style.boxShadow = 'var(--shadow-lg)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = 'none';
  });

  return card;
}

function createNewsListItem(article, index) {
  const icons = { Live: '🔴', Strategy: '🧠', Technical: '⚙️', Incident: '⚠️', Analysis: '📊' };
  const item = document.createElement('div');
  item.style.cssText = `
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--border-subtle);
    cursor: pointer;
    transition: background 120ms;
    animation: fadeUp 400ms var(--ease-out) ${index * 60}ms both;
  `;

  item.innerHTML = `
    <div style="width:48px;height:48px;border-radius:12px;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;border:1px solid var(--border-subtle)">${icons[article.category] || '📰'}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
        <span class="badge badge-surface" style="font-size:9px">${article.category}</span>
      </div>
      <div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);line-height:1.3;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${article.title}</div>
      <div style="font-size:var(--text-xs);color:var(--text-muted)">${article.time} · ${article.readTime}</div>
    </div>
    <div style="color:var(--text-muted);font-size:18px;flex-shrink:0">›</div>
  `;

  item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-glass)');
  item.addEventListener('mouseleave', () => item.style.background = 'transparent');
  return item;
}

function createNewsSidebar() {
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'display:flex;flex-direction:column;gap:20px;position:sticky;top:72px';

  sidebar.innerHTML = `
    <!-- Trending -->
    <div class="card">
      <div class="card-header">
        <div style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary)">Trending</div>
      </div>
      <div style="padding:12px 0">
        ${[
          'Verstappen tire strategy',
          'Norris qualifying pace',
          'Russell undercut threat',
          'Ferrari front wing upgrade',
          'Rain forecast Silverstone',
        ].map((t, i) => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 20px;cursor:pointer;transition:background 120ms;"
            onmouseenter="this.style.background='var(--bg-glass)'"
            onmouseleave="this.style.background='transparent'">
            <span style="font-family:var(--font-mono);font-size:var(--text-xs);color:${i === 0 ? 'var(--accent-red)' : 'var(--text-muted)'};min-width:18px">0${i+1}</span>
            <span style="font-size:var(--text-xs);color:var(--text-secondary)">${t}</span>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- AI Summary -->
    <div style="background:linear-gradient(135deg,var(--bg-elevated),var(--bg-surface));border:1px solid var(--border-subtle);border-radius:16px;padding:20px;position:relative;overflow:hidden">
      <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.5"></div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:12px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.08em">◈ AI News Brief</span>
      </div>
      <p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.7">The Silverstone race is shaping up to be a strategic masterclass. With the medium compound degrading faster than predicted and a potential rain threat, this could be a multi-stop race for several frontrunners.</p>
      <button class="btn btn-ghost btn-sm" style="margin-top:12px;font-size:var(--text-xs)">Get Full Briefing →</button>
    </div>
  `;

  return sidebar;
}
