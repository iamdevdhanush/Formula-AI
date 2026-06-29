export function createSkeleton(type) {
  const el = document.createElement('div');
  el.className = 'skeleton-container anim-fade-up';

  if (type === 'card') {
    el.innerHTML = `
      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:24px">
        <div class="skeleton-line" style="width:40%;height:14px;margin-bottom:16px"></div>
        <div class="skeleton-line" style="width:70%;height:20px;margin-bottom:12px"></div>
        <div class="skeleton-line" style="width:55%;height:14px;margin-bottom:8px"></div>
        <div class="skeleton-line" style="width:30%;height:14px"></div>
      </div>`;
  } else if (type === 'row') {
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border-subtle)">
        <div class="skeleton-circle" style="width:32px;height:32px"></div>
        <div style="flex:1">
          <div class="skeleton-line" style="width:50%;height:14px;margin-bottom:6px"></div>
          <div class="skeleton-line" style="width:30%;height:10px"></div>
        </div>
        <div class="skeleton-line" style="width:40px;height:14px"></div>
      </div>`;
  } else if (type === 'chart') {
    el.innerHTML = `
      <div style="background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:16px;padding:24px">
        <div class="skeleton-line" style="width:35%;height:14px;margin-bottom:20px"></div>
        <div style="height:160px;background:var(--bg-elevated);border-radius:8px;margin-bottom:16px"></div>
        <div class="skeleton-line" style="width:60%;height:12px;margin-bottom:8px"></div>
        <div class="skeleton-line" style="width:45%;height:12px"></div>
      </div>`;
  } else {
    el.innerHTML = '<div style="padding:40px;text-align:center"><div class="spinner" style="margin:0 auto"></div><div style="margin-top:16px;color:var(--text-muted);font-size:var(--text-sm)">Loading...</div></div>';
  }

  return el;
}

export function createErrorState(message, onRetry) {
  const el = document.createElement('div');
  el.className = 'anim-fade-up';
  el.style.cssText = 'padding:60px 40px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px';

  el.innerHTML = `
    <div style="font-size:48px;opacity:0.5">\u26A0</div>
    <div style="font-size:var(--text-base);font-weight:600;color:var(--text-primary)">Unable to load data</div>
    <div style="font-size:var(--text-sm);color:var(--text-muted);max-width:400px;line-height:1.6">${escapeHtml(message || 'Currently unavailable. The data source could not be reached.')}</div>
    <button class="btn btn-secondary btn-sm" id="retry-btn">Try Again</button>
  `;

  if (onRetry) {
    el.querySelector('#retry-btn').addEventListener('click', onRetry);
  }

  return el;
}

export function createEmptyState(message) {
  const el = document.createElement('div');
  el.className = 'anim-fade-up';
  el.style.cssText = 'padding:60px 40px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px';

  el.innerHTML = `
    <div style="font-size:var(--text-base);color:var(--text-muted);max-width:400px;line-height:1.6">${escapeHtml(message)}</div>
  `;

  return el;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
