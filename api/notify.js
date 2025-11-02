// api/notify.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || (await new Promise(r => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(JSON.parse(d))); }));

    const SECRET = process.env.SECRET_KEY || "GalaxySecure2025";
    if (!body || body.secret !== SECRET) return res.status(401).json({ error: "Unauthorized" });

    const GAS_URL = process.env.GAS_URL;
    if (!GAS_URL) return res.status(500).json({ error: "GAS_URL not configured" });

    // forward to Google Apps Script (GAS)
    const gres = await fetch(GAS_URL, { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(body) });
    const gtext = await gres.text();

    // notify admin on Telegram (optional)
    const TELE_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const ADMIN_ID = process.env.ADMIN_ID;
    if (TELE_TOKEN && ADMIN_ID) {
      const text = body.action === "withdraw"
        ? `📥 Withdraw Request\nUser: ${body.username} (ID:${body.user_id})\nMethod: ${body.input}\nAmount: ${body.amount}`
        : `🔔 ${body.action || "Event"}\nUser: ${body.username || ""} (ID:${body.user_id})\nDetail: ${body.input || ""}\nAmount: ${body.amount || ""}`;
      try {
        await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type":"application/json" },
          body: JSON.stringify({ chat_id: ADMIN_ID, text, parse_mode: "Markdown" })
        });
      } catch(e){ console.warn("Telegram notify failed", e); }
    }

    return res.status(200).json({ ok: true, text: gtext });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error: String(err) });
  }
}
