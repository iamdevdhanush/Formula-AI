import { getNews } from '../services/news.service.js';
import { createSkeleton, createErrorState, createEmptyState } from '../components/states.js';

export function createNewsPage(router, signal) {
  const page = document.createElement('div');
  page.className = 'page-enter';

  const hero = document.createElement('div');
  hero.style.cssText = 'background:linear-gradient(135deg,var(--bg-primary) 0%,var(--bg-elevated) 100%);border-bottom:1px solid var(--border-subtle);padding:48px 40px 32px;position:relative;overflow:hidden';
  hero.innerHTML = '<div style="position:relative;z-index:1"><div style="font-size:11px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.12em;margin-bottom:10px">FormulaAI News</div><h1 style="font-size:clamp(28px,4vw,48px);font-weight:900;letter-spacing:-0.04em;color:var(--text-primary)">Latest Updates</h1><p style="font-size:var(--text-base);color:var(--text-muted);margin-top:8px">Race updates, technical reports, and FIA communications sourced from OpenF1 API.</p></div>';
  page.appendChild(hero);

  const content = document.createElement('div');
  content.style.cssText = 'padding:40px;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 320px;gap:32px;align-items:start';

  const mainCol = document.createElement('div');
  mainCol.id = 'news-main';
  for (let i = 0; i < 3; i++) mainCol.appendChild(createSkeleton('card'));
  content.appendChild(mainCol);

  const sidebar = createNewsSidebar();
  sidebar.id = 'news-sidebar';
  content.appendChild(sidebar);

  page.appendChild(content);

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

  loadNews();

  return page;
}

async function loadNews() {
  try {
    const articles = await getNews();
    const mainCol = document.getElementById('news-main');
    if (!mainCol) return;

    mainCol.innerHTML = '';

    if (articles.length === 0) {
      mainCol.appendChild(createEmptyState('News is currently unavailable.'));
      return;
    }

    const featured = createFeaturedArticle(articles[0]);
    mainCol.appendChild(featured);

    const newsHeader = document.createElement('div');
    newsHeader.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin:28px 0 16px';
    newsHeader.innerHTML = '<div style="font-size:var(--text-base);font-weight:700;color:var(--text-primary)">All Updates</div>';
    mainCol.appendChild(newsHeader);

    const list = document.createElement('div');
    list.style.cssText = 'background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden';

    articles.forEach((article, i) => {
      list.appendChild(createNewsListItem(article, i));
    });

    mainCol.appendChild(list);
  } catch (e) {
    const mainCol = document.getElementById('news-main');
    if (mainCol) {
      mainCol.innerHTML = '';
      mainCol.appendChild(createErrorState(e.message, loadNews));
    }
  }
}

function createFeaturedArticle(article) {
  const card = document.createElement('div');
  card.style.cssText = 'background:linear-gradient(135deg,var(--bg-elevated) 0%,var(--bg-surface) 100%);border:1px solid var(--border-subtle);border-radius:20px;padding:32px;cursor:pointer;transition:all 200ms var(--ease-out);position:relative;overflow:hidden;animation:fadeUp 400ms var(--ease-out) both';

  card.innerHTML = '<div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.5"></div><div style="display:flex;align-items:center;gap:8px;margin-bottom:16px"><span class="badge badge-live">Latest</span><span class="badge" style="background:var(--accent-red-soft);color:var(--accent-red);border:1px solid rgba(225,6,0,0.2)">' + article.category + '</span></div><h2 style="font-size:clamp(18px,3vw,28px);font-weight:800;color:var(--text-primary);letter-spacing:-0.03em;line-height:1.2;margin-bottom:12px">' + article.title + '</h2><p style="font-size:var(--text-base);color:var(--text-muted);line-height:1.7;margin-bottom:20px">' + article.summary + '</p><div style="display:flex;align-items:center;justify-content:space-between"><div style="font-size:var(--text-xs);color:var(--text-muted)">' + article.time + ' \u00B7 ' + article.readTime + '</div><div style="font-size:var(--text-xs);color:var(--text-muted)">' + (article.source || '') + '</div></div>';

  card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-2px)'; card.style.boxShadow = 'var(--shadow-lg)'; });
  card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = 'none'; });

  return card;
}

function createNewsListItem(article, index) {
  const icons = { 'Live': '\u{1F534}', 'Strategy': '\u{1F9E0}', 'Technical': '\u2699\uFE0F', 'Incident': '\u26A0\uFE0F', 'Analysis': '\u{1F4CA}', 'Race Control': '\u{1F6A9}', 'Safety': '\u{1F6E1}', 'Weather': '\u{1F327}', 'Update': '\u{1F4E2}', 'Driver': '\u{1F464}', 'Circuit': '\u{1F3C1}' };

  const item = document.createElement('div');
  item.style.cssText = 'display:flex;align-items:center;gap:16px;padding:18px 20px;border-bottom:1px solid var(--border-subtle);cursor:pointer;transition:background 120ms;animation:fadeUp 400ms var(--ease-out) ' + (index * 60) + 'ms both';

  item.innerHTML = '<div style="width:48px;height:48px;border-radius:12px;background:var(--bg-elevated);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;border:1px solid var(--border-subtle)">' + (icons[article.category] || '\u{1F4E2}') + '</div><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><span class="badge badge-surface" style="font-size:9px">' + article.category + '</span></div><div style="font-size:var(--text-sm);font-weight:600;color:var(--text-primary);line-height:1.3;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + article.title + '</div><div style="font-size:var(--text-xs);color:var(--text-muted)">' + article.time + ' \u00B7 ' + article.readTime + '</div></div><div style="color:var(--text-muted);font-size:18px;flex-shrink:0">\u203A</div>';

  item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-glass)');
  item.addEventListener('mouseleave', () => item.style.background = 'transparent');
  return item;
}

function createNewsSidebar() {
  const sidebar = document.createElement('div');
  sidebar.style.cssText = 'display:flex;flex-direction:column;gap:20px;position:sticky;top:72px';

  sidebar.innerHTML = '<div class="card"><div class="card-header"><div style="font-size:var(--text-sm);font-weight:700;color:var(--text-primary)">About</div></div><div style="padding:16px 20px"><p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.7">News feed is sourced from FIA Race Control messages via the OpenF1 API. Updates appear as they are published by official race control.</p></div></div><div style="background:linear-gradient(135deg,var(--bg-elevated),var(--bg-surface));border:1px solid var(--border-subtle);border-radius:16px;padding:20px;position:relative;overflow:hidden"><div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--accent-red),transparent);opacity:0.5"></div><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:12px;font-weight:700;color:var(--accent-red);text-transform:uppercase;letter-spacing:0.08em">\u25C7 AI News Brief</span></div><p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.7">The AI Race Engineer can summarize any news article on demand. Ask the Race Engineer for analysis.</p></div>';

  return sidebar;
}
