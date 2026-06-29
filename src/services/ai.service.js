const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';

export async function processQuestion(question) {
  const q = question.toLowerCase();
  const context = await gatherContext(q);
  const apiKey = getAIKey();

  if (apiKey) {
    try {
      return await callLLM(question, context, apiKey);
    } catch (e) {
      return buildFallbackResponse(context, q);
    }
  }

  return buildFallbackResponse(context, q);
}

async function gatherContext(question) {
  const ctx = {};

  if (question.includes('standings') || question.includes('championship') || question.includes('points') || question.includes('leader')) {
    const { getDriverStandings, getConstructorStandings } = await import('./standings.service.js');
    const [ds, cs] = await Promise.all([getDriverStandings(), getConstructorStandings()]);
    ctx.standings = ds.slice(0, 10);
    ctx.constructorStandings = cs.slice(0, 5);
  }

  if (question.includes('weather') || question.includes('rain') || question.includes('temperature') || question.includes('track')) {
    const { getCurrentSession } = await import('./calendar.service.js');
    const { getSessionWeather } = await import('./weather.service.js');
    const session = await getCurrentSession();
    if (session) {
      ctx.weather = await getSessionWeather(session.session_key);
    }
  }

  if (question.includes('driver') || question.includes('driver') || question.includes('verstappen') || question.includes('hamilton') || question.includes('leclerc') || question.includes('norris')) {
    const { getDrivers } = await import('./drivers.service.js');
    const drivers = await getDrivers();
    ctx.drivers = drivers;
  }

  if (question.includes('race') || question.includes('lap') || question.includes('position') || question.includes('leader')) {
    const { getCurrentSession } = await import('./calendar.service.js');
    const { getLivePositions } = await import('./race.service.js');
    const session = await getCurrentSession();
    if (session) {
      ctx.currentSession = session;
      ctx.livePositions = await getLivePositions(session.session_key);
    }
  }

  if (question.includes('tire') || question.includes('tyre') || question.includes('strategy') || question.includes('pit')) {
    const { getCurrentSession } = await import('./calendar.service.js');
    const { getPitData } = await import('./telemetry.service.js');
    const session = await getCurrentSession();
    if (session) {
      ctx.pitData = await getPitData(session.session_key);
    }
  }

  if (question.includes('calendar') || question.includes('next race') || question.includes('schedule')) {
    const { getNextRace, getSessions } = await import('./calendar.service.js');
    const [next, sessions] = await Promise.all([getNextRace(), getSessions()]);
    ctx.nextRace = next;
    ctx.calendarCount = sessions.length;
  }

  return ctx;
}

function buildFallbackResponse(context, question) {
  let response = '## Analysis\n\nBased on available data:\n\n';

  if (context.standings && context.standings.length > 0) {
    response += '### Current Driver Standings\n\n';
    response += '| Pos | Driver | Team | Points |\n';
    response += '|-----|--------|------|--------|\n';
    context.standings.slice(0, 5).forEach(s => {
      response += '| ' + s.pos + ' | ' + s.driver + ' | ' + s.team + ' | ' + s.points + ' |\n';
    });
    response += '\n';
  }

  if (context.constructorStandings && context.constructorStandings.length > 0) {
    response += '### Constructor Standings\n\n';
    context.constructorStandings.slice(0, 3).forEach(s => {
      response += '- **' + s.team + '**: ' + s.points + ' pts\n';
    });
    response += '\n';
  }

  if (context.weather) {
    const w = context.weather;
    response += '### Current Weather\n\n';
    response += '- Air Temperature: ' + w.temp + '\u00B0C\n';
    response += '- Track Temperature: ' + w.trackTemp + '\u00B0C\n';
    response += '- Humidity: ' + w.humidity + '%\n';
    response += '- Wind: ' + w.wind + '\n';
    if (w.rain > 0) response += '- Rainfall: ' + w.rain + 'mm\n';
    response += '\n';
  }

  if (context.livePositions && context.livePositions.length > 0) {
    response += '### Current Positions\n\n';
    context.livePositions.slice(0, 8).forEach(p => {
      response += '- P' + p.pos + ': ' + p.driver + ' (' + p.gap + ')\n';
    });
    response += '\n';
  }

  if (context.drivers && context.drivers.length > 0) {
    const matched = context.drivers.filter(d =>
      question.toLowerCase().includes(d.firstName.toLowerCase()) ||
      question.toLowerCase().includes(d.lastName.toLowerCase())
    );
    if (matched.length > 0) {
      response += '### Driver Information\n\n';
      matched.slice(0, 2).forEach(d => {
        response += '**' + d.name + '** (' + d.team + '): ' + d.points + ' pts, Position ' + d.position + '\n';
      });
      response += '\n';
    }
  }

  if (context.nextRace) {
    response += '### Next Race\n\n';
    response += '**' + context.nextRace.name + '** on ' + new Date(context.nextRace.date).toLocaleDateString() + '\n';
    response += '\n';
  }

  if (context.currentSession) {
    response += '### Session Status\n\n';
    response += context.currentSession.name + ' is currently active.\n';
  }

  if (!context.standings && !context.weather && !context.livePositions && !context.drivers && !context.nextRace && !context.currentSession) {
    response += 'No live data is currently available for your query. Please try asking about driver standings, weather, or race positions.\n';
  }

  return response;
}

async function callLLM(question, context, apiKey) {
  const systemPrompt = 'You are a Formula 1 race engineer AI. You have access to verified real-time data provided in the context below. '
    + 'ONLY answer based on the data provided. If the data does not contain the answer, say "Currently unavailable" instead of making up information. '
    + 'Be concise, technical, and precise. Use markdown formatting for clarity.';

  const contextStr = JSON.stringify(context, null, 2);

  const body = {
    model: 'google/gemini-2.0-flash-001',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Context data:\n' + contextStr + '\n\nQuestion: ' + question },
    ],
    max_tokens: 500,
    temperature: 0.3,
  };

  const res = await fetch(OPENROUTER_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('LLM API error: ' + res.status);

  const json = await res.json();
  return json.choices?.[0]?.message?.content || 'Currently unavailable.';
}

function getAIKey() {
  try {
    return localStorage.getItem('formulaai_ai_key') || '';
  } catch {
    return '';
  }
}

export function setAIKey(key) {
  try {
    if (key) localStorage.setItem('formulaai_ai_key', key);
    else localStorage.removeItem('formulaai_ai_key');
  } catch {}
}
