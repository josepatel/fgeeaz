const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS });
    }

    try {
      const url = new URL(request.url);

      if (url.pathname === '/send') {
        const { channel, text, reply_markup } = await request.json();
        const chatMap = { clicks: env.CHAT_CLICKS, important: env.CHAT_IMPORTANT };
        const chat_id = chatMap[channel];
        if (!chat_id) return json({ ok: false, error: 'invalid channel' }, 400);
        const payload = { chat_id, text, parse_mode: 'HTML' };
        if (reply_markup) payload.reply_markup = reply_markup;
        const result = await tg(env, 'sendMessage', payload);
        return json(result);
      }

      return json({ ok: false, error: 'not found' }, 404);
    } catch (e) {
      return json({ ok: false, error: e.message }, 500);
    }
  },
};
