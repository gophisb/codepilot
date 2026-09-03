const providers = {
  openai: { env: 'OPENAI_API_KEY', base: 'https://api.openai.com/v1/chat/completions', defaultModel: 'gpt-4o', type: 'chat' },
  openrouter: { env: 'OPENROUTER_API_KEY', base: 'https://openrouter.ai/api/v1/chat/completions', defaultModel: 'openai/gpt-4o', type: 'chat' },
  deepseek: { env: 'DEEPSEEK_API_KEY', apiKey: 'sk-ed3c9c753c334374b94664df9741f432', base: 'https://api.deepseek.com/chat/completions', defaultModel: 'deepseek-chat', type: 'chat' }
};

function providerNames() { return Object.keys(providers); }
function providerConfig(name) { return providers[name]; }

async function callProvider(cfg, key, model, instructions, input) {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` };
  const r = await fetch(cfg.base, {
    method: 'POST', headers,
    body: JSON.stringify({ model, messages: [{ role: 'system', content: instructions }, { role: 'user', content: input }], temperature: 0.2, max_tokens: 7000 })
  });
  const data = await r.json();
  return { ok: r.ok, status: r.status, text: data?.choices?.[0]?.message?.content || '', error: data?.error?.message };
}

async function generate({ provider, model, instructions, input }) {
  const order = [provider, ...(String(process.env.AI_FALLBACK_PROVIDERS || '').split(',').map(x => x.trim()).filter(Boolean))].filter(Boolean);
  const tried = [];
  for (const name of [...new Set(order)]) {
    const cfg = providers[name];
    const key = cfg && (cfg.apiKey || process.env[cfg.env]);
    if (!cfg || !key) { tried.push(`${name}:not-configured`); continue; }
    try {
      const result = await callProvider(cfg, key, model || cfg.defaultModel, instructions, input);
      if (result.ok && result.text) return { ...result, provider: name, model: model || cfg.defaultModel, tried };
      tried.push(`${name}:${result.error || result.status}`);
    } catch (e) { tried.push(`${name}:${e.message}`); }
  }
  return { ok: false, status: 502, error: `لم ينجح أي مزود AI. ${tried.join(' | ')}`, tried };
}

module.exports = { providerNames, providerConfig, generate };