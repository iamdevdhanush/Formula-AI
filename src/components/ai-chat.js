import { processQuestion, setAIKey } from '../services/ai.service.js';

const REASONING_STEPS = [
  { label: 'Analyzing query', delay: 400 },
  { label: 'Fetching live data', delay: 900 },
  { label: 'Processing context', delay: 1400 },
  { label: 'Generating response', delay: 1900 },
];

export function createAIChatPage(router, signal) {
  const page = document.createElement('div');
  page.style.cssText = 'display:flex;height:100%;overflow:hidden;background:var(--bg-void)';
  page.className = 'page-enter';

  const leftPanel = document.createElement('div');
  leftPanel.id = 'chat-left-panel';
  leftPanel.style.cssText = 'width:280px;flex-shrink:0;border-right:1px solid var(--border-subtle);background:var(--bg-primary);display:flex;flex-direction:column;overflow:hidden';

  leftPanel.innerHTML = '<div style="padding:20px;border-bottom:1px solid var(--border-subtle)"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px"><div style="display:flex;align-items:center;gap:8px"><span style="font-size:16px">\u25C7</span><span style="font-size:var(--text-sm);font-weight:var(--weight-bold);color:var(--text-primary)">Race Engineer</span><span style="font-size:9px;color:var(--accent-cyan);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border:1px solid var(--border-cyan);padding:1px 6px;border-radius:4px">AI</span></div></div><div style="position:relative"><input type="text" class="input" placeholder="Set API Key..." id="ai-key-input" style="font-size:var(--text-xs);padding:8px 12px;width:100%"/></div><p style="font-size:9px;color:var(--text-muted);margin-top:8px">Enter an OpenRouter API key for AI-generated responses. Without a key, answers use live data templates.</p></div><div style="padding:16px;flex:1;overflow-y:auto"><div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.08em">About</div><p style="font-size:var(--text-xs);color:var(--text-secondary);line-height:1.6">Ask any question about driver standings, race results, weather, or championship data. The AI fetches real data from OpenF1 API to answer.</p></div>';

  const rightPanel = document.createElement('div');
  rightPanel.style.cssText = 'flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;position:relative';

  const chatTopBar = document.createElement('div');
  chatTopBar.style.cssText = 'height:56px;border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;padding:0 24px;flex-shrink:0;background:rgba(13,13,16,0.85);backdrop-filter:blur(20px)';
  chatTopBar.innerHTML = '<div style="display:flex;align-items:center;gap:12px"><div style="width:8px;height:8px;border-radius:50%;background:var(--accent-cyan);box-shadow:0 0 6px var(--accent-cyan)"></div><div><div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary)">Race Engineer AI</div><div style="font-size:var(--text-xs);color:var(--text-muted)">Powered by real data</div></div></div>';
  rightPanel.appendChild(chatTopBar);

  const messagesArea = document.createElement('div');
  messagesArea.id = 'chat-messages';
  messagesArea.style.cssText = 'flex:1;overflow-y:auto;padding:32px;display:flex;flex-direction:column;gap:32px;scroll-behavior:smooth';

  const welcomeMsg = createWelcomeMessage();
  messagesArea.appendChild(welcomeMsg);

  rightPanel.appendChild(messagesArea);
  const inputArea = createChatInput(messagesArea);
  rightPanel.appendChild(inputArea);

  page.appendChild(leftPanel);
  page.appendChild(rightPanel);

  function handleResize() {
    if (window.innerWidth < 900) leftPanel.style.display = 'none';
    else leftPanel.style.display = 'flex';
  }
  handleResize();
  window.addEventListener('resize', handleResize, { signal });

  const keyInput = document.getElementById('ai-key-input');
  if (keyInput) {
    const saved = localStorage.getItem('formulaai_ai_key') || '';
    if (saved) keyInput.value = saved;
    keyInput.addEventListener('change', () => {
      setAIKey(keyInput.value.trim());
    });
  }

  return page;
}

function createWelcomeMessage() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = '<div style="max-width:100%"><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px"><div style="width:28px;height:28px;border-radius:8px;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:var(--shadow-red)">F</div><div><div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary)">Race Engineer AI</div></div></div><div class="ai-response-content" style="color:var(--text-secondary);line-height:var(--leading-relaxed);font-size:var(--text-base)"><p>Welcome to the Race Engineer. I can answer questions using real-time data from OpenF1 API.</p><br><p><strong>Try asking:</strong></p><br><p>\u2022 Who is leading the driver standings?</p><p>\u2022 What is the weather at the current session?</p><p>\u2022 Show me constructor standings</p><p>\u2022 Tell me about the next race</p><br><p>For AI-powered responses, enter your <strong>OpenRouter API key</strong> in the left panel.</p></div></div>';
  return wrapper;
}

function createMessage(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = 'anim-fade-up';

  if (msg.role === 'user') {
    wrapper.style.cssText = 'display:flex;justify-content:flex-end;';
    wrapper.innerHTML = '<div style="max-width:70%;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:16px 16px 4px 16px;padding:14px 18px"><div style="font-size:var(--text-base);color:var(--text-primary);line-height:var(--leading-relaxed)">' + escapeHtml(msg.content) + '</div></div>';
  } else {
    wrapper.innerHTML = '<div style="max-width:100%"><div style="display:flex;align-items:center;gap:10px;margin-bottom:16px"><div style="width:28px;height:28px;border-radius:8px;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:var(--shadow-red)">F</div><div><div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary)">Race Engineer AI</div></div></div><div class="ai-response-content" style="color:var(--text-secondary);line-height:var(--leading-relaxed);font-size:var(--text-base)">' + renderMarkdown(msg.content) + '</div></div>';
  }

  return wrapper;
}

function createChatInput(messagesArea) {
  const container = document.createElement('div');
  container.style.cssText = 'padding:20px 32px;border-top:1px solid var(--border-subtle);flex-shrink:0;background:rgba(13,13,16,0.85);backdrop-filter:blur(20px)';

  const inputRow = document.createElement('div');
  inputRow.style.cssText = 'display:flex;align-items:flex-end;gap:12px;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:16px;padding:8px 8px 8px 16px;transition:border-color 200ms,box-shadow 200ms';

  const inputEl = document.createElement('textarea');
  inputEl.id = 'chat-input';
  inputEl.placeholder = 'Ask your Race Engineer anything...';
  inputEl.rows = 1;
  inputEl.style.cssText = 'flex:1;background:transparent;border:none;outline:none;color:var(--text-primary);font-family:var(--font-primary);font-size:var(--text-base);line-height:1.5;resize:none;max-height:160px;overflow-y:auto;padding:8px 0;caret-color:var(--accent-red)';
  inputEl.addEventListener('input', () => { inputEl.style.height = 'auto'; inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + 'px'; });
  inputEl.addEventListener('focus', () => { inputRow.style.borderColor = 'var(--border-strong)'; inputRow.style.boxShadow = '0 0 0 1px var(--border-default)'; });
  inputEl.addEventListener('blur', () => { inputRow.style.borderColor = 'var(--border-default)'; inputRow.style.boxShadow = 'none'; });

  const sendBtn = document.createElement('button');
  sendBtn.innerHTML = '\u2191';
  sendBtn.style.cssText = 'width:36px;height:36px;border-radius:10px;background:var(--accent-red);color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 150ms var(--ease-spring);flex-shrink:0;border:none';
  sendBtn.addEventListener('mouseenter', () => { sendBtn.style.transform = 'scale(1.08)'; sendBtn.style.boxShadow = 'var(--shadow-red)'; });
  sendBtn.addEventListener('mouseleave', () => { sendBtn.style.transform = 'scale(1)'; sendBtn.style.boxShadow = 'none'; });

  const handleSend = async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text };
    messagesArea.appendChild(createMessage(userMsg));
    inputEl.value = '';
    inputEl.style.height = 'auto';
    messagesArea.scrollTop = messagesArea.scrollHeight;

    const reasoningEl = createReasoningBlock();
    messagesArea.appendChild(reasoningEl);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    await animateReasoning(reasoningEl);

    reasoningEl.remove();
    try {
      const response = await processQuestion(text);
      const aiMsg = { role: 'assistant', content: response };
      messagesArea.appendChild(createMessage(aiMsg));
    } catch (e) {
      const fallback = '## Currently Unavailable\n\nThe AI service encountered an error. Please try again.\n\n**Error:** ' + e.message;
      messagesArea.appendChild(createMessage({ role: 'assistant', content: fallback }));
    }
    messagesArea.scrollTop = messagesArea.scrollHeight;
  };

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });

  inputRow.appendChild(inputEl);
  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;align-items:center;gap:6px;flex-shrink:0';
  actions.appendChild(sendBtn);
  inputRow.appendChild(actions);
  container.appendChild(inputRow);

  const footer = document.createElement('div');
  footer.style.cssText = 'text-align:center;margin-top:12px';
  footer.innerHTML = '<span style="font-size:10px;color:var(--text-muted)">Answers are generated from live OpenF1 data. For AI-powered responses, provide an OpenRouter API key in the left panel.</span>';
  container.appendChild(footer);

  return container;
}

function createReasoningBlock() {
  const wrapper = document.createElement('div');
  wrapper.className = 'anim-fade-up';
  wrapper.innerHTML = '<div style="display:flex;align-items:flex-start;gap:12px"><div style="width:28px;height:28px;border-radius:8px;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;animation:glowPulse 1.2s ease infinite;box-shadow:var(--shadow-red)">F</div><div style="flex:1"><div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary);margin-bottom:12px">Race Engineer AI</div><div class="reasoning-steps" id="reasoning-steps-container">' + REASONING_STEPS.map((step, i) => '<div class="reasoning-step" id="step-' + i + '" style="animation-delay:' + (i * 60) + 'ms"><div class="reasoning-step-icon" id="step-icon-' + i + '">\u00B7</div><span>' + step.label + '</span></div>').join('') + '</div></div></div>';
  return wrapper;
}

async function animateReasoning(el) {
  for (let i = 0; i < REASONING_STEPS.length; i++) {
    await new Promise(r => setTimeout(r, i === 0 ? 200 : 400));
    const stepEl = el.querySelector('#step-' + i);
    const iconEl = el.querySelector('#step-icon-' + i);
    if (!stepEl) break;
    if (i > 0) {
      const prevStep = el.querySelector('#step-' + (i-1));
      const prevIcon = el.querySelector('#step-icon-' + (i-1));
      if (prevStep) { prevStep.classList.remove('active'); prevStep.classList.add('done'); }
      if (prevIcon) prevIcon.textContent = '\u2713';
    }
    stepEl.classList.add('active');
    if (iconEl) iconEl.textContent = '\u25CF';
  }
  await new Promise(r => setTimeout(r, 300));
  const last = REASONING_STEPS.length - 1;
  const lastStep = el.querySelector('#step-' + last);
  const lastIcon = el.querySelector('#step-icon-' + last);
  if (lastStep) { lastStep.classList.remove('active'); lastStep.classList.add('done'); }
  if (lastIcon) lastIcon.textContent = '\u2713';
  await new Promise(r => setTimeout(r, 300));
}

function renderMarkdown(content) {
  return content
    .replace(/```([\s\S]*?)```/g, '<pre style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:8px;padding:16px;overflow-x:auto;margin:16px 0"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-primary)">$1</code></pre>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary);font-weight:600">$1</strong>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size:var(--text-md);font-weight:700;color:var(--text-primary);margin:24px 0 12px;letter-spacing:-0.02em">$1</h3>')
    .replace(/^### (.*$)/gim, '<h4 style="font-size:var(--text-base);font-weight:600;color:var(--text-primary);margin:16px 0 8px;letter-spacing:-0.01em">$1</h4>')
    .replace(/^> (.*$)/gim, '<div style="border-left:2px solid var(--accent-cyan);padding:10px 16px;background:var(--accent-cyan-soft);border-radius:0 8px 8px 0;margin:12px 0;font-size:var(--text-sm);color:var(--text-primary)">$1</div>')
    .replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
      const headers = header.split('|').filter(h => h.trim()).map(h => '<th style="padding:10px 14px;text-align:left;font-size:var(--text-xs);font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border-default)">' + h.trim() + '</th>').join('');
      const rowsHtml = rows.trim().split('\n').map(row => {
        const cells = row.split('|').filter(c => c.trim()).map((c, i) => '<td style="padding:10px 14px;font-size:var(--text-sm);color:var(--text-secondary);border-bottom:1px solid var(--border-subtle);' + (i === 0 ? 'font-weight:500;color:var(--text-primary)' : '') + '">' + c.trim() + '</td>').join('');
        return '<tr>' + cells + '</tr>';
      }).join('');
      return '<div style="overflow-x:auto;margin:16px 0"><table style="width:100%;border-collapse:collapse;background:var(--bg-elevated);border-radius:10px;overflow:hidden;border:1px solid var(--border-subtle)"><thead><tr>' + headers + '</tr></thead><tbody>' + rowsHtml + '</tbody></table></div>';
    })
    .replace(/^[•·]\s+(.*$)/gim, '<div style="display:flex;gap:8px;margin:4px 0;padding-left:4px"><span style="color:var(--accent-red);flex-shrink:0;margin-top:2px">\u25B8</span><span>$1</span></div>')
    .replace(/^\d+\.\s+(.*$)/gim, '<div style="display:flex;gap:10px;margin:6px 0;align-items:flex-start"><span style="color:var(--accent-cyan);font-family:var(--font-mono);font-size:var(--text-xs);font-weight:600;flex-shrink:0;min-width:16px">\u25CF</span><span>$1</span></div>')
    .replace(/^---$/gim, '<hr style="border:none;border-top:1px solid var(--border-subtle);margin:20px 0">')
    .replace(/\n\n/g, '<br><br>');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
