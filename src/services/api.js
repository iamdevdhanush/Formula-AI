const OPENF1_BASE = 'https://api.openf1.dev/v1';

export async function fetchOpenF1(endpoint, params = {}) {
  const url = new URL(`${OPENF1_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`OpenF1 API error: ${res.status} ${res.statusText}`);
    }
    return { data: await res.json(), error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

export async function fetchExternal(url) {
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`External API error: ${res.status} ${res.statusText}`);
    }
    return { data: await res.json(), error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}
