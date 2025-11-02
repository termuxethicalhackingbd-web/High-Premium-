// api/notify.js  (Vercel serverless)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = req.body || (await new Promise(r => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(JSON.parse(d))); }));
    const SECRET = process.env.SECRET_KEY || 'GalaxySecure2025';
    if (!body || body.secret !== SECRET) return res.status(401).json({ error: 'Unauthorized' });

    const TELE_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const ADMIN_ID = process.env.ADMIN_ID;
    if (!TELE_TOKEN || !ADMIN_ID) return res.status(500).json({ error: 'Server not configured (missing TELE_TOKEN/ADMIN_ID)' });

    let text = '';
    if (body.type === 'withdraw' && body.payload) {
      const p = body.payload;
      text = `📥 *Withdraw Request*\n\nUser: ${p.username} (ID: ${p.user_id})\nMethod: ${p.input}\nAmount: ${p.amount} USDT\n\nPlease review and process.`;
    } else if (body.type === 'ad_click') {
      const b = body;
      text = `🔔 Ad Click\nUser: ${b.username} (ID: ${b.user_id})\nDetail: ${b.detail}\nAmount: ${b.amount || 0}`;
    } else {
      text = `🔔 Notification\n` + '```' + JSON.stringify(body, null, 2) + '```';
    }

    const tgUrl = `https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`;
    const payload = {
      chat_id: ADMIN_ID,
      text: text,
      parse_mode: 'Markdown'
    };

    const fetchRes = await fetch(tgUrl, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    const j = await fetchRes.json();
    if(!j || !j.ok) {
      return res.status(500).json({ ok:false, error: j });
    }
    return res.status(200).json({ ok:true, result: j });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
