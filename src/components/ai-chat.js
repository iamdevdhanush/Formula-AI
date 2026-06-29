/* ============================================
   FORMULAAI — AI CHAT COMPONENT
   The Race Engineer AI — the heart of FormulaAI
   ============================================ */

import { suggestedQuestions, aiMessages, aiConversations } from '../data/mock-data.js';
import { createDriverCard } from './cards.js';
import { drivers } from '../data/mock-data.js';

const REASONING_STEPS = [
  { label: 'Analyzing telemetry data', delay: 400 },
  { label: 'Checking race strategy models', delay: 900 },
  { label: 'Comparing historical race data', delay: 1400 },
  { label: 'Reading regulations database', delay: 1900 },
  { label: 'Generating recommendations', delay: 2400 },
];

export function createAIChatPage() {
  const page = document.createElement('div');
  page.style.cssText = `
    display: flex;
    height: 100dvh;
    overflow: hidden;
    background: var(--bg-void);
  `;
  page.className = 'page-enter';

  // ── LEFT PANEL: Conversation History ──
  const leftPanel = document.createElement('div');
  leftPanel.id = 'chat-left-panel';
  leftPanel.style.cssText = `
    width: 280px;
    flex-shrink: 0;
    border-right: 1px solid var(--border-subtle);
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;

  leftPanel.innerHTML = `
    <div style="padding: 20px; border-bottom: 1px solid var(--border-subtle);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:16px">◈</span>
          <span style="font-size:var(--text-sm);font-weight:var(--weight-bold);color:var(--text-primary)">Race Engineer</span>
          <span style="font-size:9px;color:var(--accent-cyan);font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border:1px solid var(--border-cyan);padding:1px 6px;border-radius:4px">AI</span>
        </div>
        <button id="new-chat-btn" class="btn btn-sm btn-secondary">+ New</button>
      </div>
      <div style="position:relative">
        <input type="text" class="input" placeholder="Search conversations..." 
          style="font-size:var(--text-xs);padding:8px 12px;padding-left:32px"/>
        <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:14px">🔍</span>
      </div>
    </div>
    <div style="padding:12px;flex:1;overflow-y:auto" id="conversation-list"></div>
  `;

  // Populate conversations
  const convList = leftPanel.querySelector('#conversation-list');
  aiConversations.forEach((conv, i) => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 12px;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background 150ms;
      margin-bottom: 4px;
      border: 1px solid ${conv.active ? 'var(--border-default)' : 'transparent'};
      background: ${conv.active ? 'var(--bg-elevated)' : 'transparent'};
    `;
    item.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <div style="font-size:var(--text-sm);font-weight:var(--weight-medium);color:${conv.active ? 'var(--text-primary)' : 'var(--text-secondary)'};line-height:1.3;flex:1">${conv.title}</div>
        <div style="font-size:10px;color:var(--text-muted);white-space:nowrap;flex-shrink:0">${conv.time}</div>
      </div>
      <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${conv.preview}</div>
    `;
    item.addEventListener('mouseenter', () => {
      if (!conv.active) item.style.background = 'var(--bg-glass)';
    });
    item.addEventListener('mouseleave', () => {
      if (!conv.active) item.style.background = 'transparent';
    });
    convList.appendChild(item);
  });

  // ── RIGHT PANEL: Chat ──
  const rightPanel = document.createElement('div');
  rightPanel.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    position: relative;
  `;

  // Top bar
  const chatTopBar = document.createElement('div');
  chatTopBar.style.cssText = `
    height: 56px;
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
    background: rgba(13,13,16,0.85);
    backdrop-filter: blur(20px);
  `;
  chatTopBar.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:8px;height:8px;border-radius:50%;background:var(--accent-cyan);box-shadow:0 0 6px var(--accent-cyan)"></div>
      <div>
        <div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary)">Silverstone Race Strategy Analysis</div>
        <div style="font-size:var(--text-xs);color:var(--text-muted)">Race Engineer AI · Round 12</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <button class="icon-btn" data-tooltip="Share">↗</button>
      <button class="icon-btn" data-tooltip="Save">🔖</button>
      <button class="icon-btn" data-tooltip="Settings">⚙</button>
    </div>
  `;
  rightPanel.appendChild(chatTopBar);

  // Chat messages area
  const messagesArea = document.createElement('div');
  messagesArea.id = 'chat-messages';
  messagesArea.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    scroll-behavior: smooth;
  `;

  // Render existing messages
  aiMessages.forEach(msg => {
    messagesArea.appendChild(createMessage(msg));
  });

  rightPanel.appendChild(messagesArea);

  // Input area
  const inputArea = createChatInput(messagesArea);
  rightPanel.appendChild(inputArea);

  page.appendChild(leftPanel);
  page.appendChild(rightPanel);

  // Mobile: hide left panel
  function handleResize() {
    if (window.innerWidth < 900) {
      leftPanel.style.display = 'none';
    } else {
      leftPanel.style.display = 'flex';
    }
  }
  handleResize();
  window.addEventListener('resize', handleResize);

  return page;
}

function createMessage(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = 'anim-fade-up';

  if (msg.role === 'user') {
    wrapper.style.cssText = 'display:flex;justify-content:flex-end;';
    wrapper.innerHTML = `
      <div style="max-width:70%;background:var(--bg-elevated);border:1px solid var(--border-default);border-radius:16px 16px 4px 16px;padding:14px 18px;">
        <div style="font-size:var(--text-base);color:var(--text-primary);line-height:var(--leading-relaxed)">${msg.content}</div>
      </div>
    `;
  } else {
    wrapper.innerHTML = `
      <div style="max-width:100%">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <div style="width:28px;height:28px;border-radius:8px;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:var(--shadow-red)">F</div>
          <div>
            <div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary)">Race Engineer AI</div>
            ${msg.timestamp ? `<div style="font-size:var(--text-xs);color:var(--text-muted)">${msg.timestamp}</div>` : ''}
          </div>
        </div>
        <div class="ai-response-content" style="color:var(--text-secondary);line-height:var(--leading-relaxed);font-size:var(--text-base)">
          ${renderMarkdown(msg.content)}
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border-subtle)">
          <button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);gap:4px">👍 Helpful</button>
          <button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);gap:4px">👎 Not helpful</button>
          <button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);gap:4px">↗ Share</button>
          <button class="btn btn-ghost btn-sm" style="font-size:var(--text-xs);gap:4px">🔖 Save</button>
        </div>
      </div>
    `;
  }

  return wrapper;
}

function createChatInput(messagesArea) {
  const container = document.createElement('div');
  container.style.cssText = `
    padding: 20px 32px;
    border-top: 1px solid var(--border-subtle);
    flex-shrink: 0;
    background: rgba(13,13,16,0.85);
    backdrop-filter: blur(20px);
  `;

  // Suggested questions (on fresh chat, shown above input)
  const suggestions = document.createElement('div');
  suggestions.id = 'chat-suggestions';
  suggestions.style.cssText = `
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  `;

  const quickSuggestions = suggestedQuestions.slice(0, 4);
  quickSuggestions.forEach(q => {
    const chip = document.createElement('button');
    chip.style.cssText = `
      padding: 6px 14px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 150ms;
      white-space: nowrap;
    `;
    chip.textContent = q;
    chip.addEventListener('mouseenter', () => {
      chip.style.borderColor = 'var(--border-default)';
      chip.style.color = 'var(--text-primary)';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.borderColor = 'var(--border-subtle)';
      chip.style.color = 'var(--text-secondary)';
    });
    chip.addEventListener('click', () => {
      inputEl.value = q;
      inputEl.focus();
    });
    suggestions.appendChild(chip);
  });

  container.appendChild(suggestions);

  // Input box
  const inputRow = document.createElement('div');
  inputRow.style.cssText = `
    display: flex;
    align-items: flex-end;
    gap: 12px;
    background: var(--bg-elevated);
    border: 1px solid var(--border-default);
    border-radius: 16px;
    padding: 8px 8px 8px 16px;
    transition: border-color 200ms, box-shadow 200ms;
  `;

  const inputEl = document.createElement('textarea');
  inputEl.id = 'chat-input';
  inputEl.placeholder = 'Ask your Race Engineer anything about the race...';
  inputEl.rows = 1;
  inputEl.style.cssText = `
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-primary);
    font-family: var(--font-primary);
    font-size: var(--text-base);
    line-height: 1.5;
    resize: none;
    max-height: 160px;
    overflow-y: auto;
    padding: 8px 0;
    caret-color: var(--accent-red);
  `;
  inputEl.setAttribute('aria-label', 'Chat input');

  // Auto-resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = Math.min(inputEl.scrollHeight, 160) + 'px';
  });

  // Focus effects
  inputEl.addEventListener('focus', () => {
    inputRow.style.borderColor = 'var(--border-strong)';
    inputRow.style.boxShadow = '0 0 0 1px var(--border-default)';
  });
  inputEl.addEventListener('blur', () => {
    inputRow.style.borderColor = 'var(--border-default)';
    inputRow.style.boxShadow = 'none';
  });

  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;align-items:center;gap:6px;flex-shrink:0';
  actions.innerHTML = `
    <button class="icon-btn" data-tooltip="Attach" style="color:var(--text-muted)" id="attach-btn">📎</button>
    <button class="icon-btn" data-tooltip="Voice" style="color:var(--text-muted)" id="voice-btn">🎤</button>
  `;

  const sendBtn = document.createElement('button');
  sendBtn.id = 'send-btn';
  sendBtn.style.cssText = `
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--accent-red);
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 150ms var(--ease-spring);
    flex-shrink: 0;
    border: none;
  `;
  sendBtn.innerHTML = '↑';
  sendBtn.setAttribute('aria-label', 'Send message');

  sendBtn.addEventListener('mouseenter', () => {
    sendBtn.style.transform = 'scale(1.08)';
    sendBtn.style.boxShadow = 'var(--shadow-red)';
  });
  sendBtn.addEventListener('mouseleave', () => {
    sendBtn.style.transform = 'scale(1)';
    sendBtn.style.boxShadow = 'none';
  });

  const handleSend = async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    // Hide suggestions
    suggestions.style.display = 'none';

    // Add user message
    const userMsg = { role: 'user', content: text };
    messagesArea.appendChild(createMessage(userMsg));
    inputEl.value = '';
    inputEl.style.height = 'auto';
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // Show reasoning animation
    const reasoningEl = createReasoningBlock();
    messagesArea.appendChild(reasoningEl);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    // Animate steps
    await animateReasoning(reasoningEl);

    // Replace with response
    reasoningEl.remove();
    const response = generateAIResponse(text);
    const aiMsg = { role: 'assistant', content: response };
    messagesArea.appendChild(createMessage(aiMsg));
    messagesArea.scrollTop = messagesArea.scrollHeight;
  };

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  actions.appendChild(sendBtn);
  inputRow.appendChild(inputEl);
  inputRow.appendChild(actions);
  container.appendChild(inputRow);

  const footer = document.createElement('div');
  footer.style.cssText = 'text-align:center;margin-top:12px';
  footer.innerHTML = `<span style="font-size:10px;color:var(--text-muted)">FormulaAI uses live race data and AI reasoning. Always verify critical decisions with official sources.</span>`;
  container.appendChild(footer);

  return container;
}

function createReasoningBlock() {
  const wrapper = document.createElement('div');
  wrapper.className = 'anim-fade-up';
  wrapper.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px">
      <div style="width:28px;height:28px;border-radius:8px;background:var(--accent-red);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;animation:glowPulse 1.2s ease infinite;box-shadow:var(--shadow-red)">F</div>
      <div style="flex:1">
        <div style="font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-primary);margin-bottom:12px">Race Engineer AI</div>
        <div class="reasoning-steps" id="reasoning-steps-container">
          ${REASONING_STEPS.map((step, i) => `
            <div class="reasoning-step" id="step-${i}" style="animation-delay:${i * 60}ms">
              <div class="reasoning-step-icon" id="step-icon-${i}">·</div>
              <span>${step.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  return wrapper;
}

async function animateReasoning(el) {
  for (let i = 0; i < REASONING_STEPS.length; i++) {
    await new Promise(r => setTimeout(r, i === 0 ? 200 : 500));
    const stepEl = el.querySelector(`#step-${i}`);
    const iconEl = el.querySelector(`#step-icon-${i}`);
    if (!stepEl) break;

    // Mark previous as done
    if (i > 0) {
      const prevStep = el.querySelector(`#step-${i-1}`);
      const prevIcon = el.querySelector(`#step-icon-${i-1}`);
      if (prevStep) {
        prevStep.classList.remove('active');
        prevStep.classList.add('done');
      }
      if (prevIcon) prevIcon.textContent = '✓';
    }

    stepEl.classList.add('active');
    if (iconEl) iconEl.textContent = '●';
  }

  // Mark last as done
  await new Promise(r => setTimeout(r, 500));
  const last = REASONING_STEPS.length - 1;
  const lastStep = el.querySelector(`#step-${last}`);
  const lastIcon = el.querySelector(`#step-icon-${last}`);
  if (lastStep) {
    lastStep.classList.remove('active');
    lastStep.classList.add('done');
  }
  if (lastIcon) lastIcon.textContent = '✓';

  await new Promise(r => setTimeout(r, 300));
}

function generateAIResponse(question) {
  const q = question.toLowerCase();
  
  if (q.includes('tire') || q.includes('tyre') || q.includes('strategy')) {
    return `## Tire Strategy Breakdown

Based on current track data, here's the strategic picture:

**Current leader (Verstappen)** is on **18-lap old Mediums** — approaching the degradation cliff typically seen around lap 24-26 on this compound at Silverstone.

### One-Stop vs Two-Stop

| Strategy | Total Pit Loss | Projected Finish |
|----------|---------------|-----------------|
| 1-stop (M→H) | 22s | P1 — if manages tyres |
| 2-stop (M→S) | 44s | P1 — if fast final stint |
| 2-stop (M→H→S) | 44s | P2 or P1 on pace |

### Key Decision Point

The next **6 laps** are critical. If Norris closes to within **1.8 seconds** before Verstappen's next pit, the undercut window opens. Red Bull will be watching Russell's soft-tyre pace as the main threat.

> **My prediction:** Verstappen pits within 4 laps onto Hard compound, extending to a comfortable 1-stop finish. 68% confidence.`;
  }
  
  if (q.includes('weather') || q.includes('rain')) {
    return `## Weather Analysis — Silverstone

Current conditions are stable but **a weather front is approaching** from the west.

🌡️ **Air:** 19°C → dropping to 16°C by lap 44  
🏎️ **Track:** 31°C → cooling rapidly after lap 40  
💧 **Rain probability:** 40% between laps 42-48  

### Impact on Strategy

If rain arrives before lap 44:
- **Intermediate tyres** become necessary
- Teams on fresh slicks face a **12-15 second deficit** to a dry-weather pace
- **Russell on softs** would be worst positioned — losing 3+ positions

### Teams Already Preparing
Red Bull and Ferrari are reportedly warming intermediate tyres in the garages as a precaution.

**Bottom line:** This race could be decided by the weather rather than the current tire strategy.`;
  }
  
  if (q.includes('drs') || q.includes('overtake')) {
    return `## DRS & Overtaking at Silverstone

Silverstone has **2 DRS zones** this weekend:

### Zone 1 — Wellington Straight
- **Length:** 720m
- **Typical speed gain:** +12-15 km/h
- **Detection:** Exit of Abbey

### Zone 2 — Hangar Straight  
- **Length:** 660m
- **Typical speed gain:** +10-13 km/h  
- **Detection:** Exit of Brooklands

### Current DRS Activity
Verstappen currently has DRS active on Norris but the gap (3.4s) is too large for DRS to matter.

The **real battle** will be Russell (soft tyres) vs the midfield when he exits his final pit stop. Softs + DRS on Hangar Straight = almost guaranteed overtake within 2-3 laps.`;
  }
  
  return `## Analysis

Based on the current race data and telemetry from Silverstone, here's what I'm seeing:

The race is entering its **critical phase** at lap ${Math.floor(Math.random() * 10) + 30}. The key factors right now are:

1. **Tyre management** — the medium compound is performing better than expected in cooler conditions
2. **Pit window strategy** — teams are watching each other carefully before committing
3. **Weather** — the approaching cloud front adds uncertainty to every strategic decision

The most likely outcome based on current pace data is that **Verstappen holds on** for the win, but Norris's pace on fresher rubber gives him a genuine chance if Red Bull miscalculates the final pit stop timing.

Is there a specific aspect of the race you'd like me to analyze in more detail?`;
}

function renderMarkdown(content) {
  return content
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:8px;padding:16px;overflow-x:auto;margin:16px 0;"><code style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-primary)">$1</code></pre>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--text-primary);font-weight:600">$1</strong>')
    // Headers
    .replace(/^## (.*$)/gim, '<h3 style="font-size:var(--text-md);font-weight:700;color:var(--text-primary);margin:24px 0 12px;letter-spacing:-0.02em">$1</h3>')
    .replace(/^### (.*$)/gim, '<h4 style="font-size:var(--text-base);font-weight:600;color:var(--text-primary);margin:16px 0 8px;letter-spacing:-0.01em">$1</h4>')
    // Blockquote
    .replace(/^> (.*$)/gim, '<div style="border-left:2px solid var(--accent-cyan);padding:10px 16px;background:var(--accent-cyan-soft);border-radius:0 8px 8px 0;margin:12px 0;font-size:var(--text-sm);color:var(--text-primary)">$1</div>')
    // Tables
    .replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)*)/g, (match, header, rows) => {
      const headers = header.split('|').filter(h => h.trim()).map(h => `<th style="padding:10px 14px;text-align:left;font-size:var(--text-xs);font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid var(--border-default)">${h.trim()}</th>`).join('');
      const rowsHtml = rows.trim().split('\n').map(row => {
        const cells = row.split('|').filter(c => c.trim()).map((c, i) => `<td style="padding:10px 14px;font-size:var(--text-sm);color:var(--text-secondary);border-bottom:1px solid var(--border-subtle);${i === 0 ? 'font-weight:500;color:var(--text-primary)' : ''}">${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div style="overflow-x:auto;margin:16px 0"><table style="width:100%;border-collapse:collapse;background:var(--bg-elevated);border-radius:10px;overflow:hidden;border:1px solid var(--border-subtle)"><thead><tr>${headers}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
    })
    // List items
    .replace(/^[•·]\s+(.*$)/gim, '<div style="display:flex;gap:8px;margin:4px 0;padding-left:4px"><span style="color:var(--accent-red);flex-shrink:0;margin-top:2px">▸</span><span>$1</span></div>')
    .replace(/^\d+\.\s+(.*$)/gim, '<div style="display:flex;gap:10px;margin:6px 0;align-items:flex-start"><span style="color:var(--accent-cyan);font-family:var(--font-mono);font-size:var(--text-xs);font-weight:600;flex-shrink:0;min-width:16px">●</span><span>$1</span></div>')
    // Italic (for emoji prefix lines)
    .replace(/🌡️|🏎️|💧|⚡|🔴/g, '<span style="font-size:16px">$&</span>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr style="border:none;border-top:1px solid var(--border-subtle);margin:20px 0">')
    // Paragraphs (double newline)
    .replace(/\n\n/g, '<br><br>');
}
